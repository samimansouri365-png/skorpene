#!/bin/bash
# GeoScope launcher
# Brings up: web server (port 8000), auth server (port 9000), Telegram monitor
# (WebSocket port 8765 + writes news.json on every new message).
# All three are required for live news to flow into the map.

set -e

echo "🚀 Iniciando GeoScope..."

cd "$(dirname "$0")"

# Kill any existing instances so we never end up with two writers competing
# for news.json / port 8765 (the leading cause of "news stopped updating").
pkill -f "auth_server.py" 2>/dev/null || true
pkill -f "telegram_monitor.py" 2>/dev/null || true
pkill -f "http.server" 2>/dev/null || true
sleep 1

# Web server (static frontend)
python3 -m http.server 8000 > web_server.log 2>&1 &
WEB_PID=$!
echo "✅ Web server: http://localhost:8000 (pid $WEB_PID)"
sleep 1

# Auth server (one-shot to refresh the Telegram session, if needed)
python3 auth_server.py > auth_server.log 2>&1 &
AUTH_PID=$!
echo "✅ Auth page: http://localhost:9000 (pid $AUTH_PID)"

# Telegram monitor — the live news pipeline. Writes news.json on every
# message and broadcasts over ws://localhost:8765. If the session file
# is missing, the user must first authenticate via http://localhost:9000.
if [ -f "session_name.session" ]; then
  python3 telegram_monitor.py > telegram_monitor.log 2>&1 &
  MON_PID=$!
  echo $MON_PID > telegram_monitor.pid
  echo "✅ Telegram monitor: ws://localhost:8765 (pid $MON_PID, log: telegram_monitor.log)"
else
  echo "⚠️  No session_name.session found — backend NOT started."
  echo "    → Go to http://localhost:9000 and authenticate first."
fi

echo ""
echo "📱 Abre http://localhost:8000 para ver el mapa."
echo "   Nuevas noticias aparecen automáticamente (latencia < 60s)."
