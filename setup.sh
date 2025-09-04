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

echo "== Setup succeded! run 'npm run dev' on /backend. =="
