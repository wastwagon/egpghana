# EGP Ghana Website

Modern, mobile-first website for the Economic Governance Platform Ghana with AI-powered chatbot and real-time economic data dashboards.

## 🚀 Features

- **Mobile-First Design** with blue-black theme
- **Advanced AI Chatbot** for economic Q&A
- **Real-Time Data Dashboards** (Debt Tracker, IMF Bailout)
- **Free API Integrations** (World Bank, IMF, GhanaAPI.dev)
- **SEO Optimized** with Next.js 14
- **Docker-Ready** for easy deployment

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL with pgvector
- **Cache**: Redis
- **AI**: OpenAI GPT-4, LangChain
- **Deployment**: Docker, Coolify

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- Docker Desktop
- Git

## 🏃 Quick Start

### 1. Clone and Install

```bash
cd /Users/OceanCyber/Downloads/EGP
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Docker Services

```bash
npm run docker:up
```

This starts (local only — Coolify ignores this file):
- PostgreSQL on port 5433
- Redis on port 6379
- pgAdmin on port 5050 (http://localhost:5050)

### 4. Set Up Database

```bash
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:3456** 🎉

## 📁 Project Structure

```
/Users/OceanCyber/Downloads/EGP/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   └── styles/           # Global styles
├── prisma/
│   └── schema.prisma     # Database schema
├── scripts/
│   ├── scraper/          # Web scraping scripts
│   ├── import/           # Data import scripts
│   └── ai/               # AI embedding scripts
├── docker-compose.dev.yml # Local Docker Desktop DBs only
└── package.json          # Dependencies
```

## 🐳 Docker Commands

```bash
# Start services
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs

# Access PostgreSQL
docker exec -it egp-postgres psql -U egp_user -d egp_db
```

## 🗄️ Database Management

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio (GUI)
npm run db:studio
```

## 🤖 AI Chatbot Setup

1. Get OpenAI API key from https://platform.openai.com
2. Add to `.env`: `OPENAI_API_KEY=your_key_here`
3. Generate embeddings: `npm run ai:embed`

## 📊 Data Sync

Sync data from free APIs:

```bash
npm run sync:data
```

This fetches data from:
- World Bank API (Ghana economic indicators)
- IMF API (Program data)
- GhanaAPI.dev (Exchange rates)

## 🌐 Deployment

### Production deploy checklist (Coolify)

1. **Secrets** — `DATABASE_URL`, `REDIS_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`, `OPENAI_API_KEY`, Resend SMTP (`SMTP_*`), `CRON_SECRET`, optional `INDICATOR_ALERT_EMAIL`, `GOOGLE_SITE_VERIFICATION`.
2. **Uploads** — persistent volume at `UPLOADS_DIR=/data/uploads` (careers EOIs and media survive redeploys).
3. **Build** — Dockerfile build pack (not Compose); push to `main` to deploy.
4. **Database** — migrations run on deploy; do **not** set `RUN_SEED_ON_STARTUP` on production unless the DB is brand new.
5. **Cron** — schedule `POST /api/admin/data-sync` with `Authorization: Bearer $CRON_SECRET` (optional `RUN_SYNC_ON_STARTUP=true` once after go-live). After large content imports, run `POST /api/admin/embeddings` (same auth) or use **Data Freshness → Refresh embeddings** in admin.
6. **Smoke** — `GET /api/health`, home, `/dashboards`, `/search?q=debt`, `/feed.xml`, `/contact`, admin login, careers EOI path if open.
7. **Redis** — enables indicator + RAG response caching; safe to omit (app falls back to Postgres).

See `Coolify.md` for UI steps.

### Using Coolify (summary)

1. Push to GitHub (`main`)
2. Coolify **Build Pack = Dockerfile** (not Docker Compose)
3. Production uses Coolify’s own Postgres/Redis — local `docker-compose.dev.yml` is ignored
4. Deploys run migrations only; they do not wipe articles/events

See `Coolify.md`.

### Manual Docker Deployment

```bash
docker build -t egp-website .
docker run -p 3456:3000 egp-website
```

## 🧪 Testing

```bash
# Unit / types
npm run type-check
npm run lint

# End-to-end (starts dev server locally, or production build when CI=true)
npm run docker:up
npm run db:restore   # or migrate + seed
npm run test:e2e

# Optional admin login smoke
E2E_ADMIN_EMAIL=admin@egpghana.org E2E_ADMIN_PASSWORD=admin123 npm run test:e2e
```

GitHub Actions runs **type-check**, **lint**, and **Playwright** (Postgres + pgvector, seed, careers EOI API test) on push/PR.

Production uptime checks can hit `GET /api/health` (JSON `{ ok, database, timestamp }`; 503 if Postgres is down).

Partners can read cached headline indicators via `GET /api/indicators/latest` (optional `?keys=gdp_growth,inflation,...`; rate-limited, 5-minute cache).

**Embed (iframe):** use `/embed/indicators` on partner sites:

```html
<iframe
  src="https://egpghana.org/embed/indicators"
  title="EGP Ghana headline indicators"
  width="100%"
  height="420"
  style="border:0;max-width:32rem"
  loading="lazy"
></iframe>
```

Dashboard **Print briefing** opens a print-ready HTML page — use the browser’s “Save as PDF” for a PDF export.

**SEO images:** dynamic Open Graph PNGs are generated for the site root, articles, events, and programs (`/…/opengraph-image`). Articles/events fall back when no upload image is set.

**Bundle size:** run `npm run analyze` (sets `ANALYZE=true`) to open the Next.js bundle analyzer report after build.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types
- `npm run test:e2e` - Playwright public + careers/admin smoke tests
- `npm run scraper:run` - Scrape existing website
- `npm run import:content` - Import scraped content

## 🎨 Design System

- **Primary Color**: Blue (#0066cc)
- **Background**: Black (#0a0a0a)
- **Accent Colors**: Ghana flag (red, yellow, green)
- **Typography**: Inter (body), Poppins (headings)
- **Mobile-First**: Designed for 320px+ screens

## 📱 Mobile Development

Test on different devices:
1. Open Chrome DevTools (Cmd+Option+I)
2. Toggle device toolbar (Cmd+Shift+M)
3. Select device or enter custom dimensions

## 🔒 Security

- Environment variables in `.env` (never commit!)
- CORS configured for production domain
- Rate limiting on API routes
- Input validation with Zod

## 📄 License

© 2026 Economic Governance Platform Ghana

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit via GitHub Desktop
5. Push and create PR

## 📞 Support

For issues or questions, contact the EGP team.

---

**Built with ❤️ for Ghana's economic transparency**
