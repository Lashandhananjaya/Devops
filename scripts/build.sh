#!/bin/bash
set -e

echo "🔨 Building Docker images..."

# Build backend image
echo "Building backend image..."
docker build -t lashan123/royal-stay-backend:latest ./backend

# Build frontend image
echo "Building frontend image..."
docker build -t lashan123/royal-stay-frontend:latest ./frontend

echo "✅ Docker images built successfully!"
