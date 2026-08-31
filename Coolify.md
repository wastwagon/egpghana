# Coolify Deployment Guide for EGP Ghana

This project is now prepared for deployment on your Hostinger VPS using Coolify.

## 1. Prerequisites
- Hostinger VPS with Coolify installed.
- Github repository: `https://github.com/wastwagon/egpghana` (Connected to Coolify).

## 2. Deployment Architecture (Best Practices)
For a full-stack Next.js app, the best approach in Coolify is:
1. **Database Resource**: Create a "PostgreSQL" service in Coolify.
2. **Redis Resource**: Create a "Redis" service in Coolify.
3. **Application Resource**: Link your GitHub repo as a "Public Repository" or "GitHub App" resource.

## 3. Step-by-Step Setup in Coolify

### Step A: Databases
1.  Go to **Resources** -> **New Resource** -> **PostgreSQL**.
2.  Name it `egp-db`.
3.  Note the **Internal Connection String** (e.g., `postgresql://user:pass@egp-db:5432/db`).
4.  Do the same for **Redis** and name it `egp-redis`.

### Step B: Application
1.  Go to **Resources** -> **New Resource** -> **Public Repository**.
2.  URL: `https://github.com/wastwagon/egpghana`.
3.  Branch: `main`.
4.  **Build Pack**: Select `Dockerfile`. Do **not** select Docker Compose. The repo’s compose file (`docker-compose.dev.yml`) is for local Docker Desktop only.

### Step C: Environment Variables
Go to the **Environment Variables** tab of your application in Coolify and add:

| Key | Value (Example) | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://user:pass@egp-db:5432/db` | Use the internal string from Step A |
| `REDIS_URL` | `redis://egp-redis:6379` | Internal Redis link |
| `NEXTAUTH_SECRET` | `generate-a-long-random-string` | For admin authentication |
| `NEXTAUTH_URL` | `https://egpghana.org` | Your production URL |
| `NEXT_PUBLIC_APP_URL` | `https://egpghana.org` | Public app URL |
| `OPENAI_API_KEY` | `your-openai-key` | For the AI Chatbot |
| `NODE_ENV` | `production` | Ensure it's set to production |
| `UPLOADS_DIR` | `/data/uploads` | Must match Coolify volume destination (Step E) |
| `CRON_SECRET` | long random hex | Protects `POST /api/admin/data-sync` |
| `RUN_SYNC_ON_STARTUP` | `true` | After each deploy, auto-refresh BoG / Mid-Year / WB indicators |
| `CAREERS_NOTIFY_EMAIL` | `egpghana20@gmail.com` | Receives a copy of each career / EOI form |
| `SMTP_HOST` | `smtp.resend.com` | Resend SMTP |
| `SMTP_PORT` | `465` | Resend SSL port (`587` also works) |
| `SMTP_USER` | `resend` | Resend SMTP username |
| `SMTP_PASSWORD` | `re_...` | Resend API key |
| `SMTP_FROM` | `EGP Ghana <noreply@egpghana.org>` | Must be a domain verified in Resend |
| `RUN_SEED_ON_STARTUP` | *(leave unset)* | Do **not** set on a live site |
| `ALLOW_DESTRUCTIVE_SEED` | *(leave unset)* | Only with `RUN_SEED_ON_STARTUP` on a brand-new empty database, then remove both |

### Step D: Domains
1.  In the **Domains** tab, set it to `https://egpghana.org`.
2.  Coolify will automatically handle SSL (Let's Encrypt) via its built-in Traefik/Caddy proxy.

### Step E: Persistent Storage (Required — stops broken article images)

**Symptom if missing:** New article images work for a few days, then 404 after the next Coolify redeploy. The database still has the image URLs; only the files on the container disk are deleted. Bundled assets under `/assets/images/` are fine (they ship in the image).

1. Go to your application → **Storage** tab.
2. Add **Persistent Storage** (Volume):
   - **Name / Source**: `egp-uploads`
   - **Destination**: `/data/uploads`
3. In **Environment Variables**, add:
   - `UPLOADS_DIR` = `/data/uploads`
4. Redeploy the application.
5. Check startup logs for: `✅ Uploads are on a Docker volume mount`.
   - If you see `CRITICAL: Uploads are NOT on a persistent volume`, the mount did not apply — fix Storage and redeploy again.
6. In **Admin → Settings → Database**, confirm **Uploads: Persistent volume**.
7. Re-upload images for any articles that are already broken (those files are already gone).

**Do not** mount an empty volume over a path that still has working files without copying them out first — a new empty volume hides existing container files. After persistence is confirmed, re-upload only what’s broken.

Alternative destination (older docs): `/app/public/uploads` also works if that exact path is the Coolify mount destination (no `UPLOADS_DIR` needed). Prefer `/data/uploads` so app image rebuilds never collide with upload storage.

The entrypoint fixes volume permissions on startup. If uploads fail with permission errors, check container logs.

## 4. Auto data sync (no manual curl)

### On every deploy
Set both env vars, then redeploy:
- `CRON_SECRET` = your secret
- `RUN_SYNC_ON_STARTUP` = `true`

The entrypoint waits for the app to be healthy, then calls `POST /api/admin/data-sync` internally. Check deploy logs for `✅ Startup data sync OK`.

### Daily schedule (Coolify Scheduled Task)
1. Open the app in Coolify → **Scheduled Tasks** / **Cron**.
2. Schedule: `0 6 * * *` (06:00 UTC daily).
3. Command:

```bash
curl -sS -X POST "http://127.0.0.1:3000/api/admin/data-sync" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"source":"all"}'
```

(If Coolify runs cron outside the container, use `https://egpghana.org/api/admin/data-sync` instead of localhost.)

## 5. Why this setup is "Best Practice"
- **Standalone Mode**: The `Dockerfile` uses Next.js `standalone` output, which makes the image ~1GB smaller and much faster to start.
- **Auto-Migrations**: The `scripts/entrypoint.sh` runs `prisma migrate deploy` on each deploy. **Seed is skipped by default** so content added via admin UI on production persists across deploys.
- **Optional seed on deploy**: Leave `RUN_SEED_ON_STARTUP` unset. A live production seed is blocked unless `ALLOW_DESTRUCTIVE_SEED=true` (first empty database only). For content updates, use Admin → Settings → **Sync (Merge)**. Full Restore still wipes if you confirm it in admin.
- **Auto indicator sync**: With `RUN_SYNC_ON_STARTUP=true` + `CRON_SECRET`, Mid-Year / BoG / World Bank refresh after each deploy.
- **Separation of Concerns**: By using Coolify's built-in DB services instead of a single `docker-compose`, you get automatic backups and better management.

## 6. Local Development
Continue using:
- `npm run docker:up` (local Postgres / Redis / pgAdmin via `docker-compose.dev.yml`)
- `npm run dev` (Next.js on http://localhost:3456)

Pushing to `main` redeploys the **app container** on Coolify (migrations + new code). It does **not** replace the Coolify Postgres/Redis data, and it will not run the wipe-seed.
