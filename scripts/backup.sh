#!/bin/bash

# Archive project code and JSON data for EPITA Hub


BACKUP_DIR="$HOME/backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
PROJECT_DIR="$HOME/epita-hub-auth"
BACKUP_FILE="$BACKUP_DIR/epita-hub-backup-$TIMESTAMP.tar.gz"

mkdir -p "$BACKUP_DIR"

echo "🛑 Stopping the server temporarily..."
pm2 stop epita-hub

echo "🗄️ Creating archive..."
tar -czvf "$BACKUP_FILE" "$PROJECT_DIR"

echo "✅ Backup created: $BACKUP_FILE"

echo "▶️ Restarting the server..."
pm2 start epita-hub

