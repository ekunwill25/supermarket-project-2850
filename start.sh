#!/bin/bash

# replace hardcoded localhost with dynamic detection so the same code works
# in both local vsc (localhost:8080) and github codespaces automatically
find /workspaces/supermarket-project-2850/frontend -name "*.html" -exec sed -i \
  "s|const API = '.*'|const API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8080' : \`https://\${window.location.hostname.replace(/-5500\\./, '-8080.')}\`|g" {} \;

echo "Starting backend on port 8080..."
cd /workspaces/supermarket-project-2850/Backend-SupermarketDatabase
./gradlew bootRun &

echo "Starting frontend on port 5500..."
cd /workspaces/supermarket-project-2850
npx live-server . --port=5500 --no-browser &

echo "Both servers running!"
echo "Frontend: https://${CODESPACE_NAME}-5500.app.github.dev/frontend/index.html"
echo "Backend:  https://${CODESPACE_NAME}-8080.app.github.dev/products"

wait