#!/bin/sh

# Set error handling (manually managed for migrations)
echo "Starting deployment scripts..."

# Run migrations if DATABASE_URL is present
if [ -n "$DATABASE_URL" ]; then
  echo "Applying database migrations..."
  if npx prisma migrate deploy; then
    echo "✅ Migrations applied successfully."
    
    echo "Seeding/Updating essential data..."
    npx prisma db seed
    
    # Start the application
    echo "Starting application with node server.js..."
    exec node server.js
  else
    echo "❌ MIGRATION FAILED!"
    echo "The container will stay alive for 10 minutes to allow for manual resolution (prisma migrate resolve)."
    echo "Please resolve the failed migration manually via docker exec."
    # Sleep to keep the container up for debugging/fixing
    sleep 600
    exit 1
  fi
else
  echo "DATABASE_URL not set, skipping migrations and seeding."
  echo "Starting application with node server.js..."
  exec node server.js
fi
