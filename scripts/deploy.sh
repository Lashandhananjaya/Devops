#!/bin/bash
set -e

DOCKER_REPO=${DOCKER_REPO:-lashan123}
APP_DIR="${HOME}/app"

echo "🚀 Starting deployment on EC2..."
echo "Docker repo: $DOCKER_REPO"

detect_compose() {
	if command -v docker-compose >/dev/null 2>&1; then
		echo "docker-compose"
		return 0
	fi
	if docker compose version >/dev/null 2>&1; then
		echo "docker compose"
		return 0
	fi
	return 1
}

install_compose() {
	echo "⚙️  Docker Compose not found. Attempting automatic installation..."

	if command -v apt-get >/dev/null 2>&1; then
		sudo apt-get update -y || true
		sudo apt-get install -y docker-compose-plugin || true
	elif command -v dnf >/dev/null 2>&1; then
		sudo dnf install -y docker-compose-plugin || true
	elif command -v yum >/dev/null 2>&1; then
		sudo yum install -y docker-compose-plugin || true
	fi

	# Fallback: install standalone docker-compose binary
	if ! detect_compose >/dev/null 2>&1; then
		sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
		sudo chmod +x /usr/local/bin/docker-compose
	fi
}

COMPOSE_CMD="$(detect_compose || true)"
if [ -z "$COMPOSE_CMD" ]; then
	install_compose
	COMPOSE_CMD="$(detect_compose || true)"
fi

if [ -z "$COMPOSE_CMD" ]; then
	echo "❌ Failed to install Docker Compose automatically"
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
