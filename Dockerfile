# Install dependencies only when needed
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Copy standalone output
COPY --from=builder /app/.next/standalone ./

# Copy prisma for migrations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Copy entrypoint
COPY --from=builder /app/scripts/entrypoint.sh ./scripts/entrypoint.sh

# Set the correct permission
RUN mkdir -p .next
RUN chown -R nextjs:nodejs .next prisma scripts
RUN chmod +x scripts/entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

ENTRYPOINT ["/app/scripts/entrypoint.sh"]
