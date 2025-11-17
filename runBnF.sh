#!/bin/bash
# Run 'chmod +x runBnF.sh' before running this file
# Backend and Frontend start

set -e

echo "== Starting Backend =="
cd backend
npm run dev &
echo $! >../backend.pid

echo "== Starting Frontend =="
cd ../frontend
npm run dev &
echo $! >../frontend.pid

echo "Backend and Frontend started. Run stop.sh to kill both (or ^C to kill them manually)."
