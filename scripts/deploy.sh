#!/bin/bash
set -e

DOCKER_REPO=${DOCKER_REPO:-lashan123}

echo "🚀 Starting deployment on EC2..."
echo "Docker repo: $DOCKER_REPO"

# Check if user is in docker group, if not use sudo
if ! docker ps &> /dev/null; then
  DOCKER_CMD="sudo docker"
  DOCKER_COMPOSE_CMD="sudo docker-compose"
else
  DOCKER_CMD="docker"
  DOCKER_COMPOSE_CMD="docker-compose"
fi

# Pull the latest images
echo "📥 Pulling Docker images..."
$DOCKER_CMD pull $DOCKER_REPO/royal-stay-backend:latest
$DOCKER_CMD pull $DOCKER_REPO/royal-stay-frontend:latest

# Navigate to project directory
cd /home/ec2-user/app || mkdir -p /home/ec2-user/app && cd /home/ec2-user/app

# Stop existing containers
echo "🛑 Stopping existing containers..."
$DOCKER_COMPOSE_CMD down || true

# Start new containers
echo "▶️  Starting new containers..."
$DOCKER_COMPOSE_CMD up -d

echo "✅ Deployment completed successfully!"
echo "Backend running at: http://localhost:8080"
echo "Frontend running at: http://localhost:3000"
