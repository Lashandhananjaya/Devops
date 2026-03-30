#!/bin/bash
set -e

DOCKER_USER=$1
DOCKER_PASS=$2
DOCKER_REPO=${DOCKER_REPO:-lashan123}

if [ -z "$DOCKER_USER" ] || [ -z "$DOCKER_PASS" ]; then
  echo "❌ Error: Docker credentials not provided"
  echo "Usage: ./push.sh <docker_user> <docker_pass>"
  exit 1
fi

echo "🔑 Logging in to Docker Hub..."
echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

echo "📤 Pushing Docker images to Docker Hub..."
echo "Using Docker repo: $DOCKER_REPO"

# Push backend image
echo "Pushing backend image..."
docker push $DOCKER_REPO/royal-stay-backend:latest

# Push frontend image
echo "Pushing frontend image..."
docker push $DOCKER_REPO/royal-stay-frontend:latest

echo "✅ Docker images pushed successfully!"
