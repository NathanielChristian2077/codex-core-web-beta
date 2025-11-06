#!/bin/bash
# -- Run 'chmod +x setup.sh' before running setup
# -- Make sure both '.env' files (backend and frontend) exist before running

set -e

echo "== Starting PostgreSQL via Docker Compose =="
docker compose -f infra/docker-compose.yml up -d

echo "== Installing backend dependencies =="
cd backend
npm install

echo "== Installing authentication dependencies =="
npm install @nestjs/passport passport passport-jwt @nestjs/jwt
npm install -D @types/passport-jwt

echo "== Generating Prisma client =="
npx prisma generate

echo "== Running Prisma migrations =="
npx prisma migrate dev --name init

echo "== Running database seed =="
if [ -f prisma/seed.ts ]; then
  npm run db:seed
else
  echo "Seed not found, skipping..."
fi

echo "== Installing frontend dependencies =="
cd ../frontend
npm install

echo "== Installing Tailwind and styling tools =="
npm install -D @tailwindcss/vite @tailwindcss/cli tailwindcss postcss autoprefixer framer-motion

echo "== Installing frontend libraries =="
npm install react-router-dom zustand axios d3
npm install -D @types/d3 @types/react-router-dom

echo "== Installing optional utilities (ESLint, Prettier, TS paths) =="
npm install -D eslint prettier vite-tsconfig-paths

echo "== Setup completed successfully! =="
echo "You can now run the project using:"
echo "  → Backend: cd backend && npm run dev"
echo "  → Frontend: cd frontend && npm run dev"
echo "  → Auto run script: runBnF.sh"
