#!/usr/bin/env python3
"""
Enhanced web server for GeoScope with Ollama proxy support.
Replaces the basic SimpleHTTPServer with one that handles /api/ollama proxying.
"""

import json
import os
import re
import time
import urllib.request
import urllib.error
import sqlite3
import hashlib
import hmac
import secrets
import threading
from xml.etree import ElementTree as ET
from http.server import SimpleHTTPRequestHandler, HTTPServer, ThreadingHTTPServer
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape as _html_unescape

# ── User accounts (register / login) ──
# A small self-contained auth layer backed by SQLite. Passwords are stored only
# as a salted PBKDF2-SHA256 hash (never plaintext). A login/registration issues a
# random session token the browser keeps in localStorage and sends back as a
# Bearer token. No external service needed — everything lives in auth.db.

def _resolve_db_path():
    """Locate the auth database, preferring a PERSISTENT location so user
    accounts (and their plan / Stripe links) survive container redeploys.

    Railway and most PaaS use an EPHEMERAL container filesystem: anything written
    next to the app is wiped on every deploy. Mounting a persistent volume (e.g.
    at /data) and storing the DB there is what keeps registered users from
    vanishing. Resolution order:
      1. AUTH_DB_PATH env var — explicit override (set this on Railway).
      2. A mounted, writable persistent volume at a conventional path.
      3. A local file next to this script (dev / no-volume fallback).
    """
    override = os.environ.get('AUTH_DB_PATH', '').strip()
    if override:
        try:
            os.makedirs(os.path.dirname(override) or '.', exist_ok=True)
        except Exception:
            pass
        return override
    # Auto-detect a mounted volume. These dirs only exist when a volume is
    # actually mounted there, so we never pick an ephemeral path by mistake.
    for vol in ('/data', '/var/data', '/mnt/data', '/persist'):
        if os.path.isdir(vol) and os.access(vol, os.W_OK):
            return os.path.join(vol, 'auth.db')
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'auth.db')


_AUTH_DB = _resolve_db_path()
_AUTH_LOCK = threading.Lock()
_PBKDF2_ROUNDS = 200_000
# Session lifetime. Tokens older than this are treated as expired (the browser
# is asked to log in again). Keeps the sessions table from growing forever.
_SESSION_TTL = 90 * 24 * 3600  # 90 days

# Stripe price for the Pro plan ($9.99/mo). Recreate this id (and the secret
# key in stripe_secret.txt) in Live mode when going to production.
STRIPE_PRICE_PRO  = 'price_1TlnPE9mdlExjEPw31MJVnGe'
STRIPE_PRICE_TEAM = 'price_1TlpGs9mdlExjEPwzBkE2fF3'

# The single developer/owner account that may bypass payment + hard-reset.
# Deliberately HARD-CODED (not read from an env var) so a stray DEV_EMAILS value
# on the host can never silently grant dev powers (Reset, free plan upgrades) to
# any other account. To add another dev, edit this set explicitly.
DEV_EMAILS = {'samimansouri365@gmail.com'}
def _is_dev_email(email):
    return bool(email) and email.strip().lower() in DEV_EMAILS

def _safe_json(blob):
    """Parse a stored JSON column to a Python object, or None on empty/garbage."""
    if not blob:
        return None
    try:
        return json.loads(blob)
    except Exception:
        return None

# Plan limits enforced server-side (the client mirrors these for UX only).
#   free → no AI at all     pro → PRO_AI_DAILY assistant uses per rolling 24h
#   team → unlimited AI
PRO_AI_DAILY = 10
_AI_QUOTA_WINDOW = 24 * 3600   # rolling window: a true 24-hour wait, not a midnight reset


def _ai_quota(user_id):
    """Assistant uses inside the rolling last 24 hours. When the cap is hit,
    each slot frees up exactly 24h after the use that consumed it — the user
    literally waits 24 hours, which is what was asked for."""
    cutoff = time.time() - _AI_QUOTA_WINDOW
    with _auth_db() as conn:
        row = conn.execute(
            'SELECT COUNT(*) AS n FROM ai_events WHERE user_id=? AND ts>?',
            (user_id, cutoff)).fetchone()
    return int(row['n']) if row else 0


def _ai_quota_consume(user_id):
    """Record one assistant use now (pruning events older than the window for
    every user — the table stays tiny) and return the in-window count."""
    now = time.time()
    with _AUTH_LOCK, _auth_db() as conn:
        conn.execute('DELETE FROM ai_events WHERE ts<?', (now - _AI_QUOTA_WINDOW,))
        conn.execute('INSERT INTO ai_events (user_id, ts) VALUES (?,?)', (user_id, now))
        conn.commit()
        row = conn.execute(
            'SELECT COUNT(*) AS n FROM ai_events WHERE user_id=?', (user_id,)).fetchone()
    return int(row['n']) if row else 1


def _auth_db():
    # busy_timeout lets a connection wait instead of instantly erroring with
    # "database is locked" when another thread holds the write lock — important
    # under ThreadingHTTPServer where several requests hit the DB at once.
    conn = sqlite3.connect(_AUTH_DB, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA busy_timeout=5000')
    return conn


def _auth_init():
    with _AUTH_LOCK, _auth_db() as conn:
        # WAL improves read/write concurrency for the threaded server and is
        # durable across restarts. Set once; it's a persistent DB property.
        try:
            conn.execute('PRAGMA journal_mode=WAL')
        except sqlite3.OperationalError:
            pass
        conn.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            pw_hash TEXT NOT NULL,
            pw_salt TEXT NOT NULL,
            created REAL NOT NULL)''')
        conn.execute('''CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            created REAL NOT NULL)''')
        # LEGACY day-keyed AI usage (kept so old DBs load; no longer written).
        conn.execute('''CREATE TABLE IF NOT EXISTS ai_usage (
            user_id INTEGER NOT NULL,
            day TEXT NOT NULL,
            n INTEGER NOT NULL DEFAULT 0,
            PRIMARY KEY (user_id, day))''')
        # Rolling-24h AI usage: one row per counted assistant use (chat message
        # or chat source add/remove). The Pro cap counts rows in the last 24h,
        # so a maxed-out user waits a true 24 hours per freed slot. Team never
        # writes here (unlimited); rows older than the window are pruned.
        conn.execute('''CREATE TABLE IF NOT EXISTS ai_events (
            user_id INTEGER NOT NULL,
            ts REAL NOT NULL)''')
        conn.execute('CREATE INDEX IF NOT EXISTS idx_ai_events_user_ts '
                     'ON ai_events (user_id, ts)')
        # Password reset tokens: one-time use, 1 hour TTL.
        conn.execute('''CREATE TABLE IF NOT EXISTS password_reset_tokens (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            created REAL NOT NULL)''')
        # Billing columns. Added with try/except so re-runs on an existing DB
        # don't error — SQLite has no "ADD COLUMN IF NOT EXISTS" before 3.35.
        for col_sql in (
            "ALTER TABLE users ADD COLUMN plan TEXT DEFAULT 'free'",
            "ALTER TABLE users ADD COLUMN stripe_customer_id TEXT",
            "ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT",
            # Paid-through timestamp set when the user cancels: the plan stays
            # active until this moment, then drops to free (checked at auth).
            "ALTER TABLE users ADD COLUMN plan_until REAL",
            # Onboarding profile (JSON). Bound to the account so the wizard runs
            # once and is never asked again, on any device.
            "ALTER TABLE users ADD COLUMN profile TEXT",
            # The user's news sources (JSON array). Bound to the account so the
            # web "doesn't forget" the user's feed across devices/logins.
            "ALTER TABLE users ADD COLUMN sources TEXT",
        ):
            try:
                conn.execute(col_sql)
            except sqlite3.OperationalError:
                pass
        conn.commit()


def _read_stripe_secret():
    """Read the Stripe secret key. Prefer env var STRIPE_SECRET_KEY; fall back
    to stripe_secret.txt next to this script. Never sent to the client."""
    key = os.environ.get('STRIPE_SECRET_KEY', '').strip()
    if key:
        return key
    here = os.path.dirname(os.path.abspath(__file__))
    try:
        with open(os.path.join(here, 'stripe_secret.txt'), 'r', encoding='utf-8-sig') as fh:
            return ''.join(ch for ch in fh.read() if ord(ch) > 32)
    except Exception:
        return ''


def _stripe_request(method, path, form=None):
    """Minimal Stripe REST call using urllib. Returns the parsed JSON or raises."""
    from urllib.parse import urlencode
    key = _read_stripe_secret()
    if not key:
        raise RuntimeError('stripe_key_missing')
    url = 'https://api.stripe.com' + path
    data = urlencode(form, doseq=True).encode('utf-8') if form else None
    req = urllib.request.Request(
        url, data=data, method=method,
        headers={
            'Authorization': 'Bearer ' + key,
            'Content-Type': 'application/x-www-form-urlencoded',
        })
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


# Password-reset email copy in all 13 UI languages. Keys: subject, heading,
# body, button, expiry, rights. Falls back to 'en' for unknown/missing langs.
_RESET_EMAIL_I18N = {
    'es': {'subject': 'Restablecer tu contraseña en Skorpene', 'heading': 'Restablecer tu contraseña', 'body': 'Haz clic en el botón para cambiar tu contraseña:', 'button': 'Restablecer contraseña', 'expiry': 'Este enlace expira en 1 hora.', 'rights': 'Todos los derechos reservados.'},
    'en': {'subject': 'Reset your password on Skorpene', 'heading': 'Reset your password', 'body': 'Click the button to change your password:', 'button': 'Reset password', 'expiry': 'This link expires in 1 hour.', 'rights': 'All rights reserved.'},
    'fr': {'subject': 'Réinitialisez votre mot de passe sur Skorpene', 'heading': 'Réinitialiser votre mot de passe', 'body': 'Cliquez sur le bouton pour changer votre mot de passe :', 'button': 'Réinitialiser le mot de passe', 'expiry': 'Ce lien expire dans 1 heure.', 'rights': 'Tous droits réservés.'},
    'ru': {'subject': 'Сброс пароля в Skorpene', 'heading': 'Сбросить пароль', 'body': 'Нажмите на кнопку, чтобы изменить пароль:', 'button': 'Сбросить пароль', 'expiry': 'Эта ссылка действительна 1 час.', 'rights': 'Все права защищены.'},
    'zh': {'subject': '在 Skorpene 上重置密码', 'heading': '重置密码', 'body': '点击按钮更改密码：', 'button': '重置密码', 'expiry': '此链接将在1小时后失效。', 'rights': '保留所有权利。'},
    'tr': {'subject': "Skorpene'de şifreni sıfırla", 'heading': 'Şifreni sıfırla', 'body': 'Şifreni değiştirmek için butona tıkla:', 'button': 'Şifreyi sıfırla', 'expiry': 'Bu bağlantının süresi 1 saat içinde dolacak.', 'rights': 'Tüm hakları saklıdır.'},
    'ar': {'subject': 'إعادة تعيين كلمة المرور في Skorpene', 'heading': 'إعادة تعيين كلمة المرور', 'body': 'انقر فوق الزر لتغيير كلمة المرور:', 'button': 'إعادة تعيين كلمة المرور', 'expiry': 'تنتهي صلاحية هذا الرابط خلال ساعة واحدة.', 'rights': 'جميع الحقوق محفوظة.', 'rtl': True},
    'fa': {'subject': 'بازنشانی رمز عبور در Skorpene', 'heading': 'بازنشانی رمز عبور', 'body': 'برای تغییر رمز عبور روی دکمه کلیک کن:', 'button': 'بازنشانی رمز عبور', 'expiry': 'این لینک تا ۱ ساعت دیگر منقضی می‌شود.', 'rights': 'تمامی حقوق محفوظ است.', 'rtl': True},
    'he': {'subject': 'איפוס הסיסמה שלך ב-Skorpene', 'heading': 'איפוס הסיסמה שלך', 'body': 'לחץ על הכפתור כדי לשנות את הסיסמה שלך:', 'button': 'איפוס סיסמה', 'expiry': 'קישור זה יפוג בעוד שעה אחת.', 'rights': 'כל הזכויות שמורות.', 'rtl': True},
    'nl': {'subject': 'Wachtwoord opnieuw instellen op Skorpene', 'heading': 'Wachtwoord opnieuw instellen', 'body': 'Klik op de knop om je wachtwoord te wijzigen:', 'button': 'Wachtwoord opnieuw instellen', 'expiry': 'Deze link verloopt over 1 uur.', 'rights': 'Alle rechten voorbehouden.'},
    'it': {'subject': 'Reimposta la password su Skorpene', 'heading': 'Reimposta la tua password', 'body': 'Clicca sul pulsante per cambiare la tua password:', 'button': 'Reimposta password', 'expiry': 'Questo link scade tra 1 ora.', 'rights': 'Tutti i diritti riservati.'},
    'pt': {'subject': 'Repor a palavra-passe no Skorpene', 'heading': 'Repor a tua palavra-passe', 'body': 'Clica no botão para mudar a tua palavra-passe:', 'button': 'Repor palavra-passe', 'expiry': 'Este link expira em 1 hora.', 'rights': 'Todos os direitos reservados.'},
    'hi': {'subject': 'Skorpene पर अपना पासवर्ड रीसेट करें', 'heading': 'अपना पासवर्ड रीसेट करें', 'body': 'अपना पासवर्ड बदलने के लिए बटन पर क्लिक करें:', 'button': 'पासवर्ड रीसेट करें', 'expiry': 'यह लिंक 1 घंटे में समाप्त हो जाएगा।', 'rights': 'सर्वाधिकार सुरक्षित।'},
}


def _send_password_reset_email(email, reset_token, brevo_api_key, lang='en'):
    """Send password reset email via Brevo API, localized to `lang` (falls
    back to English for unsupported/missing codes). Returns True on success."""
    if not brevo_api_key or not reset_token:
        return False
    try:
        t = _RESET_EMAIL_I18N.get((lang or '').lower(), _RESET_EMAIL_I18N['en'])
        dir_attr = ' dir="rtl"' if t.get('rtl') else ''
        reset_url = f"https://www.skorpene.com/?reset={reset_token}"
        sender = {"name": "Skorpene", "email": "noreply@skorpene.com"}
        to = [{"email": email}]
        subject = t['subject']

        html_content = f"""
        <!DOCTYPE html>
        <html{dir_attr}>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 40px 20px; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 8px; }}
                h2 {{ color: #333; margin-top: 0; }}
                p {{ color: #666; line-height: 1.6; margin: 15px 0; }}
                .button {{ text-align: center; margin: 25px 0; }}
                .button a {{ background: #8b5cf6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px; }}
                .button a:hover {{ background: #7c3aed; }}
                .footer {{ text-align: center; color: #999; font-size: 12px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="content">
                    <h2>{t['heading']}</h2>
                    <p>{t['body']}</p>
                    <div class="button">
                        <a href="{reset_url}">{t['button']}</a>
                    </div>
                    <p style="text-align: center; color: #999; font-size: 12px;">{t['expiry']}</p>
                </div>
                <div class="footer">
                    <p>© Skorpene. {t['rights']}</p>
                </div>
            </div>
        </body>
        </html>
        """
        payload = {
            "sender": sender,
            "to": to,
            "subject": subject,
            "htmlContent": html_content
        }
        import json
        req = urllib.request.Request(
            'https://api.brevo.com/v3/smtp/email',
            data=json.dumps(payload).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'api-key': brevo_api_key
            }
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status == 201
    except Exception as e:
        print(f"[Brevo] email send failed: {e}", file=sys.stderr)
        return False


def _sub_period_end(sub):
    """Paid-through timestamp of a Stripe subscription. Newer API versions set
    cancel_at once cancel_at_period_end is on (and keep current_period_end on
    the items); older ones expose current_period_end on the root object."""
    for v in (sub.get('cancel_at'), sub.get('current_period_end')):
        if v:
            return float(v)
    try:
        items = ((sub.get('items') or {}).get('data')) or []
        v = items[0].get('current_period_end') if items else None
        if v:
            return float(v)
    except Exception:
        pass
    print('[Stripe] subscription has no period end; defaulting to +30d', file=sys.stderr)
    return time.time() + 30 * 86400


def _row_value(row, key):
    """sqlite3.Row lookup that tolerates a column missing (pre-migration DB)."""
    try:
        return row[key]
    except Exception:
        return None


def _hash_pw(password, salt):
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'),
                               bytes.fromhex(salt), _PBKDF2_ROUNDS).hex()


def _new_session(conn, user_id):
    token = secrets.token_urlsafe(32)
    now = time.time()
    conn.execute('INSERT INTO sessions (token, user_id, created) VALUES (?,?,?)',
                 (token, user_id, now))
    # Opportunistic housekeeping: drop sessions past their TTL so the table
    # doesn't grow without bound and stale tokens can't be replayed.
    conn.execute('DELETE FROM sessions WHERE created < ?', (now - _SESSION_TTL,))
    conn.commit()
    return token


_EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')

OLLAMA_HOST = 'http://localhost:11434'
OLLAMA_ENDPOINT = '/api/generate'

# ── News outlets (RSS) ──
# Fetched server-side (the browser can't read these directly — CORS). If a feed
# URL changes, edit it here. Feeds that fail are skipped silently.
NEWS_OUTLETS = [
    {'id': 'aljazeera', 'name': 'Al Jazeera',    'url': 'https://www.aljazeera.com/xml/rss/all.xml'},
    {'id': 'bbc',       'name': 'BBC',           'url': 'https://feeds.bbci.co.uk/news/world/rss.xml'},
    {'id': 'diplomat',  'name': 'The Diplomat',  'url': 'https://thediplomat.com/feed/'},
    {'id': 'csis',      'name': 'CSIS',          'url': 'https://www.csis.org/rss.xml'},
]
OUTLETS_TTL = 300  # cache feeds for 5 minutes
_outlets_cache = {'ts': 0, 'data': None}

# Per-URL cache for user-added feeds (the /api/rss endpoint). Keyed by feed URL,
# each entry is {'ts': <fetch time>, 'name': <feed title>, 'articles': [...]}.
# Two jobs:
#   1. Don't re-hit a source more than once per TTL — refreshes happen often and
#      the add flow probes then immediately refreshes the same URL.
#   2. Stale-while-error: if a later fetch is rate-limited / blocked (Reddit 429,
#      Cloudflare, a transient 5xx), serve the last good articles instead of an
#      empty list, so the news + icons stay on screen. This is THE fix for
#      Reddit communities, which 429 aggressive repeat callers.
USER_RSS_TTL = 150            # serve a cached copy if it's younger than this
_user_rss_cache = {}          # url -> {'ts', 'name', 'articles'}


def _strip_html(s):
    """Remove HTML tags / collapse whitespace from an RSS description."""
    if not s:
        return ''
    s = re.sub(r'<[^>]+>', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s[:400]


def _parse_feed(raw, outlet):
    """Parse an RSS 2.0 or Atom feed into a list of article dicts."""
    out = []
    try:
        root = ET.fromstring(raw)
    except Exception:
        return out
    items = root.findall('.//item')  # RSS 2.0
    if items:
        for it in items[:15]:
            out.append({
                'source': outlet['name'], 'source_id': outlet['id'],
                'title': (it.findtext('title') or '').strip(),
                'link': (it.findtext('link') or '').strip(),
                'summary': _strip_html(it.findtext('description') or ''),
                'published': (it.findtext('pubDate') or '').strip(),
            })
        return out
    ns = '{http://www.w3.org/2005/Atom}'  # Atom fallback
    for it in root.findall('.//{0}entry'.format(ns))[:15]:
        link_el = it.find('{0}link'.format(ns))
        out.append({
            'source': outlet['name'], 'source_id': outlet['id'],
            'title': (it.findtext('{0}title'.format(ns)) or '').strip(),
            'link': (link_el.get('href') if link_el is not None else '') or '',
            'summary': _strip_html(it.findtext('{0}summary'.format(ns)) or it.findtext('{0}content'.format(ns)) or ''),
            'published': (it.findtext('{0}updated'.format(ns)) or '').strip(),
        })
    return out


# Phrases that show up as anchor text on news homepages but are NOT articles —
# navigation, sections, legal, social. Lowercased substring match.
_NAV_NOISE = (
    'cookie', 'privacy', 'política de privacidad', 'aviso legal', 'términos', 'terms',
    'subscribe', 'suscr', 'sign in', 'log in', 'iniciar sesión', 'newsletter',
    'contact', 'contacto', 'about us', 'quiénes somos', 'advertis', 'publicidad',
    'follow us', 'síguenos', 'download', 'descarga', 'menu', 'menú', 'home', 'inicio',
    'broadcasting corporation', 'all rights', 'copyright',
)


def _extract_articles_from_html(raw, base_url, outlet):
    """Heuristic article extraction for pages with NO RSS/Atom feed.

    Scans the HTML for <a href> links whose anchor text reads like a headline
    (several words, reasonable length) and that point to same-site article URLs.
    Decodes HTML entities, strips noise/navigation, dedupes. This is what makes
    ANY fetchable news homepage usable even when it exposes no feed (e.g. bbc.com,
    whose feed lives on a different subdomain). Quality is lower than RSS but it
    reliably yields real headlines + working links. No AI cost.
    """
    from urllib.parse import urljoin, urlparse
    try:
        html = raw.decode('utf-8', 'replace')
    except Exception:
        return []
    base_host = urlparse(base_url).netloc.replace('www.', '').lower()
    anchors = re.findall(r'<a\b[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, re.S | re.I)
    seen_href = set()
    seen_title = set()
    out = []
    for href, inner in anchors:
        # Clean the anchor text → plain headline.
        txt = re.sub(r'<[^>]+>', ' ', inner)
        txt = _html_unescape(re.sub(r'\s+', ' ', txt)).strip()
        if not (28 <= len(txt) <= 170):
            continue
        words = txt.split()
        if len(words) < 5:                      # headlines have several words
            continue
        low = txt.lower()
        if any(n in low for n in _NAV_NOISE):
            continue
        # Resolve + validate the link: same site, looks like an article path.
        href = href.strip()
        if href.startswith('#') or href.lower().startswith(('javascript:', 'mailto:', 'tel:')):
            continue
        full = urljoin(base_url, href)
        pr = urlparse(full)
        if pr.scheme not in ('http', 'https'):
            continue
        if base_host not in pr.netloc.replace('www.', '').lower():
            continue                            # only same-site links
        path = pr.path.rstrip('/')
        if len(path) < 8:                       # skip section roots like /news
            continue
        if full in seen_href or low in seen_title:
            continue
        seen_href.add(full)
        seen_title.add(low)
        out.append({
            'source': outlet['name'], 'source_id': outlet['id'],
            'title': txt, 'link': full, 'summary': '', 'published': '',
        })
        if len(out) >= 15:
            break
    return out

# ── Claude (Anthropic) proxy config ──
# The API key is SECRET and read from the environment — never hard-code it and
# never send it to the browser. Start the server with:
#   export ANTHROPIC_API_KEY=sk-ant-...   (then)   python3 start_server.py
ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
ANTHROPIC_VERSION = '2023-06-01'
# Default model: Sonnet 4.6 (best speed/intelligence balance). Override with a more capable model, e.g.:
#   export ANTHROPIC_MODEL=claude-opus-4-8
ANTHROPIC_MODEL = os.environ.get('ANTHROPIC_MODEL', 'claude-sonnet-4-6')


def _read_api_key():
    """Return the Anthropic API key from the env, or fall back to a local
    `mikey.txt` file in this folder. Using a file means the user sets the key
    ONCE and every `python3 start_server.py` (or the preview launcher) picks it
    up — no need to `export` it each time. The file is read with utf-8-sig so a
    BOM added by a text editor is stripped, and all whitespace is removed."""
    key = os.environ.get('ANTHROPIC_API_KEY', '').strip()
    if key:
        return key
    try:
        here = os.path.dirname(os.path.abspath(__file__))
        with open(os.path.join(here, 'mikey.txt'), 'r', encoding='utf-8-sig') as fh:
            return ''.join(ch for ch in fh.read() if ord(ch) > 32)
    except Exception:
        return ''


# Self-contained admin dashboard. Served at /admin; it asks for the admin token
# once (kept in localStorage) and renders users + stats from /api/admin/users.
# No build step, no framework — plain HTML/CSS/JS in Skorpene's dark/purple look.
_ADMIN_PAGE_HTML = r'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Skorpene · Admin</title>
<style>
  :root{ --bg:#0b0710; --panel:#151021; --panel2:#1c1530; --line:#2a2140;
         --text:#ece7fa; --muted:#9b93b8; --purple:#8b5cf6; --purple2:#6d28d9;
         --green:#34d399; --amber:#f0b070; }
  *{ box-sizing:border-box; }
  body{ margin:0; background:radial-gradient(1200px 600px at 50% -10%, #1a1030 0%, var(--bg) 60%);
        color:var(--text); font:14px/1.5 Inter,system-ui,Segoe UI,Roboto,sans-serif;
        min-height:100vh; }
  .wrap{ max-width:1080px; margin:0 auto; padding:28px 20px 60px; }
  header{ display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:24px; }
  .brand{ display:flex; align-items:center; gap:12px; font-weight:700; font-size:20px; }
  .brand .dot{ width:30px; height:30px; border-radius:9px;
    background:linear-gradient(135deg,var(--purple),var(--purple2));
    box-shadow:0 6px 18px rgba(139,92,246,.45); }
  .muted{ color:var(--muted); }
  button{ font:inherit; cursor:pointer; border-radius:10px; border:1px solid var(--line);
    background:var(--panel2); color:var(--text); padding:9px 14px; transition:.15s; }
  button:hover{ border-color:var(--purple); }
  button.primary{ background:linear-gradient(135deg,var(--purple),var(--purple2));
    border:none; color:#fff; box-shadow:0 6px 16px rgba(109,40,217,.4); }
  input{ font:inherit; background:var(--panel); border:1px solid var(--line);
    color:var(--text); border-radius:10px; padding:11px 13px; width:100%; }
  input:focus{ outline:none; border-color:var(--purple); }
  .gate{ max-width:380px; margin:12vh auto 0; background:var(--panel);
    border:1px solid var(--line); border-radius:16px; padding:26px; }
  .gate h1{ font-size:18px; margin:0 0 4px; }
  .gate p{ margin:0 0 16px; }
  .row{ display:flex; gap:10px; margin-top:12px; }
  .cards{ display:grid; grid-template-columns:repeat(5,1fr); gap:12px; margin-bottom:22px; }
  .card{ background:var(--panel); border:1px solid var(--line); border-radius:14px; padding:16px; }
  .card .n{ font-size:26px; font-weight:700; }
  .card .l{ font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:.04em; margin-top:2px; }
  .toolbar{ display:flex; gap:10px; align-items:center; margin-bottom:14px; }
  .toolbar input{ flex:1; }
  table{ width:100%; border-collapse:collapse; background:var(--panel);
    border:1px solid var(--line); border-radius:14px; overflow:hidden; }
  th,td{ text-align:left; padding:12px 14px; border-bottom:1px solid var(--line); }
  th{ font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:.04em; }
  tr:last-child td{ border-bottom:none; }
  tr:hover td{ background:rgba(139,92,246,.06); }
  .badge{ display:inline-block; padding:3px 10px; border-radius:999px; font-size:12px; font-weight:600; }
  .b-free{ background:#241c38; color:#b9b1d6; }
  .b-pro{ background:rgba(139,92,246,.18); color:#c7b6ff; }
  .b-team{ background:rgba(52,211,153,.16); color:var(--green); }
  .pay{ color:var(--green); font-weight:600; }
  .err{ color:#ff8da3; margin-top:10px; min-height:18px; }
  .footer{ margin-top:18px; font-size:12px; }
  code{ background:var(--panel2); padding:2px 6px; border-radius:6px; }
  @media(max-width:760px){ .cards{ grid-template-columns:repeat(2,1fr); } .hide-sm{ display:none; } }
</style>
</head>
<body>
<div id="gate" class="gate" style="display:none">
  <h1>Skorpene Admin</h1>
  <p class="muted">Enter the admin token to view registered users.</p>
  <input id="tok" type="password" placeholder="Admin token" autocomplete="off">
  <div class="row"><button class="primary" style="flex:1" onclick="saveTok()">Enter</button></div>
  <div id="gateErr" class="err"></div>
</div>

<div id="app" class="wrap" style="display:none">
  <header>
    <div class="brand"><span class="dot"></span> Skorpene · Admin</div>
    <div class="row">
      <button onclick="load()">↻ Refresh</button>
      <button onclick="logout()">Sign out</button>
    </div>
  </header>
  <div id="cards" class="cards"></div>
  <div class="toolbar">
    <input id="search" placeholder="Search email or name…" oninput="render()">
    <span id="count" class="muted"></span>
  </div>
  <table>
    <thead><tr>
      <th>ID</th><th>Email</th><th class="hide-sm">Name</th><th>Plan</th>
      <th>Paying</th><th class="hide-sm">Registered</th>
    </tr></thead>
    <tbody id="rows"></tbody>
  </table>
  <div class="footer muted">Data file: <code id="dbpath">—</code></div>
  <div id="err" class="err"></div>
</div>

<script>
const TK='skorpene_admin_token';
let DATA=null;
function tok(){ return localStorage.getItem(TK)||''; }
function show(el){ document.getElementById('gate').style.display = el==='gate'?'block':'none';
  document.getElementById('app').style.display = el==='app'?'block':'none'; }
function saveTok(){ const v=document.getElementById('tok').value.trim();
  if(!v){ return; } localStorage.setItem(TK,v); load(); }
function logout(){ localStorage.removeItem(TK); show('gate');
  document.getElementById('tok').value=''; }
function fmtDate(ts){ if(!ts) return '—'; const d=new Date(ts*1000);
  return d.toLocaleDateString()+' '+d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); }
function esc(s){ return (s||'').replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

async function load(){
  const t=tok(); if(!t){ show('gate'); return; }
  try{
    const r=await fetch('/api/admin/users',{headers:{'Authorization':'Bearer '+t}});
    if(r.status===401){ document.getElementById('gateErr').textContent='Invalid token.'; show('gate'); return; }
    if(r.status===503){ const j=await r.json();
      document.getElementById('gateErr').textContent=j.detail||'Admin panel disabled.'; show('gate'); return; }
    if(!r.ok){ throw new Error('HTTP '+r.status); }
    DATA=await r.json(); show('app'); paintCards(); render();
    document.getElementById('dbpath').textContent=DATA.db_path||'—';
  }catch(e){ document.getElementById('err').textContent='Error: '+e.message; }
}
function paintCards(){
  const p=DATA.by_plan||{};
  const c=[['Total users',DATA.total],['Free',p.free||0],['Pro',p.pro||0],
           ['Team',p.team||0],['Active sessions',DATA.active_sessions||0]];
  document.getElementById('cards').innerHTML=c.map(x=>
    `<div class="card"><div class="n">${x[1]}</div><div class="l">${x[0]}</div></div>`).join('');
}
function render(){
  if(!DATA) return;
  const q=(document.getElementById('search').value||'').toLowerCase();
  const list=DATA.users.filter(u=>!q || (u.email||'').toLowerCase().includes(q) || (u.name||'').toLowerCase().includes(q));
  document.getElementById('count').textContent=list.length+' / '+DATA.users.length;
  document.getElementById('rows').innerHTML=list.map(u=>{
    const b=u.plan==='team'?'b-team':u.plan==='pro'?'b-pro':'b-free';
    return `<tr>
      <td>${u.id}</td>
      <td>${esc(u.email)}</td>
      <td class="hide-sm">${esc(u.name)||'<span class=muted>—</span>'}</td>
      <td><span class="badge ${b}">${u.plan}</span></td>
      <td>${u.paying?'<span class=pay>✓ yes</span>':'<span class=muted>no</span>'}</td>
      <td class="hide-sm muted">${fmtDate(u.created)}</td>
    </tr>`; }).join('') || '<tr><td colspan=6 class=muted style="padding:24px;text-align:center">No users found.</td></tr>';
}
if(tok()){ load(); } else { show('gate'); }
</script>
</body>
</html>'''


class GeoScopeHandler(SimpleHTTPRequestHandler):
    # Canonical host. Any request arriving at the bare apex (skorpene.com) is
    # 301-redirected to the www host so there is a single canonical origin and
    # the SSL certificate (issued for www) always matches. localhost, the
    # *.up.railway.app host and www itself are left untouched.
    CANONICAL_HOST = 'www.skorpene.com'
    APEX_HOSTS = ('skorpene.com',)

    def _maybe_redirect_apex(self):
        """If the Host header is the bare apex, send a 301 to the www host and
        return True (caller should stop). Otherwise return False."""
        host = (self.headers.get('Host') or '').strip().lower()
        # Strip any :port suffix before comparing.
        if ':' in host:
            host = host.split(':', 1)[0]
        if host in self.APEX_HOSTS:
            location = 'https://' + self.CANONICAL_HOST + self.path
            self.send_response(301)
            self.send_header('Location', location)
            self.send_header('Content-Length', '0')
            self.end_headers()
            return True
        return False

    def do_POST(self):
        """Handle POST requests: /api/ollama and /api/claude proxying."""
        if self._maybe_redirect_apex():
            return
        if self.path == '/api/ollama':
            self.handle_ollama_proxy()
        elif self.path == '/api/claude':
            self.handle_claude_proxy()
        elif self.path == '/api/auth/register':
            self.handle_auth_register()
        elif self.path == '/api/auth/login':
            self.handle_auth_login()
        elif self.path == '/api/auth/logout':
            self.handle_auth_logout()
        elif self.path == '/api/auth/profile':
            self.handle_auth_profile()
        elif self.path == '/api/auth/sources':
            self.handle_auth_sources()
        elif self.path == '/api/auth/dev-reset':
            self.handle_auth_dev_reset()
        elif self.path == '/api/billing/create-checkout-session':
            self.handle_billing_create_session()
        elif self.path == '/api/billing/dev-upgrade':
            self.handle_billing_dev_upgrade()
        elif self.path == '/api/subscription/cancel':
            self.handle_subscription_cancel()
        elif self.path == '/api/subscription/resume':
            self.handle_subscription_resume()
        elif self.path == '/api/auth/request-password-reset':
            self.handle_auth_request_password_reset()
        elif self.path == '/api/auth/reset-password':
            self.handle_auth_reset_password()
        else:
            self.send_error(404)

    def do_GET(self):
        """Serve /api/outlets (RSS aggregation) or fall back to static files."""
        if self._maybe_redirect_apex():
            return
        if self.path == '/api/outlets' or self.path.startswith('/api/outlets?'):
            self.handle_outlets()
        elif self.path.startswith('/api/tg'):
            self.handle_telegram_channel()
        elif self.path.startswith('/api/rss'):
            self.handle_user_rss()
        elif self.path == '/api/auth/me':
            self.handle_auth_me()
        elif self.path.startswith('/api/billing/verify-session'):
            self.handle_billing_verify_session()
        elif self.path == '/api/admin/users' or self.path.startswith('/api/admin/users?'):
            self.handle_admin_users()
        elif self.path == '/admin' or self.path.startswith('/admin?'):
            self.handle_admin_page()
        else:
            super().do_GET()

    # ── Auth handlers ──
    def _read_json_body(self):
        try:
            n = int(self.headers.get('Content-Length', 0))
            return json.loads(self.rfile.read(n) or b'{}')
        except Exception:
            return None

    def _bearer_token(self):
        h = self.headers.get('Authorization', '')
        return h[7:].strip() if h.lower().startswith('bearer ') else ''

    def handle_auth_register(self):
        data = self._read_json_body()
        if data is None:
            self._json_response(400, {'error': 'invalid_json'}); return
        email = (data.get('email') or '').strip().lower()
        name = (data.get('name') or '').strip()[:80]
        password = data.get('password') or ''
        if not _EMAIL_RE.match(email):
            self._json_response(400, {'error': 'invalid_email'}); return
        if len(password) < 6:
            self._json_response(400, {'error': 'weak_password'}); return
        salt = secrets.token_hex(16)
        pw_hash = _hash_pw(password, salt)
        try:
            with _AUTH_LOCK, _auth_db() as conn:
                cur = conn.execute(
                    'INSERT INTO users (email, name, pw_hash, pw_salt, created) VALUES (?,?,?,?,?)',
                    (email, name, pw_hash, salt, time.time()))
                uid = cur.lastrowid
                token = _new_session(conn, uid)
        except sqlite3.IntegrityError:
            self._json_response(409, {'error': 'email_taken'}); return
        self._json_response(200, {'token': token, 'user': {'email': email, 'name': name, 'plan': 'free', 'profile': None, 'sources': None, 'is_dev': _is_dev_email(email)}})

    def handle_auth_login(self):
        data = self._read_json_body()
        if data is None:
            self._json_response(400, {'error': 'invalid_json'}); return
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''
        with _AUTH_LOCK, _auth_db() as conn:
            row = conn.execute('SELECT * FROM users WHERE email=?', (email,)).fetchone()
            if not row or not hmac.compare_digest(_hash_pw(password, row['pw_salt']), row['pw_hash']):
                self._json_response(401, {'error': 'bad_credentials'}); return
            token = _new_session(conn, row['id'])
        self._json_response(200, {'token': token, 'user': self._user_payload(row)})

    def _user_payload(self, row):
        """The public user object sent to the client (login + /me)."""
        until = _row_value(row, 'plan_until')
        return {
            'email': row['email'], 'name': row['name'],
            'plan': row['plan'] or 'free',
            # Account-bound onboarding profile (null until the wizard is done).
            'profile': _safe_json(row['profile']),
            # Account-bound news sources (null until the user has any saved).
            'sources': _safe_json(row['sources']),
            'is_dev': _is_dev_email(row['email']),
            # Set only while a cancellation is pending: epoch seconds the paid
            # plan stays active until. The client shows "Resume subscription".
            'planUntil': float(until) if until else None,
        }

    def handle_auth_me(self):
        if not self._bearer_token():
            self._json_response(401, {'error': 'no_token'}); return
        # _user_from_token also applies the plan_until expiry, so a lapsed
        # cancellation is already reflected in the payload we return here.
        row = self._user_from_token()
        if not row:
            self._json_response(401, {'error': 'invalid_token'}); return
        self._json_response(200, {'user': self._user_payload(row)})

    def handle_auth_profile(self):
        """Persist the onboarding profile JSON onto the user's account so the
        wizard is never asked again, on any device. Auth'd via Bearer token."""
        user = self._user_from_token()
        if not user:
            self._json_response(401, {'error': 'invalid_token'}); return
        data = self._read_json_body()
        if data is None or not isinstance(data, dict):
            self._json_response(400, {'error': 'invalid_json'}); return
        try:
            blob = json.dumps(data)
        except Exception:
            self._json_response(400, {'error': 'invalid_json'}); return
        with _AUTH_LOCK, _auth_db() as conn:
            conn.execute('UPDATE users SET profile=? WHERE id=?', (blob, user['id']))
            conn.commit()
        self._json_response(200, {'ok': True})

    def handle_auth_sources(self):
        """Persist the user's news sources (JSON array) onto their account so the
        feed follows them across devices/logins. Auth'd via Bearer token."""
        user = self._user_from_token()
        if not user:
            self._json_response(401, {'error': 'invalid_token'}); return
        data = self._read_json_body()
        if not isinstance(data, list):
            self._json_response(400, {'error': 'invalid_json'}); return
        try:
            blob = json.dumps(data)
        except Exception:
            self._json_response(400, {'error': 'invalid_json'}); return
        with _AUTH_LOCK, _auth_db() as conn:
            conn.execute('UPDATE users SET sources=? WHERE id=?', (blob, user['id']))
            conn.commit()
        self._json_response(200, {'ok': True})

    def handle_auth_dev_reset(self):
        """Developer-only hard reset: wipe the account's onboarding profile +
        sources and drop the plan back to free, so the owner can replay the whole
        first-run experience. DEV_EMAILS only; everyone else gets 403."""
        user = self._user_from_token()
        if not user:
            self._json_response(401, {'error': 'invalid_token'}); return
        if not _is_dev_email(user['email']):
            self._json_response(403, {'error': 'not_dev'}); return
        with _AUTH_LOCK, _auth_db() as conn:
            conn.execute("UPDATE users SET profile=NULL, sources=NULL, plan='free', "
                         "stripe_customer_id=NULL, stripe_subscription_id=NULL, plan_until=NULL WHERE id=?",
                         (user['id'],))
            conn.commit()
        self._json_response(200, {'ok': True, 'plan': 'free'})

    def _user_from_token(self):
        """Resolve the bearer token to a users row, or None. Also the single
        place where a canceled subscription that reached its paid-through date
        (plan_until) drops to free — every gated endpoint and /me authenticate
        through here, so no Stripe webhook is needed for the downgrade."""
        token = self._bearer_token()
        if not token:
            return None
        min_created = time.time() - _SESSION_TTL
        q = ('SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id '
             'WHERE s.token=? AND s.created > ?')
        with _auth_db() as conn:
            row = conn.execute(q, (token, min_created)).fetchone()
        if row is None:
            return None
        until = _row_value(row, 'plan_until')
        if until and (row['plan'] or 'free') in ('pro', 'team') and time.time() > float(until):
            with _AUTH_LOCK, _auth_db() as conn:
                conn.execute("UPDATE users SET plan='free', plan_until=NULL, "
                             'stripe_subscription_id=NULL WHERE id=?', (row['id'],))
                conn.commit()
                row = conn.execute(q, (token, min_created)).fetchone()
        return row

    def handle_billing_dev_upgrade(self):
        """Switch a DEVELOPER account's plan without paying, so the owner can test
        the full gated Pro/Team experience. Server-enforced: only accounts whose
        email is in DEV_EMAILS may use this; everyone else gets 403 and the client
        falls back to real Stripe checkout."""
        user = self._user_from_token()
        if not user:
            self._json_response(401, {'error': 'invalid_token'}); return
        if not _is_dev_email(user['email']):
            self._json_response(403, {'error': 'not_dev'}); return
        data = self._read_json_body() or {}
        plan = (data.get('plan') or '').strip().lower()
        if plan not in ('free', 'pro', 'team'):
            self._json_response(400, {'error': 'bad_plan'}); return
        with _AUTH_LOCK, _auth_db() as conn:
            conn.execute('UPDATE users SET plan=?, plan_until=NULL WHERE id=?', (plan, user['id']))
            conn.commit()
        self._json_response(200, {'plan': plan, 'dev': True})

    def handle_billing_create_session(self):
        """Create a Stripe Checkout session for the Pro plan."""
        user = self._user_from_token()
        if not user:
            self._json_response(401, {'error': 'invalid_token'}); return
        data = self._read_json_body() or {}
        origin = (data.get('origin') or '').rstrip('/')
        if not origin:
            origin = 'http://localhost:8000'
        # Which plan the user picked. Defaults to 'pro'. This was previously
        # never read from the body, so Team checkouts wrongly billed the Pro price.
        plan = (data.get('plan') or 'pro').strip().lower()
        success_url = origin + '/?checkout=success&session_id={CHECKOUT_SESSION_ID}'
        cancel_url = origin + '/?checkout=cancelled'
        price_id = STRIPE_PRICE_TEAM if plan == 'team' else STRIPE_PRICE_PRO
        form = [
            ('mode', 'subscription'),
            ('line_items[0][price]', price_id),
            ('line_items[0][quantity]', '1'),
            ('success_url', success_url),
            ('cancel_url', cancel_url),
            ('client_reference_id', str(user['id'])),
            ('customer_email', user['email']),
            ('allow_promotion_codes', 'true'),
        ]
        try:
            session = _stripe_request('POST', '/v1/checkout/sessions', form)
        except RuntimeError as e:
            self._json_response(500, {'error': str(e)}); return
        except urllib.error.HTTPError as e:
            body = e.read().decode('utf-8', 'replace') if hasattr(e, 'read') else str(e)
            print('[Stripe] HTTP {0}: {1}'.format(e.code, body), file=sys.stderr)
            self._json_response(502, {'error': 'stripe_http', 'detail': body[:300]}); return
        except Exception as e:
            print('[Stripe] error: {0}'.format(e), file=sys.stderr)
            self._json_response(502, {'error': 'stripe_unreachable'}); return
        self._json_response(200, {'url': session.get('url'), 'id': session.get('id')})

    def handle_billing_verify_session(self):
        """Called by the success URL — verify the Stripe session was paid and
        upgrade the user. Safer than trusting the client to set plan=pro."""
        from urllib.parse import urlparse, parse_qs
        qs = parse_qs(urlparse(self.path).query)
        session_id = (qs.get('session_id', [''])[0] or '').strip()
        if not session_id or not session_id.startswith('cs_'):
            self._json_response(400, {'error': 'missing_session_id'}); return
        user = self._user_from_token()
        if not user:
            self._json_response(401, {'error': 'invalid_token'}); return
        try:
            session = _stripe_request('GET', '/v1/checkout/sessions/' + session_id)
        except Exception as e:
            print('[Stripe] verify failed: {0}'.format(e), file=sys.stderr)
            self._json_response(502, {'error': 'stripe_unreachable'}); return
        # Stripe says the subscription is paid when payment_status == 'paid'
        # (subscription mode marks this once the first invoice clears).
        paid = session.get('payment_status') == 'paid' \
            and session.get('status') == 'complete'
        # Make sure this checkout was for THIS user (defense in depth).
        if str(session.get('client_reference_id')) != str(user['id']):
            self._json_response(403, {'error': 'session_user_mismatch'}); return
        if paid:
            sub_id = session.get('subscription') or ''
            cust_id = session.get('customer') or ''
            # Determine which plan was purchased from the line items price id
            line_items_url = '/v1/checkout/sessions/' + session_id + '/line_items'
            try:
                li = _stripe_request('GET', line_items_url)
                price_id = (li.get('data') or [{}])[0].get('price', {}).get('id', '')
            except Exception:
                price_id = ''
            new_plan = 'team' if price_id == STRIPE_PRICE_TEAM else 'pro'
            with _AUTH_LOCK, _auth_db() as conn:
                conn.execute(
                    'UPDATE users SET plan=?, stripe_subscription_id=?, stripe_customer_id=?, plan_until=NULL WHERE id=?',
                    (new_plan, sub_id, cust_id, user['id']))
                conn.commit()
            self._json_response(200, {'plan': new_plan}); return
        self._json_response(200, {'plan': user['plan'] or 'free', 'paid': False})

    # ── Subscription self-service (cancel / resume, no Stripe portal) ──
    def _find_stripe_subscription_id(self, user):
        """Best-effort lookup of the user's live Stripe subscription id.
        Prefers the id stored at purchase time; falls back to the stored
        customer id, then to a customer-by-email search (accounts that paid
        before the ids were persisted). Returns the id, '' when the account
        definitively has no subscription, or None when Stripe couldn't be
        reached (the caller must NOT downgrade blindly in that case)."""
        from urllib.parse import urlencode
        sub_id = (user['stripe_subscription_id'] or '').strip()
        if sub_id:
            return sub_id
        cust_id = (user['stripe_customer_id'] or '').strip()
        try:
            if not cust_id:
                found = _stripe_request('GET', '/v1/customers?' + urlencode(
                    {'email': user['email'], 'limit': 3}))
                data = found.get('data') or []
                cust_id = (data[0].get('id') or '') if data else ''
                if not cust_id:
                    return ''
            # No status filter: Stripe then returns every non-canceled
            # subscription (active, trialing, past_due…) — all cancelable.
            subs = _stripe_request('GET', '/v1/subscriptions?' + urlencode(
                {'customer': cust_id, 'limit': 3}))
            data = subs.get('data') or []
            return (data[0].get('id') or '') if data else ''
        except RuntimeError:
            return ''   # no Stripe key configured (dev box) → nothing billed
        except Exception as e:
            print('[Stripe] subscription lookup failed: {0}'.format(e), file=sys.stderr)
            return None

    def _drop_to_free(self, user_id):
        with _AUTH_LOCK, _auth_db() as conn:
            conn.execute("UPDATE users SET plan='free', plan_until=NULL, "
                         'stripe_subscription_id=NULL WHERE id=?', (user_id,))
            conn.commit()

    def handle_subscription_cancel(self):
        """Cancel the signed-in user's paid plan from inside Skorpene. Sets
        cancel_at_period_end in Stripe so they keep what they already paid for;
        the plan drops to free automatically (enforced in _user_from_token)
        once the paid-through date passes. Accounts with no real Stripe
        subscription (dev upgrades, stale links) drop to free immediately."""
        user = self._user_from_token()
        if not user:
            self._json_response(401, {'error': 'invalid_token'}); return
        plan = (user['plan'] or 'free').lower()
        if plan not in ('pro', 'team'):
            self._json_response(400, {'error': 'not_paid'}); return
        sub_id = self._find_stripe_subscription_id(user)
        if sub_id is None:
            self._json_response(502, {'error': 'stripe_unreachable'}); return
        if not sub_id:
            self._drop_to_free(user['id'])
            self._json_response(200, {'ok': True, 'plan': 'free', 'until': None}); return
        try:
            sub = _stripe_request('POST', '/v1/subscriptions/' + sub_id,
                                  [('cancel_at_period_end', 'true')])
        except urllib.error.HTTPError as e:
            body = e.read().decode('utf-8', 'replace') if hasattr(e, 'read') else str(e)
            if e.code == 404:
                # The subscription no longer exists in Stripe → nothing billed.
                self._drop_to_free(user['id'])
                self._json_response(200, {'ok': True, 'plan': 'free', 'until': None}); return
            if e.code == 400:
                # A fully-canceled subscription rejects updates with 400 —
                # confirm, then treat it like "already gone".
                try:
                    cur = _stripe_request('GET', '/v1/subscriptions/' + sub_id)
                    if cur.get('status') == 'canceled':
                        self._drop_to_free(user['id'])
                        self._json_response(200, {'ok': True, 'plan': 'free', 'until': None}); return
                except Exception:
                    pass
            print('[Stripe] cancel HTTP {0}: {1}'.format(e.code, body[:300]), file=sys.stderr)
            self._json_response(502, {'error': 'stripe_http'}); return
        except Exception as e:
            print('[Stripe] cancel error: {0}'.format(e), file=sys.stderr)
            self._json_response(502, {'error': 'stripe_unreachable'}); return
        until = _sub_period_end(sub)
        with _AUTH_LOCK, _auth_db() as conn:
            conn.execute('UPDATE users SET plan_until=?, stripe_subscription_id=? WHERE id=?',
                         (until, sub_id, user['id']))
            conn.commit()
        self._json_response(200, {'ok': True, 'plan': plan, 'until': until})

    def handle_subscription_resume(self):
        """Undo a pending cancellation before the paid period ends: clears
        cancel_at_period_end in Stripe and the local paid-through marker, so
        billing and the plan continue as if the user never canceled."""
        user = self._user_from_token()
        if not user:
            self._json_response(401, {'error': 'invalid_token'}); return
        plan = (user['plan'] or 'free').lower()
        sub_id = (user['stripe_subscription_id'] or '').strip()
        if plan not in ('pro', 'team') or not _row_value(user, 'plan_until') or not sub_id:
            self._json_response(400, {'error': 'nothing_to_resume'}); return
        try:
            _stripe_request('POST', '/v1/subscriptions/' + sub_id,
                            [('cancel_at_period_end', 'false')])
        except urllib.error.HTTPError as e:
            body = e.read().decode('utf-8', 'replace') if hasattr(e, 'read') else str(e)
            print('[Stripe] resume HTTP {0}: {1}'.format(e.code, body[:300]), file=sys.stderr)
            self._json_response(502, {'error': 'stripe_http'}); return
        except Exception as e:
            print('[Stripe] resume error: {0}'.format(e), file=sys.stderr)
            self._json_response(502, {'error': 'stripe_unreachable'}); return
        with _AUTH_LOCK, _auth_db() as conn:
            conn.execute('UPDATE users SET plan_until=NULL WHERE id=?', (user['id'],))
            conn.commit()
        self._json_response(200, {'ok': True, 'plan': plan, 'until': None})

    def handle_auth_logout(self):
        token = self._bearer_token()
        if token:
            with _AUTH_LOCK, _auth_db() as conn:
                conn.execute('DELETE FROM sessions WHERE token=?', (token,))
                conn.commit()
        self._json_response(200, {'ok': True})

    def handle_auth_request_password_reset(self):
        """Generate a password reset token and send it to the user's email."""
        try:
            body = json.loads(self.rfile.read(int(self.headers.get('Content-Length', 0))))
        except Exception:
            self._json_response(400, {'error': 'invalid_json'}); return

        email = (body.get('email') or '').strip().lower()
        if not email:
            self._json_response(400, {'error': 'email_required'}); return
        lang = (body.get('lang') or 'en').strip().lower()
        if lang not in _RESET_EMAIL_I18N:
            lang = 'en'

        brevo_key = os.environ.get('BREVO_API_KEY', '').strip()
        if not brevo_key:
            self._json_response(500, {'error': 'email_service_unavailable'}); return

        with _AUTH_LOCK, _auth_db() as conn:
            user = conn.execute('SELECT id FROM users WHERE email=?', (email,)).fetchone()
            if not user:
                # Don't reveal if email exists (security).
                self._json_response(200, {'ok': True, 'message': 'Si existe una cuenta, recibirás un email'}); return

            # Generate a random 64-char token.
            reset_token = secrets.token_urlsafe(48)
            created = time.time()
            conn.execute(
                'INSERT OR REPLACE INTO password_reset_tokens (token, user_id, created) VALUES (?, ?, ?)',
                (reset_token, user['id'], created)
            )
            conn.commit()

        # Send email with Brevo.
        if _send_password_reset_email(email, reset_token, brevo_key, lang):
            self._json_response(200, {'ok': True, 'message': 'Revisa tu email para restablecer la contraseña'})
        else:
            self._json_response(500, {'error': 'email_send_failed'})

    def handle_auth_reset_password(self):
        """Validate a password reset token and update the password."""
        try:
            body = json.loads(self.rfile.read(int(self.headers.get('Content-Length', 0))))
        except Exception:
            self._json_response(400, {'error': 'invalid_json'}); return

        token = (body.get('token') or '').strip()
        password = body.get('password') or ''
        if not token or not password:
            self._json_response(400, {'error': 'token_and_password_required'}); return

        if len(password) < 6:
            self._json_response(400, {'error': 'password_too_short'}); return

        # Check token validity (not expired, exists).
        now = time.time()
        reset_ttl = 3600  # 1 hour.
        with _AUTH_LOCK, _auth_db() as conn:
            row = conn.execute(
                'SELECT user_id, created FROM password_reset_tokens WHERE token=?',
                (token,)
            ).fetchone()
            if not row or (now - row['created']) > reset_ttl:
                self._json_response(400, {'error': 'token_invalid_or_expired'}); return

            user_id = row['user_id']

            # Hash the new password.
            pw_salt = secrets.token_hex(16)
            pw_hash = _hash_pw(password, pw_salt)

            # Update password, delete token.
            conn.execute(
                'UPDATE users SET pw_hash=?, pw_salt=? WHERE id=?',
                (pw_hash, pw_salt, user_id)
            )
            conn.execute('DELETE FROM password_reset_tokens WHERE token=?', (token,))
            conn.commit()

        self._json_response(200, {'ok': True, 'message': 'Contraseña actualizada. Inicia sesión con tu nueva contraseña'})

    # ── Admin (read-only user dashboard) ──
    def _admin_check(self):
        """Authorize an admin request.

        Returns one of: 'ok' (valid token), 'disabled' (ADMIN_TOKEN env var not
        set — the panel is OFF by default so it's never wide-open), or 'denied'
        (token missing/wrong). The token may arrive as an `Authorization: Bearer`
        header or a `?key=` query param (so the dashboard page can pass it).
        """
        expected = os.environ.get('ADMIN_TOKEN', '').strip()
        if not expected:
            return 'disabled'
        from urllib.parse import urlparse, parse_qs
        supplied = self._bearer_token()
        if not supplied:
            supplied = (parse_qs(urlparse(self.path).query).get('key', [''])[0] or '').strip()
        if supplied and hmac.compare_digest(supplied, expected):
            return 'ok'
        return 'denied'

    def handle_admin_users(self):
        """Return registered users + summary stats as JSON. NEVER includes the
        password hash or salt. Gated by ADMIN_TOKEN."""
        status = self._admin_check()
        if status == 'disabled':
            self._json_response(503, {'error': 'admin_disabled',
                'detail': 'Set the ADMIN_TOKEN environment variable to enable the admin panel.'})
            return
        if status != 'ok':
            self._json_response(401, {'error': 'unauthorized'}); return
        min_created = time.time() - _SESSION_TTL
        with _auth_db() as conn:
            rows = conn.execute(
                "SELECT id, email, name, COALESCE(plan,'free') AS plan, created, "
                "stripe_subscription_id, stripe_customer_id "
                "FROM users ORDER BY id DESC").fetchall()
            active = conn.execute(
                'SELECT COUNT(DISTINCT user_id) AS n FROM sessions WHERE created > ?',
                (min_created,)).fetchone()['n']
        users, by_plan = [], {}
        for r in rows:
            plan = r['plan'] or 'free'
            by_plan[plan] = by_plan.get(plan, 0) + 1
            users.append({
                'id': r['id'],
                'email': r['email'],
                'name': r['name'] or '',
                'plan': plan,
                'created': r['created'],
                'paying': bool(r['stripe_subscription_id']),
            })
        self._json_response(200, {
            'total': len(users),
            'by_plan': by_plan,
            'active_sessions': int(active),
            'db_path': _AUTH_DB,
            'users': users,
        })

    def handle_admin_page(self):
        """Serve the self-contained admin dashboard HTML (the data itself is
        fetched from the gated /api/admin/users endpoint)."""
        html = _ADMIN_PAGE_HTML.encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(html)))
        self.end_headers()
        self.wfile.write(html)

    def handle_telegram_channel(self):
        """Scrape a PUBLIC Telegram channel's web preview (https://t.me/s/<channel>).

        Used for user-added channels: no Telethon, no auth, no restart of the live
        monitor — we just read the public HTML feed and return recent posts as JSON.
        """
        from urllib.parse import urlparse, parse_qs, unquote
        qs = parse_qs(urlparse(self.path).query)
        channel = (qs.get('channel', [''])[0] or '').strip()
        channel = unquote(channel).lstrip('@').strip()
        # Accept full t.me links too.
        m = re.search(r't(?:elegram)?\.me/(?:s/)?([A-Za-z0-9_]+)', channel)
        if m:
            channel = m.group(1)
        channel = re.sub(r'[^A-Za-z0-9_]', '', channel)
        if not channel:
            self._json_response(400, {'error': 'missing channel'})
            return
        url = 'https://t.me/s/{0}'.format(channel)
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (GeoScope)'})
            with urllib.request.urlopen(req, timeout=10) as resp:
                html = resp.read().decode('utf-8', 'replace')
        except Exception as e:
            print('[TG] {0} failed: {1}'.format(channel, e), file=sys.stderr)
            self._json_response(502, {'error': 'could not fetch channel', 'channel': channel})
            return
        posts = self._parse_tg_html(html, channel)
        print('[TG] {0}: {1} posts'.format(channel, len(posts)), file=sys.stderr)
        self._json_response(200, {'channel': channel, 'posts': posts})

    def _parse_tg_html(self, html, channel):
        """Extract recent posts (text, link, date) from a t.me/s/<channel> page."""
        posts = []
        # Each message bubble carries a data-post="channel/<id>" attribute.
        blocks = re.split(r'<div class="tgme_widget_message[ "]', html)
        for blk in blocks[1:]:
            # message text
            tm = re.search(r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>\s*(?:<div class="tgme_widget_message_(?:footer|reply|info)|<div class="tgme_widget_message_bubble)', blk, re.S)
            if not tm:
                tm = re.search(r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', blk, re.S)
            text = _strip_html((tm.group(1) if tm else '').replace('<br/>', ' ').replace('<br>', ' '))
            # link + datetime
            lm = re.search(r'<a class="tgme_widget_message_date" href="([^"]+)"', blk)
            link = lm.group(1) if lm else 'https://t.me/{0}'.format(channel)
            dm = re.search(r'<time[^>]*datetime="([^"]+)"', blk)
            published = dm.group(1) if dm else ''
            # photo (background-image url)
            pm = re.search(r"tgme_widget_message_photo_wrap[^>]*background-image:url\('([^']+)'\)", blk)
            image = pm.group(1) if pm else ''
            if not text and not image:
                continue
            posts.append({
                'source': '@' + channel, 'source_id': 'tg_' + channel,
                'title': text[:200], 'summary': text, 'link': link,
                'published': published, 'image': image,
            })
        return posts[-25:]  # newest are last in the page; cap to 25

    def handle_user_rss(self):
        """Proxy + parse a user-supplied RSS/Atom feed URL (CORS-free, server-side)."""
        from urllib.parse import urlparse, parse_qs, unquote
        qs = parse_qs(urlparse(self.path).query)
        feed_url = (qs.get('url', [''])[0] or '').strip()
        feed_url = unquote(feed_url)
        if not re.match(r'^https?://', feed_url):
            self._json_response(400, {'error': 'invalid url'})
            return

        # ── Cache hit: serve a recent copy without touching the network. This is
        #    what stops the add-flow's probe + the immediate refresh from hitting
        #    a source (esp. Reddit) twice in a row and getting rate-limited.
        now = time.time()
        cached = _user_rss_cache.get(feed_url)
        if cached and (now - cached['ts']) < USER_RSS_TTL and cached['articles']:
            self._json_response(200, {'name': cached['name'], 'articles': cached['articles'], 'ok': True, 'cached': True})
            return

        blocked = {'hit': False}  # set when a site actively refuses bots (403)
        is_reddit = 'reddit.com' in urlparse(feed_url).netloc.lower()

        def _fetch(u, timeout=5):
            # Realistic browser headers — many sites (Cloudflare etc.) 403 a bare
            # urllib UA. We still get 403'd by aggressive bot walls, but this
            # clears the easy ones. Reddit is the exception: it rate-limits the
            # browser UA hard but is generous to a descriptive, unique UA (its
            # documented preference), so we use one for reddit.com hosts.
            if 'reddit.com' in urlparse(u).netloc.lower():
                ua = 'GeoScope/1.0 (+https://geoscope.app; news aggregator)'
            else:
                ua = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 '
                      '(KHTML, like Gecko) Version/17.4 Safari/605.1.15')
            req = urllib.request.Request(u, headers={
                'User-Agent': ua,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/rss+xml,application/atom+xml,*/*;q=0.8',
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
                'Referer': '{0.scheme}://{0.netloc}/'.format(urlparse(u)),
            })
            # Reddit occasionally 429s even a polite caller; one short backoff retry
            # clears most transient limits.
            attempts = 2 if 'reddit.com' in urlparse(u).netloc.lower() else 1
            for attempt in range(attempts):
                try:
                    with urllib.request.urlopen(req, timeout=timeout) as resp:
                        return resp.read()
                except urllib.error.HTTPError as he:
                    if he.code in (403, 401, 429):
                        blocked['hit'] = True
                    if he.code == 429 and attempt + 1 < attempts:
                        time.sleep(1.0)
                        continue
                    raise

        def _name_for(url, blob):
            nm = ''
            try:
                tm = re.search(rb'<title>(.*?)</title>', blob, re.S)
                if tm:
                    nm = _strip_html(tm.group(1).decode('utf-8', 'replace'))[:40]
            except Exception:
                pass
            return nm or urlparse(url).netloc

        from urllib.parse import urljoin
        # Try the pasted URL first. If it 403s / times out / etc. we DON'T give
        # up — the homepage may be bot-walled while its feed endpoint is open, so
        # we fall through to conventional feed-path guessing below.
        raw = None
        try:
            raw = _fetch(feed_url)
        except Exception as e:
            print('[RSS] {0} homepage fetch failed: {1} (will still try feed paths)'.format(feed_url, e), file=sys.stderr)

        name = _name_for(feed_url, raw or b'')
        outlet = {'id': 'rss_' + re.sub(r'\W+', '', name)[:20], 'name': name}
        articles = _parse_feed(raw, outlet) if raw else []

        # Auto-discovery: the user usually pastes a SITE homepage (a forum, blog,
        # outlet) rather than the raw feed URL. Build a candidate list from the
        # page's <link rel=alternate type=application/rss+xml> tags plus common
        # conventional paths, then fetch the first that yields articles.
        if not articles:
            candidates = []
            if raw:
                html = raw.decode('utf-8', 'replace')
                for m in re.finditer(r'<link[^>]+>', html, re.I):
                    tag = m.group(0)
                    # Only pick links declaring a feed MIME type — avoids hreflang alternates
                    if re.search(r'type=["\']application/(rss|atom)\+xml["\']', tag, re.I):
                        href = re.search(r'href=["\']([^"\']+)["\']', tag, re.I)
                        if href:
                            candidates.append(urljoin(feed_url, href.group(1)))
                # Also catch plain <a href="...rss..."> links some sites use.
                for am in re.finditer(r'href=["\']([^"\']*(?:rss|feed|atom)[^"\']*)["\']', html, re.I):
                    candidates.append(urljoin(feed_url, am.group(1)))
            # Conventional feed paths as a fallback guess.
            for guess in (
                '/feed', '/feed/', '/rss', '/rss/', '/rss.xml', '/feed.xml',
                '/atom.xml', '/index.xml', '/rss.php', '/feed.php', '/.rss',
                '/syndication.axd', '/feeds/posts/default', '/feeds/all.atom',
                '/noticias/rss', '/news/rss', '/blog/feed', '/blog/rss',
                '/wp-json/wp/v2/posts?_embed&per_page=10',
            ):
                candidates.append(urljoin(feed_url, guess))
            # Feed-on-subdomain guesses (e.g. BBC uses feeds.bbci.co.uk).
            pr = urlparse(feed_url)
            host = pr.netloc.replace('www.', '')
            for sub_host in ('feeds.' + host, 'rss.' + host):
                candidates.append('{0}://{1}/'.format(pr.scheme, sub_host))
            # Deduplicate and exclude already-tried homepage URL
            unique_candidates = list(dict.fromkeys(
                c for c in candidates if c and c != feed_url
            ))
            # Probe candidates in parallel (max 8 threads, 6s each → total ~6s wall-clock)
            found_feed = [None]  # [url, blob, articles]
            def _probe(c):
                try:
                    sub = _fetch(c, timeout=3)
                    got = _parse_feed(sub, outlet)
                    if got:
                        return (c, sub, got)
                except Exception:
                    pass
                return None
            with ThreadPoolExecutor(max_workers=16) as pool:
                futures = {pool.submit(_probe, c): c for c in unique_candidates}
                for fut in as_completed(futures):
                    try:
                        result = fut.result()
                    except Exception:
                        result = None
                    if result and found_feed[0] is None:
                        found_feed[0] = result
                        break
            if found_feed[0]:
                c, sub, got = found_feed[0]
                articles = got
                nm2 = _name_for(c, sub)
                if nm2:
                    name = nm2
                print('[RSS] discovered feed for {0} -> {1} ({2} articles)'.format(
                    feed_url, c, len(got)), file=sys.stderr)

        # Still nothing, but the page itself loaded → extract headlines straight
        # from the HTML. This is what lets ANY reachable news site work even when
        # it exposes no RSS/Atom feed (e.g. bbc.com). No AI, no extra requests.
        if not articles and raw:
            got = _extract_articles_from_html(raw, feed_url, outlet)
            if len(got) >= 3:
                articles = got
                print('[RSS] extracted {0} headlines from HTML for {1}'.format(len(got), feed_url), file=sys.stderr)

        # No articles from the network. Before reporting failure, fall back to the
        # last good copy we cached (stale-while-error). This keeps Reddit and other
        # rate-limiting sources visible: once we've fetched them successfully even
        # once, a later 429/block serves the cached articles instead of wiping them.
        if not articles:
            stale = _user_rss_cache.get(feed_url)
            if stale and stale['articles']:
                print('[RSS] {0}: fetch failed, serving {1} cached articles'.format(
                    feed_url, len(stale['articles'])), file=sys.stderr)
                self._json_response(200, {'name': stale['name'], 'articles': stale['articles'], 'ok': True, 'stale': True})
                return
            # No cache either: distinguish "site blocks bots" (403/Cloudflare) from
            # "reachable but has no feed" so the frontend can show an honest message.
            if blocked['hit']:
                reason = 'blocked'
            elif raw is None:
                reason = 'unreachable'
            else:
                reason = 'nofeed'
            print('[RSS] {0}: no feed ({1})'.format(feed_url, reason), file=sys.stderr)
            self._json_response(200, {'name': name, 'articles': [], 'ok': False, 'error': reason})
            return

        # Success → remember it so refreshes and rate-limited retries are cheap.
        _user_rss_cache[feed_url] = {'ts': time.time(), 'name': name, 'articles': articles}
        print('[RSS] {0}: {1} articles'.format(name, len(articles)), file=sys.stderr)
        # `ok` lets the frontend show a clear per-source error when a URL has no
        # usable feed, instead of silently showing nothing.
        self._json_response(200, {'name': name, 'articles': articles, 'ok': True})

    def handle_outlets(self):
        """Fetch + parse the configured RSS feeds and return them as JSON (cached)."""
        now = time.time()
        if _outlets_cache['data'] is not None and (now - _outlets_cache['ts']) < OUTLETS_TTL:
            self._json_response(200, _outlets_cache['data'])
            return
        articles = []
        for o in NEWS_OUTLETS:
            try:
                req = urllib.request.Request(o['url'], headers={'User-Agent': 'Mozilla/5.0 (GeoScope)'})
                with urllib.request.urlopen(req, timeout=8) as resp:
                    raw = resp.read()
                got = _parse_feed(raw, o)
                articles.extend(got)
                print(f'[Outlets] {o["id"]}: {len(got)} articles', file=sys.stderr)
            except Exception as e:
                print(f'[Outlets] {o["id"]} failed: {e}', file=sys.stderr)
        data = {'outlets': articles}
        _outlets_cache['data'] = data
        _outlets_cache['ts'] = now
        self._json_response(200, data)

    def _json_response(self, code, obj):
        """Write a JSON response (CORS headers are added by end_headers)."""
        payload = json.dumps(obj).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(payload)

    def handle_claude_proxy(self):
        """Proxy POST /api/claude to the Anthropic Messages API.

        The browser sends only {system, messages, max_tokens?}; this server
        injects the secret API key + model so the key never reaches the client.
        """
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)

        api_key = _read_api_key()
        if not api_key:
            self._json_response(503, {'error':
                'Falta ANTHROPIC_API_KEY. Pon tu clave en el archivo mikey.txt '
                'o expórtala: export ANTHROPIC_API_KEY=sk-ant-...'})
            return

        try:
            req_data = json.loads(body)
        except json.JSONDecodeError:
            self.send_error(400, 'Invalid JSON')
            return

        # ── Plan gate ── AI is a paid feature. Require a valid session and a
        # paid plan; free accounts get a 403 the client turns into an upgrade
        # prompt. This is the real enforcement — the client checks are only UX.
        user = self._user_from_token()
        if not user:
            self._json_response(401, {'error': 'invalid_token'}); return
        plan = (user['plan'] or 'free').lower()
        if plan not in ('pro', 'team'):
            self._json_response(403, {'error': 'plan_required'}); return
        # The Pro cap (PRO_AI_DAILY uses per ROLLING 24h) applies to assistant
        # uses tagged count_quota: chat messages and chat source add/remove.
        # Team is unlimited; untagged calls (background geolocation, onboarding
        # source search) require a paid plan but don't burn the allowance.
        if plan == 'pro' and req_data.get('count_quota'):
            if _ai_quota(user['id']) >= PRO_AI_DAILY:
                self._json_response(429, {'error': 'quota_exceeded', 'limit': PRO_AI_DAILY}); return
            _ai_quota_consume(user['id'])

        # Build the Anthropic payload from a minimal client request.
        want_stream = bool(req_data.get('stream'))
        payload = {
            'model': ANTHROPIC_MODEL,
            'max_tokens': req_data.get('max_tokens', 1024),
            'messages': req_data.get('messages', []),
        }
        if req_data.get('system'):
            payload['system'] = req_data['system']
        if want_stream:
            payload['stream'] = True

        try:
            req = urllib.request.Request(
                ANTHROPIC_URL,
                data=json.dumps(payload).encode('utf-8'),
                headers={
                    'content-type': 'application/json',
                    'x-api-key': api_key,
                    'anthropic-version': ANTHROPIC_VERSION,
                },
            )
            # ── Streaming path: pass the Anthropic SSE stream straight through to
            #    the browser so the answer renders token-by-token (feels instant,
            #    even for long replies). The client reads it via fetch().body.
            if want_stream:
                upstream = urllib.request.urlopen(req, timeout=120)
                self.send_response(200)
                self.send_header('Content-Type', 'text/event-stream; charset=utf-8')
                self.send_header('Cache-Control', 'no-cache')
                self.send_header('X-Accel-Buffering', 'no')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                try:
                    while True:
                        chunk = upstream.read(512)
                        if not chunk:
                            break
                        self.wfile.write(chunk)
                        self.wfile.flush()
                except (BrokenPipeError, ConnectionResetError):
                    pass  # client navigated away mid-stream — fine
                finally:
                    upstream.close()
                print(f'[Claude] OK (stream): {payload["model"]}', file=sys.stderr)
                return
            with urllib.request.urlopen(req, timeout=120) as resp:
                resp_data = json.load(resp)
            self._json_response(200, resp_data)
            print(f'[Claude] OK: {payload["model"]}', file=sys.stderr)
        except urllib.error.HTTPError as e:
            try:
                err_body = json.load(e)
            except Exception:
                err_body = {'error': {'message': str(e.reason)}}
            print(f'[Claude] HTTP {e.code}: {err_body}', file=sys.stderr)
            self._json_response(e.code, err_body)
        except urllib.error.URLError as e:
            msg = f'No se pudo contactar con la API de Claude: {e.reason}'
            print(f'[Claude] ERROR: {msg}', file=sys.stderr)
            self._json_response(503, {'error': msg})
        except Exception as e:
            msg = f'Error: {str(e)}'
            print(f'[Claude] ERROR: {msg}', file=sys.stderr)
            self._json_response(500, {'error': msg})

    def handle_ollama_proxy(self):
        """Proxy POST /api/ollama to Ollama on localhost:11434."""
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)

        try:
            req_data = json.loads(body)
        except json.JSONDecodeError:
            self.send_error(400, 'Invalid JSON')
            return

        try:
            # Forward to Ollama
            ollama_url = OLLAMA_HOST + OLLAMA_ENDPOINT
            req = urllib.request.Request(
                ollama_url,
                data=json.dumps(req_data).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(req, timeout=120) as resp:
                resp_data = json.load(resp)

            # Send back to client
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(resp_data).encode('utf-8'))
            print(f'[Ollama] OK: {req_data.get("model", "?")}', file=sys.stderr)

        except urllib.error.URLError as e:
            msg = f'Ollama no responde en {OLLAMA_HOST}. ¿Está ejecutándose? Intenta: ollama serve'
            print(f'[Ollama] ERROR: {msg}', file=sys.stderr)
            self.send_response(503)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': msg}).encode('utf-8'))
        except Exception as e:
            msg = f'Error: {str(e)}'
            print(f'[Ollama] ERROR: {msg}', file=sys.stderr)
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': msg}).encode('utf-8'))

    def end_headers(self):
        """Add CORS + caching headers to all responses."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        # Caching strategy: HTML is served without caching (so index.html updates
        # go live immediately for every visitor). Everything else — CSS, JS,
        # images, fonts — gets a long-lived cache since we already cache-bust
        # them via `?v=` query strings. Without this the browser cached
        # index.html and users had to hard-reload to see any layout change.
        path = getattr(self, 'path', '') or ''
        base = path.split('?', 1)[0].split('#', 1)[0]
        is_html = base.endswith('.html') or base in ('', '/')
        if is_html:
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        elif base.startswith('/api/'):
            pass  # API responses set their own cache headers
        else:
            self.send_header('Cache-Control', 'public, max-age=86400')
        super().end_headers()

    def do_OPTIONS(self):
        """Handle CORS preflight."""
        self.send_response(200)
        self.end_headers()

def run_server(port=8000, directory='.'):
    """Run the enhanced HTTP server."""
    os.chdir(directory)
    # Threaded: the client fires several requests in parallel (feed fetches +
    # batched AI geolocation + the chat assistant). A single-threaded server
    # serialized them, so a slow Claude call stalled everything else — a big
    # cause of the assistant feeling sluggish. Threads + streaming fix that.
    _auth_init()
    server = ThreadingHTTPServer(('0.0.0.0', port), GeoScopeHandler)
    server.daemon_threads = True
    print(f'Skorpene server on http://localhost:{port}', file=sys.stderr)
    print('Auth at /api/auth/{register,login,logout,me} (SQLite: auth.db)', file=sys.stderr)
    _persistent = any(_AUTH_DB.startswith(v) for v in ('/data', '/var/data', '/mnt/data', '/persist')) \
        or bool(os.environ.get('AUTH_DB_PATH', '').strip())
    print(f'  DB → {_AUTH_DB}  [{"PERSISTENT" if _persistent else "EPHEMERAL — add a volume so users survive redeploys"}]', file=sys.stderr)
    _admin = 'ENABLED at /admin' if os.environ.get('ADMIN_TOKEN', '').strip() else 'OFF — set ADMIN_TOKEN to enable /admin'
    print(f'  Admin dashboard: {_admin}', file=sys.stderr)
    print(f'Ollama proxy at /api/ollama (forwards to {OLLAMA_HOST})', file=sys.stderr)
    _has_key = 'set' if _read_api_key() else 'NOT set — put it in mikey.txt or export ANTHROPIC_API_KEY'
    print(f'Claude proxy at /api/claude (model={ANTHROPIC_MODEL}, key {_has_key})', file=sys.stderr)
    _has_stripe = 'set' if _read_stripe_secret() else 'NOT set — put it in stripe_secret.txt or export STRIPE_SECRET_KEY'
    print(f'Stripe billing at /api/billing/{{create-checkout-session,verify-session}} (key {_has_stripe})', file=sys.stderr)
    print(f'Outlets RSS at /api/outlets ({len(NEWS_OUTLETS)} feeds)', file=sys.stderr)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nServer stopped.', file=sys.stderr)
        server.server_close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run_server(port)
