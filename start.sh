# asked AI for this script

#!/bin/bash
# starts both backend and frontend servers simultaneously

echo "Starting backend on port 8080..."
cd /workspaces/supermarket-project-2850/Backend-SupermarketDatabase
./gradlew bootRun &
BACKEND_PID=$!

echo "Starting frontend on port 5500..."
cd /workspaces/supermarket-project-2850
npx live-server . --port=5500 --no-browser &
FRONTEND_PID=$!

echo "Both servers running!"
echo "Backend: https://\$CODESPACE_NAME-8080.app.github.dev"
echo "Frontend: https://\$CODESPACE_NAME-5500.app.github.dev/frontend/index.html"

wait