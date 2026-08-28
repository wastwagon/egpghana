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

### Using Coolify

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

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types
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
