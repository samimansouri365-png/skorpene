#!/usr/bin/env python3
"""
Setup Telegram with pre-provided code
"""

import asyncio
from telethon import TelegramClient

API_ID = 30308641
API_HASH = '7fb8e291c191607a45a7e96454c0bd75'
PHONE = '+34642247539'
CODE = '48473'

async def setup():
    client = TelegramClient('session_name', API_ID, API_HASH)

    print("🔐 Autenticando con Telegram...")
    try:
        await client.start(phone=PHONE, code_callback=lambda: CODE)
        print("✅ ¡Autenticación completada!")
        await client.disconnect()
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    asyncio.run(setup())
