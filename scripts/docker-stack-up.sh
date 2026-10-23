#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

COMPOSE=(docker compose -f docker-compose.dev.yml -f docker-compose.web.yml)
DB_PASSWORD="${DB_PASSWORD:-egp_dev_password_2026}"
export DATABASE_URL="postgresql://egp_user:${DB_PASSWORD}@localhost:5433/egp_db"

echo "▶ Starting Postgres, Redis, and pgAdmin..."
docker compose -f docker-compose.dev.yml up -d postgres redis pgadmin

echo "▶ Waiting for Postgres to be healthy..."
for i in $(seq 1 60); do
  if docker compose -f docker-compose.dev.yml exec -T postgres pg_isready -U egp_user -d egp_db >/dev/null 2>&1; then
    break
  fi
  if [ "$i" -eq 60 ]; then
    echo "❌ Postgres did not become ready in time."
    exit 1
  fi
  sleep 2
done

if command -v node >/dev/null 2>&1 && [ -f package.json ]; then
  echo "▶ Applying migrations (host) so Next.js can prerender during image build..."
  npx prisma migrate deploy
else
  echo "⚠️ Node not available on host; skipping migrate (build may fail if schema is missing)."
fi

echo "▶ Building web image (build container uses compose network → postgres)..."
"${COMPOSE[@]}" build web

echo "▶ Starting web container..."
"${COMPOSE[@]}" up -d web

echo ""
"${COMPOSE[@]}" ps
echo ""
echo "✅ Stack is up:"
echo "   Site:    http://localhost:3456"
echo "   Health:  http://localhost:3456/api/health"
echo "   pgAdmin: http://localhost:5050"
echo "   Logs:    npm run docker:stack:logs"
