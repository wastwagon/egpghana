#!/bin/sh

# Set error handling
echo "--- DEPLOYMENT STARTUP ---"
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"

# Run migrations if DATABASE_URL is present
if [ -n "$DATABASE_URL" ]; then
  echo "📡 DATABASE_URL is set. Checking connection..."
  
  echo "🚀 Running database migrations (npx prisma migrate deploy)..."
  if npx prisma migrate deploy; then
    echo "✅ Migrations applied successfully."

    echo "💼 Ensuring career listings exist (upsert, does not wipe applications)..."
    if npx tsx scripts/seed-career-opportunity.ts; then
      echo "✅ Career listings checked."
    else
      echo "⚠️ Career listing seed failed (app will still start). Check logs above."
    fi
    
    # Seed is skipped on every normal Coolify deploy so admin-created content survives.
    # Destructive seed (wipes articles/events/economic data) is blocked in production
    # unless ALLOW_DESTRUCTIVE_SEED=true — only for a brand-new empty database.
    if [ "$RUN_SEED_ON_STARTUP" = "true" ]; then
      if [ "${NODE_ENV}" = "production" ] && [ "$ALLOW_DESTRUCTIVE_SEED" != "true" ]; then
        echo "ℹ️ RUN_SEED_ON_STARTUP ignored in production without ALLOW_DESTRUCTIVE_SEED=true."
        echo "   This protects live content. Use Admin → Settings → Sync (merge) instead."
      else
        echo "🌱 RUN_SEED_ON_STARTUP=true. Running data seeding..."
        SEED_OUTPUT=$(npx prisma db seed 2>&1)
        if [ $? -eq 0 ]; then
          echo "✅ Seeding completed."
          echo "$SEED_OUTPUT"
        else
          echo "⚠️ SEEDING RETURNED AN ERROR:"
          echo "$SEED_OUTPUT"
          echo "Continuing to start app anyway..."
        fi
      fi
    else
      echo "ℹ️ Skipping seed on startup (preserves production content). Use Admin → Settings → Database to seed manually."
    fi
  else
    echo "❌ MIGRATION FAILED!"
    echo "If this is a production environment, check your database logs."
    echo "Starting app anyway as a last resort, but it may crash due to schema mismatch."
  fi
else
  echo "ℹ️ DATABASE_URL not set, skipping migrations and seeding."
fi

# ---------------------------------------------------------------------------
# Uploads persistence
# Prefer a dedicated volume at /data/uploads (set UPLOADS_DIR=/data/uploads in Coolify).
# Also accepts a direct mount at /app/public/uploads.
# Without a volume, every Coolify redeploy wipes article/event images (DB URLs stay, files gone).
# ---------------------------------------------------------------------------
UPLOADS_PATH="${UPLOADS_DIR:-/app/public/uploads}"
mkdir -p "$UPLOADS_PATH"

# If storing outside public/, symlink so /uploads URLs and static serving still work
if [ "$UPLOADS_PATH" != "/app/public/uploads" ]; then
  mkdir -p /app/public "$UPLOADS_PATH"
  if mountpoint -q /app/public/uploads 2>/dev/null; then
    echo "📁 /app/public/uploads is already a mount point — using it (ignore UPLOADS_DIR=$UPLOADS_PATH for filesystem)."
    UPLOADS_PATH="/app/public/uploads"
  else
    # Copy any existing ephemeral uploads into the persistent volume before replacing
    if [ -d /app/public/uploads ] && [ ! -L /app/public/uploads ]; then
      echo "📁 Migrating existing uploads into $UPLOADS_PATH..."
      cp -a /app/public/uploads/. "$UPLOADS_PATH"/ 2>/dev/null || true
      rm -rf /app/public/uploads
    fi
    ln -sfn "$UPLOADS_PATH" /app/public/uploads
    echo "📁 Linked /app/public/uploads → $UPLOADS_PATH"
  fi
fi

# Ensure writable by nextjs
chown -R nextjs:nodejs "$UPLOADS_PATH" 2>/dev/null || true
if [ -L /app/public/uploads ]; then
  chown -h nextjs:nodejs /app/public/uploads 2>/dev/null || true
fi

is_mounted=0
if mountpoint -q "$UPLOADS_PATH" 2>/dev/null; then
  is_mounted=1
elif mountpoint -q /app/public/uploads 2>/dev/null; then
  is_mounted=1
elif grep -q " $UPLOADS_PATH " /proc/mounts 2>/dev/null; then
  is_mounted=1
elif grep -q " /app/public/uploads " /proc/mounts 2>/dev/null; then
  is_mounted=1
elif grep -q " /data/uploads " /proc/mounts 2>/dev/null; then
  is_mounted=1
fi

if [ "$is_mounted" -eq 1 ]; then
  echo "✅ Uploads are on a Docker volume mount — files will survive redeploys."
  echo "   Path: $UPLOADS_PATH"
else
  echo "⚠️⚠️⚠️ CRITICAL: Uploads are NOT on a persistent volume."
  echo "   New images work until the next Coolify redeploy, then return 404."
  echo "   Database keeps the image URLs; only the files on disk are deleted."
  echo ""
  echo "   Fix in Coolify → your app → Storage:"
  echo "     Source (name): egp-uploads"
  echo "     Destination:   /data/uploads"
  echo "   Then set env: UPLOADS_DIR=/data/uploads"
  echo "   Redeploy once after adding the volume (existing broken images must be re-uploaded)."
fi

file_count=$(find "$UPLOADS_PATH" -type f 2>/dev/null | wc -l | tr -d ' ')
echo "📁 Upload files currently on disk: ${file_count:-0}"

# Start the application (drop to nextjs user for security)
echo "🌐 Starting application on PORT ${PORT:-3000}..."
if [ ! -f "server.js" ]; then
  echo "❌ server.js NOT FOUND!"
  echo "Directory listing:"
  ls -la
  exit 1
fi

echo "📦 server.js found. Starting node server.js..."
su-exec nextjs node server.js &
APP_PID=$!

# Wait until the app accepts HTTP (max ~90s)
echo "⏳ Waiting for app health..."
ready=0
i=0
while [ "$i" -lt 45 ]; do
  if curl -sf "http://127.0.0.1:${PORT:-3000}/api/auth/session" >/dev/null 2>&1; then
    ready=1
    break
  fi
  # App may have crashed
  if ! kill -0 "$APP_PID" 2>/dev/null; then
    echo "❌ Application exited before becoming healthy."
    wait "$APP_PID"
    exit $?
  fi
  i=$((i + 1))
  sleep 2
done

if [ "$ready" -ne 1 ]; then
  echo "⚠️ App did not become healthy in time; skipping startup data sync."
else
  echo "✅ App is healthy."
  # Optional: refresh BoG / Mid-Year / WB indicators after each deploy
  # Set RUN_SYNC_ON_STARTUP=true and CRON_SECRET in Coolify.
  if [ "$RUN_SYNC_ON_STARTUP" = "true" ] && [ -n "$CRON_SECRET" ]; then
    echo "🔄 Running indicator data sync (RUN_SYNC_ON_STARTUP=true)..."
    SYNC_CODE=$(curl -sS -o /tmp/data-sync-startup.json -w "%{http_code}" \
      -X POST "http://127.0.0.1:${PORT:-3000}/api/admin/data-sync" \
      -H "Authorization: Bearer ${CRON_SECRET}" \
      -H "Content-Type: application/json" \
      -d '{"source":"all"}' || echo "000")
    if [ "$SYNC_CODE" = "200" ]; then
      echo "✅ Startup data sync OK (HTTP 200). Summary:"
      head -c 800 /tmp/data-sync-startup.json 2>/dev/null || true
      echo ""
    else
      echo "⚠️ Startup data sync returned HTTP ${SYNC_CODE} (app still running)."
      head -c 400 /tmp/data-sync-startup.json 2>/dev/null || true
      echo ""
    fi
  else
    echo "ℹ️ Skipping startup data sync (set RUN_SYNC_ON_STARTUP=true + CRON_SECRET to enable)."
  fi
fi

wait "$APP_PID"
exit $?
