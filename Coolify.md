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

### Step D: Domains
1.  In the **Domains** tab, set it to `https://egpghana.org`.
2.  Coolify will automatically handle SSL (Let's Encrypt) via its built-in Traefik/Caddy proxy.

### Step E: Persistent Storage (Important)
Since the app allows file uploads, you must ensure they aren't lost when you redeploy:
1. Go to your application -> **Storage** tab.
2. Add a new **Persistent Storage** (Volume):
   - **Source**: `egp-uploads`
   - **Destination**: `/app/public/uploads`

## 4. Why this setup is "Best Practice"
- **Standalone Mode**: The `Dockerfile` uses Next.js `standalone` output, which makes the image ~1GB smaller and much faster to start.
- **Auto-Migrations**: The `scripts/entrypoint.sh` runs `prisma migrate deploy` on each deploy. **Seed is skipped by default** so content added via admin UI on production persists across deploys.
- **Optional seed on deploy**: Set `RUN_SEED_ON_STARTUP=true` only for first-time/fresh DB setup. For manual seed, use Admin → Settings → Database tab.
- **Separation of Concerns**: By using Coolify's built-in DB services instead of a single `docker-compose`, you get automatic backups and better management.

## 5. Local Development
Continue using:
- `docker-compose up -d` (Local DBs)
- `npm run dev` (Local Next.js)
