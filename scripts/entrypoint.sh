#!/bin/sh

# Set error handling
set -e

echo "Starting deployment scripts..."

# Run migrations if DATABASE_URL is present
if [ -n "$DATABASE_URL" ]; then
  echo "Applying database migrations..."
  npx prisma migrate deploy
  
  echo "Seeding/Updating essential data..."
  npx prisma db seed
else
  echo "DATABASE_URL not set, skipping migrations and seeding."
fi

# Start the application
echo "Starting application with node server.js..."
exec node server.js
