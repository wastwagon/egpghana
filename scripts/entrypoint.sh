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

# Ensure uploads directory is writable by nextjs (fixes volume mount permissions)
if [ -d "public/uploads" ]; then
  echo "📁 Ensuring uploads directory is writable..."
  chown -R nextjs:nodejs public/uploads 2>/dev/null || true
fi

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
