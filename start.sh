#!/bin/bash
BACKEND_URL="https://${CODESPACE_NAME}-8080.app.github.dev"
echo "Setting API URL to $BACKEND_URL"
find /workspaces/supermarket-project-2850/frontend -name "*.html" -exec sed -i \
  "s|const API = '.*'|const API = '${BACKEND_URL}'|g" {} \;

echo "Starting backend..."
cd /workspaces/supermarket-project-2850/Backend-SupermarketDatabase
./gradlew bootRun &

echo "Starting frontend..."
cd /workspaces/supermarket-project-2850
npx live-server . --port=5500 --no-browser &
wait
