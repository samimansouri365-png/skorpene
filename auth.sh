#!/bin/bash
# Interactive Telegram Authentication
# Run this in your terminal: bash auth.sh

cd "/Users/mansouri/geopolitica."

echo "Starting Telegram authentication..."
echo "You will receive an SMS with a 5-digit code."
echo ""

python3 telegram_monitor_interactive.py

echo ""
echo "✅ Authentication complete!"
echo "Now run the monitor: python3 telegram_monitor.py"
