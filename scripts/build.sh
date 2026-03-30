#!/bin/bash
set -e

DOCKER_REPO=${DOCKER_REPO:-lashan123}

echo "🔨 Building Docker images..."
echo "Using Docker repo: $DOCKER_REPO"

# Build backend image
echo "Building backend image..."
docker build -t $DOCKER_REPO/royal-stay-backend:latest ./backend

# Build frontend image
echo "Building frontend image..."
docker build -t $DOCKER_REPO/royal-stay-frontend:latest ./frontend

echo "✅ Docker images built successfully!"
