#!/usr/bin/env python3
"""
Interactive Telegram setup (run this FIRST TIME ONLY to authenticate)
"""

import asyncio
from telethon import TelegramClient

API_ID = 30308641
API_HASH = '7fb8e291c191607a45a7e96454c0bd75'
PHONE = '+34642247539'

async def setup():
    client = TelegramClient('session_name', API_ID, API_HASH)

    print("\n🔐 Iniciando autenticación de Telegram...")
    print("1. Recibirás un SMS con un código de 5 dígitos")
    print("2. Pégalo aquí cuando te lo pida\n")

    await client.start(phone=PHONE)

    me = await client.get_me()
    print(f"\n✅ ¡Autenticación completada como @{me.username or me.first_name}!")
    print("Sesión guardada en session_name.session")
    print("Ahora puedes correr: python3 telegram_monitor.py\n")

    # Do NOT call log_out() — that destroys the session we just created.
    await client.disconnect()

if __name__ == '__main__':
    asyncio.run(setup())
