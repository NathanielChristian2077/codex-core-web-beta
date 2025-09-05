# --run chmod +x setup.sh before running setup
# --create both '.env'(back/front) before running setup
set -e

echo "== Uploading db trough Docker =="
docker compose -f infra/docker-compose.yml up -d
echo "== Installing backend dependencies =="
cd backend
npm install

echo "== Prisma generate =="
npx prisma generate

echo "== Prisma migrate dev =="
npx prisma migrate dev --name init

echo "== Starting seed =="
if [ -f prisma/seed.ts ]; then
  npm run db:seed
else
  echo "Seed not found, skipping..."
fi

echo "== Installing frontend dependencies =="
cd ../frontend
npm install
npm install i -D @tailwindcss/vite @tailwindcss/cli tailwindcss postcss autoprefixer framer-motion

echo "== Installing libs =="
npm i react-router-dom zustand axios d3
npm i -D @types/d3 @types/react-router-dom

echo "== Installing utils (optional:recommended) =="
npm i -D eslint prettier vite-tsconfig-paths

echo "== Setup succeded! run 'npm run dev' on /backend or /frontend. =="