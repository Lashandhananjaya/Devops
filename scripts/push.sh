#!/bin/bash
set -e

DOCKER_USER=$1
DOCKER_PASS=$2

if [ -z "$DOCKER_USER" ] || [ -z "$DOCKER_PASS" ]; then
  echo "❌ Error: Docker credentials not provided"
  echo "Usage: ./push.sh <docker_user> <docker_pass>"
  exit 1
fi

# Check if user is in docker group, if not use sudo
if ! docker ps &> /dev/null; then
  DOCKER_CMD="sudo docker"
else
  DOCKER_CMD="docker"
fi

echo "🔑 Logging in to Docker Hub..."
echo "$DOCKER_PASS" | $DOCKER_CMD login -u "$DOCKER_USER" --password-stdin

echo "📤 Pushing Docker images to Docker Hub..."

# Push backend image
echo "Pushing backend image..."
$DOCKER_CMD push lashan123/royal-stay-backend:latest

# Push frontend image
echo "Pushing frontend image..."
$DOCKER_CMD push lashan123/royal-stay-frontend:latest

echo "✅ Docker images pushed successfully!"
