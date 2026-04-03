#!/bin/sh
# Rebuild a redeploy blogu První pozice
# Spuštění: ./rebuild.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "📦 Instalace závislostí..."
docker run --rm -v "$SCRIPT_DIR:/app" -w /app node:20-alpine npm install

echo "🔨 Build..."
docker run --rm -v "$SCRIPT_DIR:/app" -w /app node:20-alpine npm run build

echo "🔄 Reload nginx..."
docker cp "$SCRIPT_DIR/nginx.conf" prvni-pozice-blog:/etc/nginx/conf.d/default.conf
docker exec prvni-pozice-blog nginx -s reload

echo "✅ Hotovo! Web je dostupný na portu 3001"
