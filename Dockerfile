# Install dependencies only when needed
FROM node:20-alpine AS deps
# Add openssl to fix Prisma libssl.so.1.1 error in Alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install dependencies based on the preferred package manager.
# Coolify can inject NODE_ENV=production as a build ARG. That would skip
# tailwindcss / postcss / typescript (devDependencies) and fail `next build`.
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --include=dev

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
# Add openssl here too for the build phase (prerendering)
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

# Final stage also needs openssl, curl, su-exec (for dropping privileges)
RUN apk add --no-cache openssl curl su-exec

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir -p .next && chown nextjs:nodejs .next

# Copy necessary files for the application with correct permissions
# Use --chown to avoid slow recursive chown later
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Ensure uploads directories exist (gitignored). Prefer Coolify volume at /data/uploads
# with env UPLOADS_DIR=/data/uploads so files survive redeploys. Entrypoint chowns + links.
RUN mkdir -p public/uploads /data/uploads \
  && chown nextjs:nodejs public/uploads /data/uploads
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy prisma and scripts for migrations/seeding
# We only copy the full node_modules if we really need tsx/prisma at runtime
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
# Career EOI upsert imports this at container start (not included in standalone output)
RUN mkdir -p src/lib
COPY --from=builder --chown=nextjs:nodejs /app/src/lib/career-tor-content.ts ./src/lib/career-tor-content.ts

# Ensure entrypoint is executable
RUN chmod +x scripts/entrypoint.sh

# Run as root so entrypoint can fix volume permissions, then drop to nextjs
# USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Basic healthcheck to help Traefik/Coolify
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/api/auth/session || exit 1

ENTRYPOINT ["/app/scripts/entrypoint.sh"]
