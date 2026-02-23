# EGP Ghana - Full Database Restoration Guide

Use this guide when Docker Desktop crashes or you need to restore the database from scratch (e.g., after losing containers).

## Prerequisites

- Docker Desktop running
- Node.js 18+ and npm 9+

## Quick Restoration (Copy-Paste)

Run these commands in order from the project root:

```bash
# 1. Start Docker services (Postgres, Redis, pgAdmin)
npm run docker:up

# 2. Wait for Postgres to be ready (5-10 seconds)
sleep 8

# 3. Install dependencies (if needed)
npm install --legacy-peer-deps

# 4. Run migrations
npx prisma migrate deploy

# 5. Sync schema (creates any missing tables like programs, analytics_events)
npx prisma db push

# 6. Seed base data (users, categories, programs, staff, articles, events, economic data from local_data_export.json)
npx prisma db seed

# 7. Seed dashboard data (IMF, Debt, Economy charts with full metadata)
npx tsx scripts/seed-dashboards-complete.ts

# 8. Start the app
npm run dev
```

Visit **http://localhost:3456** to preview.

---

## Step-by-Step Explanation

### 1. Docker Services

- **Postgres** (pgvector): `localhost:5433` → internal 5432
- **Redis**: `localhost:6379`
- **pgAdmin**: `http://localhost:5050` (admin@egpghana.org / admin123)

### 2. Environment

Ensure `.env` has:

```
DATABASE_URL="postgresql://egp_user:egp_dev_password_2026@localhost:5433/egp_db"
```

**Important**: Use port **5433** (Docker maps host 5433 → container 5432).

### 3. Migrations vs db push

- `prisma migrate deploy` applies migration history
- `prisma db push` syncs schema and creates any tables missing from migrations (e.g. `programs`, `analytics_events`, `daily_stats`)

### 4. Seeding Order

1. **Production seed** (`npx prisma db seed`): Uses `scripts/seed-production.ts`
   - Admin user (admin@egpghana.org / admin123)
   - Categories, programs, staff
   - Imports articles, events, economic data from `scripts/local_data_export.json`

2. **Dashboard seed** (`npx tsx scripts/seed-dashboards-complete.ts`):
   - IMF disbursements, conditionalities, milestones
   - Debt by creditor
   - Economy data (GDP, inflation, exchange rate, etc.)

### 5. Optional: AI Embeddings

For the AI chatbot to search articles:

```bash
npm run ai:embed
```

Requires `OPENAI_API_KEY` in `.env`.

---

## Troubleshooting

### "Container name already in use"

```bash
docker-compose down --remove-orphans
docker rm -f egp-postgres egp-redis egp-pgadmin 2>/dev/null
docker-compose up -d
```

### "Table does not exist"

Run `npx prisma db push` to sync schema.

### npm install fails (peer dependency conflicts)

```bash
npm install --legacy-peer-deps
```

### Port 5433 in use

Change `DATABASE_URL` port in `.env` and `docker-compose.yml` ports if needed.

---

## Deployment to Coolify (VPS)

1. Commit and push your code
2. In Coolify, connect the repo and set environment variables
3. On each deploy, `entrypoint.sh` runs **migrations only** (no seed by default)
4. **Production content is preserved** – publications added via admin UI on live will not be wiped on deploy

### When to run seed on production

- **Fresh database**: Set `RUN_SEED_ON_STARTUP=true` in Coolify env for the first deploy only, then remove it
- **Manual restore**: Admin → Settings → Database tab → "Full Restore" (overwrites with `local_data_export.json`)

---

## Local ↔ Production Sync

**Problem:** The seed script **deletes all articles/events/economic data** and re-imports from `local_data_export.json`. Running it on every deploy was wiping production content.

**Solution:** Seed no longer runs automatically on deploy. Content added on production now persists.

**To push local content to production** (overwrites production content):
1. Run `npm run export:data` locally
2. Commit `scripts/local_data_export.json`
3. Deploy (migrations only)
4. Admin → Settings → Database → "Full Restore" (run seed manually)

**To add content on production:** Use the admin UI. It will persist across deploys.

---

## Data Export (Before Losing Data)

To refresh the export file used by production seed:

```bash
npm run export:data
```

This creates/updates `scripts/local_data_export.json`. Commit it so future restorations include your content.
