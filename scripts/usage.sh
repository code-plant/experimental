#!/bin/bash

set -e

cd "$(dirname "$0")/.."

sh scripts/for-each-package.sh "! [ -f .env.example ] || [ -f .env ] || cp .env.example .env"

chmod a+x scripts/localstack-setup.sh
docker compose up -d

(cd packages/backend/scripts/main && npm start) &
BACKEND_SERVER_PID=$!

# Start the frontend server
(cd packages/frontend/app/main && npm start)

# Cleanup
kill $BACKEND_SERVER_PID
docker compose down
