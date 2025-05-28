#!/bin/bash

# Clean PM2 logs and restart the EPITA Hub server

echo "🧹 Cleaning PM2 logs..."
pm2 flush

echo "🔁 Restarting the EPITA Hub server..."
pm2 restart epita-hub

echo "✅ Restart completed."

