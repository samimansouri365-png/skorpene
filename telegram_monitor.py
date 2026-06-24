#!/usr/bin/env python3
"""
Monitor Telegram channels, classify each message as a geo-located event,
deduplicate across channels, and broadcast the enriched payload via WebSocket.

Pipeline per message:
  raw text + media  →  events_engine.analyze()  →  {event_type, icon, label,
                         lat, lng, location, score}
                   →  EventDeduplicator  (2h rolling window)
                   →  WebSocket broadcast + SQLite persist
"""

import asyncio
import json
import sqlite3
import uuid
from datetime import datetime, timedelta, timezone
from telethon import TelegramClient, events
from telethon.tl.types import (
    MessageMediaPhoto,
    MessageMediaDocument,
    DocumentAttributeVideo,
)
import websockets
import logging
import os

from events_engine import analyze, EventDeduplicator, EVENT_TYPES

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

API_ID = 30308641
API_HASH = '7fb8e291c191607a45a7e96454c0bd75'
PHONE = '+34642247539'

CHANNELS = ['Middle_East_Spectator', 'intelslava', 'geopolitics_prime']

connected_clients = set()
DB_PATH = 'news.db'
MEDIA_DIR = 'media'
os.makedirs(MEDIA_DIR, exist_ok=True)

# Events retained in memory & broadcast to new clients. Older events are pruned
# after EVENT_TTL_HOURS so the map stays current.
EVENT_TTL_HOURS = 24
MIN_SCORE_FOR_MAP = 0.55   # raised — only high-confidence geographic events reach the map

# Event types that are pure "talk" (statements, markets, diplomacy, etc.) — these
# must NOT populate the map. They remain in the news feed, just without a pin.
NON_MAPPABLE_EVENT_TYPES = {
    'civ_diplomacy', 'civ_summit', 'civ_treaty', 'civ_law',
    'med_propaganda', 'med_press', 'med_censorship', 'med_social',
    'res_finance', 'res_currency', 'res_trade',
    'res_oil', 'res_gas', 'res_mining',
    'tec_ai', 'tec_science',
    'ani_wildlife', 'ani_agriculture',
    'sec_sanction',  # sanctions are decrees — not geographic events
    'generic_event',
}

dedup = EventDeduplicator(window_sec=2 * 3600)
events_by_id: dict = {}        # event_id -> payload shown on map
news_index: list = []          # recent news items (all, incl. no-location)


def init_database():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY,
            channel TEXT,
            message TEXT,
            message_id INTEGER,
            timestamp TEXT,
            media_path TEXT,
            media_type TEXT,
            event_id TEXT,
            event_type TEXT,
            event_icon TEXT,
            event_label TEXT,
            event_cat TEXT,
            lat REAL,
            lng REAL,
            location TEXT,
            score REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute("PRAGMA table_info(news)")
    cols = [r[1] for r in cursor.fetchall()]
    for col, ddl in [
        ('media_path', 'TEXT'), ('media_type', 'TEXT'),
        ('media_items', 'TEXT'),  # JSON array of {path,type} for albums
        ('event_id', 'TEXT'), ('event_type', 'TEXT'),
        ('event_icon', 'TEXT'), ('event_label', 'TEXT'),
        ('event_cat', 'TEXT'),
        ('lat', 'REAL'), ('lng', 'REAL'), ('location', 'TEXT'),
        ('score', 'REAL'),
        ('event_status', 'TEXT'),  # ongoing/possible/confirmed/past
    ]:
        if col not in cols:
            cursor.execute(f'ALTER TABLE news ADD COLUMN {col} {ddl}')
    conn.commit()
    conn.close()


def save_message(row: dict):
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        media_items = row.get('media_items') or []
        media_items_json = json.dumps(media_items) if media_items else None
        cur.execute('''
            INSERT INTO news (channel, message, message_id, timestamp,
                              media_path, media_type, media_items,
                              event_id, event_type,
                              event_icon, event_label, event_cat,
                              lat, lng, location, score, event_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            row['channel'], row['message'], row['message_id'], row['timestamp'],
            row.get('media_path'), row.get('media_type'), media_items_json,
            row.get('event_id'), row.get('event_type'),
            row.get('event_icon'), row.get('event_label'), row.get('event_cat'),
            row.get('lat'), row.get('lng'), row.get('location'),
            row.get('score'), row.get('event_status'),
        ))
        conn.commit()
        conn.close()

        with open('news.json', 'w') as f:
            json.dump(get_all_messages(limit=500), f)
    except Exception as e:
        logger.error(f"DB error: {e}")


def get_all_messages(limit=500):
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute(
            'SELECT channel, message, message_id, timestamp, media_path, media_type, '
            '       media_items, event_id, event_type, event_icon, event_label, event_cat, '
            '       lat, lng, location, score, event_status '
            'FROM news ORDER BY id DESC LIMIT ?', (limit,)
        )
        rows = cur.fetchall()
        conn.close()
        out = []
        for r in rows:
            items = []
            if r['media_items']:
                try: items = json.loads(r['media_items']) or []
                except Exception: items = []
            out.append({
                'channel': r['channel'],
                'message': r['message'],
                'message_id': r['message_id'],
                'timestamp': r['timestamp'],
                'datetime_str': (r['timestamp'] or '')[:19],
                'media_path': r['media_path'],
                'media_type': r['media_type'],
                'media_items': items,
                'event_id': r['event_id'],
                'event_type': r['event_type'],
                'event_icon': r['event_icon'],
                'event_label': r['event_label'],
                'event_cat': r['event_cat'],
                'event_status': r['event_status'],
                'lat': r['lat'],
                'lng': r['lng'],
                'location': r['location'],
                'score': r['score'],
            })
        return out
    except Exception as e:
        logger.error(f"DB read error: {e}")
        return []


def _prune_expired_events():
    cutoff = datetime.now(timezone.utc) - timedelta(hours=EVENT_TTL_HOURS)
    expired = []
    for eid, ev in events_by_id.items():
        ts = ev.get('timestamp')
        try:
            dt = datetime.fromisoformat(ts.replace('Z', '+00:00')) if ts else None
        except Exception:
            dt = None
        if dt and dt < cutoff:
            expired.append(eid)
    for eid in expired:
        events_by_id.pop(eid, None)
    return expired


async def handle_client(websocket, path=None):
    connected_clients.add(websocket)
    logger.info(f"Client connected. Total: {len(connected_clients)}")
    # Send snapshot of current active events so new tabs see the map
    try:
        _prune_expired_events()
        snapshot = {
            'type': 'snapshot',
            'events': list(events_by_id.values()),
            'news': news_index[-200:],
        }
        await websocket.send(json.dumps(snapshot))
    except Exception as e:
        logger.error(f"Snapshot send failed: {e}")

    try:
        async for _ in websocket:
            pass
    except Exception:
        pass
    finally:
        connected_clients.discard(websocket)
        logger.info(f"Client disconnected. Total: {len(connected_clients)}")


async def _broadcast(payload: dict):
    if not connected_clients:
        return
    data = json.dumps(payload)
    dead = set()
    for c in connected_clients:
        try:
            await c.send(data)
        except Exception:
            dead.add(c)
    for c in dead:
        connected_clients.discard(c)


async def process_message(channel, message_text, message_id, timestamp,
                          media_items):
    """Classify, dedup, broadcast, and persist a single Telegram message.

    `media_items` is a list of {path, type} — supports Telegram albums. The
    first item is mirrored as media_path/media_type for backward compatibility.
    """
    ts_iso = timestamp.isoformat() if hasattr(timestamp, 'isoformat') else str(timestamp)
    ts_epoch = timestamp.timestamp() if hasattr(timestamp, 'timestamp') else None

    media_items = media_items or []
    primary = media_items[0] if media_items else {}
    media_path = primary.get('path')
    media_type = primary.get('type')

    meta = analyze(message_text or '')
    etype = meta['event_type']
    lat, lng, location = meta.get('lat'), meta.get('lng'), meta.get('location')
    score = meta.get('score', 0.0)
    status = meta.get('event_status')  # ongoing/possible/confirmed/past — may be None

    has_location = lat is not None and lng is not None
    is_relevant = (
        etype not in NON_MAPPABLE_EVENT_TYPES
        and has_location
        and score >= MIN_SCORE_FOR_MAP
    )

    news_row = {
        'channel': channel,
        'message': message_text,
        'message_id': message_id,
        'timestamp': ts_iso,
        'datetime_str': ts_iso[:19],
        'media_path': media_path,
        'media_type': media_type,
        'media_items': media_items,
        'event_type': etype,
        'event_icon': meta['event_icon'],
        'event_label': meta['event_label'],
        'event_cat': meta['event_cat'],
        'event_status': status,
        'lat': lat, 'lng': lng, 'location': location,
        'score': score,
    }

    event_payload = None
    if is_relevant:
        dup = dedup.find_duplicate(etype, location, message_text or '', ts_epoch)
        if dup:
            # Existing event: just add this channel to the credibility counter
            dedup.add_channel(dup, channel)
            eid = dup['id']
            ev = events_by_id.get(eid)
            if ev:
                if channel not in ev['channels']:
                    ev['channels'].append(channel)
                ev['channels_count'] = len(ev['channels'])
                ev['last_seen'] = ts_iso
                event_payload = {'type': 'event_update', 'event': ev}
            news_row['event_id'] = eid
            news_row['duplicate_of'] = eid
        else:
            eid = uuid.uuid4().hex[:12]
            dedup.register(eid, etype, location, message_text or '', channel, ts_epoch)
            ev = {
                'event_id': eid,
                'event_type': etype,
                'event_icon': meta['event_icon'],
                'event_label': meta['event_label'],
                'event_cat': meta['event_cat'],
                'event_status': status,
                'lat': lat, 'lng': lng, 'location': location,
                'channels': [channel],
                'channels_count': 1,
                'timestamp': ts_iso,
                'last_seen': ts_iso,
                'message_preview': (message_text or '')[:240],
                'message_id': message_id,
                'first_message_id': message_id,
                'score': score,
            }
            events_by_id[eid] = ev
            news_row['event_id'] = eid
            event_payload = {'type': 'event_new', 'event': ev}

    # Persist every message (even irrelevant ones stay in the news feed)
    save_message(news_row)
    news_index.append(news_row)
    if len(news_index) > 2000:
        del news_index[:-1000]

    # Broadcast news to sidebar, and a map update if we created/updated an event
    await _broadcast({'type': 'news', **news_row})
    if event_payload:
        await _broadcast(event_payload)

    preview = (message_text or '').replace('\n', ' ')[:70]
    mapped = f" [{meta['event_icon']} {etype}@{location}]" if is_relevant else ''
    logger.info(f"[{channel}]{mapped} {preview}...")


def _classify_media(media):
    if isinstance(media, MessageMediaPhoto):
        return 'photo', '.jpg'
    if isinstance(media, MessageMediaDocument):
        doc = media.document
        if doc is None:
            return None, None
        mime = (doc.mime_type or '').lower()
        if mime.startswith('video/') or any(
                isinstance(a, DocumentAttributeVideo) for a in (doc.attributes or [])):
            ext = '.mp4'
            if mime == 'video/quicktime':
                ext = '.mov'
            elif mime == 'video/webm':
                ext = '.webm'
            return 'video', ext
        if mime.startswith('image/'):
            if 'png' in mime:  ext = '.png'
            elif 'webp' in mime: ext = '.webp'
            elif 'gif' in mime:  ext = '.gif'
            else: ext = '.jpg'
            return 'photo', ext
    return None, None


async def download_message_media(message):
    """Returns (rel_path, media_type) tuple, or None on failure/no-media."""
    if not message.media:
        return None
    media_type, ext = _classify_media(message.media)
    if not media_type:
        return None
    filename = f"{message.id}{ext}"
    filepath = os.path.join(MEDIA_DIR, filename)
    rel = f"{MEDIA_DIR}/{filename}"
    try:
        if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
            return rel, media_type
        await message.download_media(file=filepath)
        if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
            return rel, media_type
    except Exception as e:
        logger.error(f"Media download failed for msg {message.id}: {e}")
    return None


async def _periodic_cleanup():
    """Tell clients which events have expired so their markers get removed."""
    while True:
        await asyncio.sleep(300)  # every 5 min
        expired = _prune_expired_events()
        for eid in expired:
            await _broadcast({'type': 'event_expired', 'event_id': eid})


async def _heartbeat():
    """Write a tiny heartbeat file every 30s so the static-file frontend
    can tell whether the backend is alive even without a WebSocket.

    The frontend reads this file alongside news.json — if its timestamp is
    >120s old, it surfaces a 'BACKEND DOWN' chip in the UI so the analyst
    isn't left wondering why news stopped arriving.
    """
    import time
    while True:
        try:
            with open('telegram_heartbeat.json', 'w') as f:
                json.dump({
                    'ts': time.time(),
                    'ts_iso': time.strftime('%Y-%m-%dT%H:%M:%S%z'),
                    'channels': CHANNELS,
                    'channel_count': len(CHANNELS),
                }, f)
        except Exception as e:
            logger.warning("[telegram-pipe] heartbeat write failed: %s", e)
        await asyncio.sleep(30)


async def start_websocket():
    async with websockets.serve(handle_client, 'localhost', 8765):
        logger.info("WebSocket server started on ws://localhost:8765")
        await asyncio.Future()


async def start_telegram_monitor():
    """Long-running Telegram listener with self-healing reconnect.

    Previously the function exited on the first ConnectionError, which
    silently froze the entire pipeline (news.json stopped updating and
    the frontend kept polling a never-changing file). It now wraps the
    full connect+listen cycle in an outer supervisor loop with bounded
    exponential backoff, so transient network blips, Telegram outages,
    or auth refreshes never permanently break the monitor.
    """
    if not os.path.exists('session_name.session'):
        logger.error("Session does not exist. Run: python3 telegram_monitor_interactive.py")
        return

    # Album buffer survives across reconnects so an album spanning a
    # disconnect still flushes correctly.
    ALBUM_WAIT_SEC = 2.0
    pending_albums: dict = {}   # grouped_id -> {msgs, channel, flush_task}

    async def _flush_album(gid: int):
        bundle = pending_albums.pop(gid, None)
        if not bundle:
            return
        msgs = sorted(bundle['msgs'], key=lambda m: m.id)
        channel = bundle['channel']
        # Concatenate caption text across siblings (caption usually lives on one msg)
        text = ' '.join(m.text for m in msgs if m.text).strip()
        items = []
        for m in msgs:
            info = await download_message_media(m)
            if info:
                path, mtype = info
                items.append({'path': path, 'type': mtype})
        if not text and not items:
            return
        first = msgs[0]
        await process_message(channel, text, first.id, first.date, items)

    async def _delayed_flush(gid: int):
        try:
            await asyncio.sleep(ALBUM_WAIT_SEC)
            await _flush_album(gid)
        except asyncio.CancelledError:
            pass

    backoff_sec = 5
    MAX_BACKOFF = 300       # cap at 5 min between retries
    consecutive_failures = 0

    while True:
        client = TelegramClient('session_name', API_ID, API_HASH)
        try:
            await client.connect()
            if not await client.is_user_authorized():
                logger.error("Session is not authorized. Run: python3 telegram_monitor_interactive.py")
                # Auth failure isn't something a retry will fix; sleep long
                # and try again in case the user re-runs the auth flow.
                await asyncio.sleep(MAX_BACKOFF)
                continue
            logger.info("Telegram client connected — monitor live")
            # Reset backoff on a successful connection
            backoff_sec = 5
            consecutive_failures = 0

            @client.on(events.NewMessage(chats=CHANNELS))
            async def handler(event):
                try:
                    msg = event.message
                    channel = event.chat.title or event.chat.username
                    gid = getattr(msg, 'grouped_id', None)
                    logger.info(
                        "[telegram-pipe] msg received | channel=%s | id=%s | gid=%s | len=%d",
                        channel, msg.id, gid, len(msg.text or '')
                    )
                    if gid is not None:
                        bundle = pending_albums.get(gid)
                        if bundle is None:
                            bundle = {'msgs': [], 'channel': channel, 'flush_task': None}
                            pending_albums[gid] = bundle
                        bundle['msgs'].append(msg)
                        if bundle['flush_task']:
                            bundle['flush_task'].cancel()
                        bundle['flush_task'] = asyncio.create_task(_delayed_flush(gid))
                        return
                    info = await download_message_media(msg)
                    items = [{'path': info[0], 'type': info[1]}] if info else []
                    text = msg.text or ''
                    if not text and not items:
                        return
                    await process_message(channel, text, msg.id, msg.date, items)
                except Exception as e:
                    # Never let a single message kill the listener.
                    logger.exception("[telegram-pipe] handler error: %s", e)

            logger.info(f"Monitoring channels: {CHANNELS}")
            await client.run_until_disconnected()
            logger.warning("[telegram-pipe] run_until_disconnected returned — looping to reconnect")
        except Exception as e:
            consecutive_failures += 1
            logger.error(
                "[telegram-pipe] connection error (%d consecutive failures): %s — retrying in %ds",
                consecutive_failures, e, backoff_sec
            )
        finally:
            try:
                await client.disconnect()
            except Exception:
                pass
        await asyncio.sleep(backoff_sec)
        backoff_sec = min(backoff_sec * 2, MAX_BACKOFF)


async def main():
    init_database()
    logger.info(f"Database initialized: {DB_PATH}")
    logger.info(f"Media directory: {os.path.abspath(MEDIA_DIR)}")

    await asyncio.gather(
        start_websocket(),
        start_telegram_monitor(),
        _periodic_cleanup(),
        _heartbeat(),
    )


if __name__ == '__main__':
    asyncio.run(main())
