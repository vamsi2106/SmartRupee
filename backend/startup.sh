#!/bin/sh
# Azure Web App startup script
export PORT="${PORT:-8000}"
echo "Starting SmartRupee FastAPI server on port $PORT..."
exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT"
