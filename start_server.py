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
# Bearer token. No external service needed — everything lives in auth.db next to
# this script.
_AUTH_DB = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'auth.db')
_AUTH_LOCK = threading.Lock()
_PBKDF2_ROUNDS = 200_000

# Stripe price for the Pro plan ($9.99/mo). Recreate this id (and the secret
# key in stripe_secret.txt) in Live mode when going to production.
STRIPE_PRICE_PRO  = 'price_1TlnPE9mdlExjEPw31MJVnGe'
STRIPE_PRICE_TEAM = 'price_1TlpGs9mdlExjEPwzBkE2fF3'

# Plan limits enforced server-side (the client mirrors these for UX only).
#   free → no AI at all          pro → PRO_AI_DAILY assistant queries/day
#   team → unlimited AI
PRO_AI_DAILY = 20


def _ai_quota(user_id):
    """How many assistant queries this user has used today + the cap reached
    flag is computed by the caller. Returns the integer count for the UTC day."""
    day = time.strftime('%Y-%m-%d', time.gmtime())
    with _auth_db() as conn:
        row = conn.execute(
            'SELECT n FROM ai_usage WHERE user_id=? AND day=?', (user_id, day)).fetchone()
    return int(row['n']) if row else 0


def _ai_quota_consume(user_id):
    """Atomically record one assistant query for today and return the new count."""
    day = time.strftime('%Y-%m-%d', time.gmtime())
    with _AUTH_LOCK, _auth_db() as conn:
        conn.execute(
            'INSERT INTO ai_usage (user_id, day, n) VALUES (?,?,1) '
            'ON CONFLICT(user_id, day) DO UPDATE SET n = n + 1',
            (user_id, day))
        conn.commit()
        row = conn.execute(
            'SELECT n FROM ai_usage WHERE user_id=? AND day=?', (user_id, day)).fetchone()
    return int(row['n']) if row else 1


def _auth_db():
    conn = sqlite3.connect(_AUTH_DB)
    conn.row_factory = sqlite3.Row
    return conn


def _auth_init():
    with _AUTH_LOCK, _auth_db() as conn:
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
        # Daily AI-assistant usage, for enforcing the Pro plan's 20 queries/day.
        # One row per (user, UTC day); team is unlimited so it never writes here.
        conn.execute('''CREATE TABLE IF NOT EXISTS ai_usage (
            user_id INTEGER NOT NULL,
            day TEXT NOT NULL,
            n INTEGER NOT NULL DEFAULT 0,
            PRIMARY KEY (user_id, day))''')
        # Billing columns. Added with try/except so re-runs on an existing DB
        # don't error — SQLite has no "ADD COLUMN IF NOT EXISTS" before 3.35.
        for col_sql in (
            "ALTER TABLE users ADD COLUMN plan TEXT DEFAULT 'free'",
            "ALTER TABLE users ADD COLUMN stripe_customer_id TEXT",
            "ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT",
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


def _hash_pw(password, salt):
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'),
                               bytes.fromhex(salt), _PBKDF2_ROUNDS).hex()


def _new_session(conn, user_id):
    token = secrets.token_urlsafe(32)
    conn.execute('INSERT INTO sessions (token, user_id, created) VALUES (?,?,?)',
                 (token, user_id, time.time()))
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
        elif self.path == '/api/billing/create-checkout-session':
            self.handle_billing_create_session()
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
        self._json_response(200, {'token': token, 'user': {'email': email, 'name': name, 'plan': 'free'}})

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
        self._json_response(200, {'token': token, 'user': {
            'email': row['email'], 'name': row['name'], 'plan': row['plan'] or 'free'}})

    def handle_auth_me(self):
        token = self._bearer_token()
        if not token:
            self._json_response(401, {'error': 'no_token'}); return
        with _auth_db() as conn:
            row = conn.execute(
                'SELECT u.email, u.name, u.plan FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=?',
                (token,)).fetchone()
        if not row:
            self._json_response(401, {'error': 'invalid_token'}); return
        self._json_response(200, {'user': {
            'email': row['email'], 'name': row['name'],
            'plan': row['plan'] or 'free',
        }})

    def _user_from_token(self):
        """Resolve the bearer token to a users row, or None."""
        token = self._bearer_token()
        if not token:
            return None
        with _auth_db() as conn:
            return conn.execute(
                'SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=?',
                (token,)).fetchone()

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
                    'UPDATE users SET plan=?, stripe_subscription_id=?, stripe_customer_id=? WHERE id=?',
                    (new_plan, sub_id, cust_id, user['id']))
                conn.commit()
            self._json_response(200, {'plan': new_plan}); return
        self._json_response(200, {'plan': user['plan'] or 'free', 'paid': False})

    def handle_auth_logout(self):
        token = self._bearer_token()
        if token:
            with _AUTH_LOCK, _auth_db() as conn:
                conn.execute('DELETE FROM sessions WHERE token=?', (token,))
                conn.commit()
        self._json_response(200, {'ok': True})

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
        # The 20/day cap applies to assistant queries (tagged count_quota) on the
        # Pro plan only. Team is unlimited; untagged calls (translation, source
        # resolving) require a paid plan but don't burn the daily assistant quota.
        if plan == 'pro' and req_data.get('count_quota'):
            if _ai_quota(user['id']) >= PRO_AI_DAILY:
                self._json_response(429, {'error': 'quota_exceeded', 'limit': PRO_AI_DAILY}); return
            _ai_quota_consume(user['id'])

        # Build the Anthropic payload from a minimal client request.
        want_stream = bool(req_data.get('stream'))
        payload = {
            'model': req_data.get('model', ANTHROPIC_MODEL),
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
        """Add CORS headers to all responses."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
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
