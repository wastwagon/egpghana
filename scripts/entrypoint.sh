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
    
    # Only run seed if RUN_SEED_ON_STARTUP=true (e.g. fresh DB setup).
    # Default: skip seed on deploy to preserve content added via admin UI on production.
    # Use Admin Settings → Database tab to run seed manually when needed.
    if [ "$RUN_SEED_ON_STARTUP" = "true" ]; then
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
if [ -f "server.js" ]; then
  echo "📦 server.js found. Executing node server.js..."
  exec su-exec nextjs node server.js
else
  echo "❌ server.js NOT FOUND!"
  echo "Directory listing:"
  ls -la
  exit 1
fi
