#!/usr/bin/env python3
"""
Web interface for Telegram authentication
Visit http://localhost:9000 to paste the SMS code
"""

import asyncio
from aiohttp import web
from telethon import TelegramClient
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

API_ID = 30308641
API_HASH = '7fb8e291c191607a45a7e96454c0bd75'
PHONE = '+34642247539'

# Global state
auth_code = None
auth_complete = False

async def handle_index(request):
    """Serve HTML form"""
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Telegram Authentication</title>
        <style>
            body { font-family: Arial; background: #1a1a1a; color: #0ff; padding: 40px; }
            .container { max-width: 500px; margin: 0 auto; background: #222; padding: 30px; border-radius: 10px; }
            h1 { text-align: center; }
            input { width: 100%; padding: 10px; margin: 20px 0; font-size: 18px; border: 1px solid #0ff; background: #111; color: #0ff; }
            button { width: 100%; padding: 10px; background: #0ff; color: #000; border: none; cursor: pointer; font-size: 16px; font-weight: bold; }
            button:hover { background: #0cc; }
            .message { text-align: center; margin-top: 20px; padding: 10px; border-radius: 5px; }
            .success { background: #0f0; color: #000; }
            .error { background: #f00; color: #fff; }
            .info { background: #00f; color: #fff; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔐 Autenticación Telegram</h1>
            <div class="message info">
                <p><strong>1.</strong> Abre Telegram en tu teléfono</p>
                <p><strong>2.</strong> Verifica el código que recibirás por SMS</p>
                <p><strong>3.</strong> Pégalo aquí (5 dígitos)</p>
            </div>
            <form id="authForm">
                <input type="text" id="code" placeholder="Código SMS (5 dígitos)" maxlength="5" pattern="[0-9]{5}" required>
                <button type="submit">Verificar</button>
            </form>
            <div id="status"></div>
        </div>
        <script>
            document.getElementById('authForm').onsubmit = async (e) => {
                e.preventDefault();
                const code = document.getElementById('code').value;
                const status = document.getElementById('status');

                status.className = 'message info';
                status.textContent = 'Verificando...';

                try {
                    const response = await fetch('/auth', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({code})
                    });
                    const data = await response.json();

                    if (data.success) {
                        status.className = 'message success';
                        status.innerHTML = '<strong>✅ ¡Autenticación completada!</strong><br>El monitor está corriendo. Ve a http://localhost:8000';
                    } else {
                        status.className = 'message error';
                        status.textContent = '❌ Error: ' + data.error;
                    }
                } catch (err) {
                    status.className = 'message error';
                    status.textContent = '❌ Error: ' + err.message;
                }
            };
        </script>
    </body>
    </html>
    """
    return web.Response(text=html, content_type='text/html')

async def handle_auth(request):
    """Handle SMS code submission"""
    global auth_code, auth_complete

    try:
        data = await request.json()
        code = data.get('code', '')

        if not code or len(code) != 5:
            return web.json_response({'success': False, 'error': 'Código inválido'})

        auth_code = code
        logger.info(f"Código recibido: {code}")

        return web.json_response({'success': True, 'message': 'Verificando...'})
    except Exception as e:
        return web.json_response({'success': False, 'error': str(e)})

async def authenticate_telegram():
    """Authenticate with Telegram using provided code"""
    global auth_code, auth_complete

    client = TelegramClient('session_name', API_ID, API_HASH)

    try:
        # Wait for code to be provided
        logger.info("Esperando código SMS...")
        while not auth_code:
            await asyncio.sleep(0.5)

        logger.info(f"Usando código: {auth_code}")

        async def code_callback():
            return auth_code

        await client.start(phone=PHONE, code_callback=code_callback)
        logger.info("✅ Autenticación exitosa!")
        auth_complete = True
        await client.disconnect()

        # Inicia el monitor
        logger.info("Iniciando monitor de Telegram...")
        import subprocess
        subprocess.Popen(['python3', 'telegram_monitor.py'],
                        stdout=open('telegram_monitor.log', 'w'),
                        stderr=subprocess.STDOUT)

    except Exception as e:
        logger.error(f"Error: {e}")
    finally:
        await client.disconnect()

async def main():
    """Start web server and Telegram auth"""
    app = web.Application()
    app.router.add_get('/', handle_index)
    app.router.add_post('/auth', handle_auth)

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, 'localhost', 9000)
    await site.start()

    logger.info("🌐 Servidor de autenticación en: http://localhost:9000")

    # Start Telegram auth in background
    auth_task = asyncio.create_task(authenticate_telegram())

    try:
        await asyncio.Event().wait()
    except KeyboardInterrupt:
        pass
    finally:
        await runner.cleanup()

if __name__ == '__main__':
    asyncio.run(main())
