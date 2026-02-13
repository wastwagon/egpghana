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
    
    echo "🌱 Running data seeding (npx prisma db seed)..."
    # We don't want a seed failure to block the whole app if migrations passed
    if npx prisma db seed; then
      echo "✅ Seeding completed."
    else
      echo "⚠️ SEEDING RETURNED AN ERROR. Continuing to start app anyway..."
    fi
  else
    echo "❌ MIGRATION FAILED!"
    echo "If this is a production environment, check your database logs."
    echo "Starting app anyway as a last resort, but it may crash due to schema mismatch."
  fi
else
  echo "ℹ️ DATABASE_URL not set, skipping migrations and seeding."
fi

# Start the application
echo "🌐 Starting application on PORT ${PORT:-3000}..."
if [ -f "server.js" ]; then
  echo "📦 server.js found. Executing node server.js..."
  exec node server.js
else
  echo "❌ server.js NOT FOUND!"
  echo "Directory listing:"
  ls -la
  exit 1
fi
