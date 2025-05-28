#!/bin/bash

# Restore a backup archive and restart the EPITA Hub server

BACKUP_DIR="$HOME/backups"
PROJECT_DIR="$HOME/epita-hub-auth"

echo "📂 Available backups:"
ls "$BACKUP_DIR" | grep epita-hub-backup
echo ""
read -p "Enter the exact name of the backup file to restore: " BACKUP_NAME

if [ ! -f "$BACKUP_DIR/$BACKUP_NAME" ]; then
    echo "❌ Backup file not found!"
    exit 1
fi

echo "🧨 Removing existing project directory..."
pm2 stop epita-hub
rm -rf "$PROJECT_DIR"

echo "📦 Extracting the backup..."
tar -xzvf "$BACKUP_DIR/$BACKUP_NAME" -C ~

echo "▶️ Restarting the server..."
cd "$PROJECT_DIR"
pm2 start server.js --name epita-hub
pm2 save

echo "✅ Restoration complete."

