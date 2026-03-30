#!/bin/bash
set -e

DOCKER_REPO=${DOCKER_REPO:-lashan123}
APP_DIR="${HOME}/app"

echo "🚀 Starting deployment on EC2..."
echo "Docker repo: $DOCKER_REPO"

# Detect compose command
if command -v docker-compose >/dev/null 2>&1; then
	COMPOSE_CMD="docker-compose"
elif docker compose version >/dev/null 2>&1; then
	COMPOSE_CMD="docker compose"
else
	echo "❌ Neither docker-compose nor 'docker compose' is available on this host"
	echo "Install Docker Compose plugin or docker-compose binary, then rerun deployment."
	exit 127
fi
echo "Using compose command: $COMPOSE_CMD"

# Pull the latest images
echo "📥 Pulling Docker images..."
docker pull $DOCKER_REPO/royal-stay-backend:latest
docker pull $DOCKER_REPO/royal-stay-frontend:latest

# Navigate to project directory
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# Stop existing containers
echo "🛑 Stopping existing containers..."
$COMPOSE_CMD down || true

# Start new containers
echo "▶️  Starting new containers..."
$COMPOSE_CMD up -d

echo "✅ Deployment completed successfully!"
echo "Backend running at: http://localhost:8080"
echo "Frontend running at: http://localhost:3000"
