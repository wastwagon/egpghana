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
4.  **Build Pack**: Select `Dockerfile`. Coolify will automatically find the `Dockerfile` I created.

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

## 4. Why this setup is "Best Practice"
- **Standalone Mode**: The `Dockerfile` uses Next.js `standalone` output, which makes the image ~1GB smaller and much faster to start.
- **Auto-Migrations**: The `scripts/entrypoint.sh` runs `prisma migrate deploy` on each deploy. **Seed is skipped by default** so content added via admin UI on production persists across deploys.
- **Optional seed on deploy**: Set `RUN_SEED_ON_STARTUP=true` only for first-time/fresh DB setup. For manual seed, use Admin → Settings → Database tab.
- **Separation of Concerns**: By using Coolify's built-in DB services instead of a single `docker-compose`, you get automatic backups and better management.

## 5. Local Development
Continue using:
- `docker-compose up -d` (Local DBs)
- `npm run dev` (Local Next.js)
