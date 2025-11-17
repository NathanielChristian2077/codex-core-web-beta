#!/bin/bash
# Run 'chmod +x stop.sh' before running this file

echo "== Killing processes =="

if [ -f backend.pid ]; then
  kill $(cat backend.pid) && echo "Backend stoped running."
  rm backend.pid
else
  echo "'backend.pid' not found."
fi

if [ -f frontend.pid ]; then
  kill $(cat frontend.pid) && echo "Frontend stoped running"
  rm frontend.pid
else
  echo "'frontend.pid' not found."
fi
