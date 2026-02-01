#!/bin/bash
set -e

echo "🔨 Building Docker images..."

# Check if user is in docker group, if not use sudo
if ! docker ps &> /dev/null; then
  DOCKER_CMD="sudo docker"
else
  DOCKER_CMD="docker"
fi

# Build backend image
echo "Building backend image..."
$DOCKER_CMD build -t lashan123/royal-stay-backend:latest ./backend

# Build frontend image
echo "Building frontend image..."
$DOCKER_CMD build -t lashan123/royal-stay-frontend:latest ./frontend

echo "✅ Docker images built successfully!"
