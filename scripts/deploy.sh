#!/bin/bash
set -e

DOCKER_REPO=${DOCKER_REPO:-lashan123}

echo "🚀 Starting deployment on EC2..."
echo "Docker repo: $DOCKER_REPO"

# Pull the latest images
echo "📥 Pulling Docker images..."
docker pull $DOCKER_REPO/royal-stay-backend:latest
docker pull $DOCKER_REPO/royal-stay-frontend:latest

# Navigate to project directory
cd /home/ec2-user/app || mkdir -p /home/ec2-user/app && cd /home/ec2-user/app

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Start new containers
echo "▶️  Starting new containers..."
docker-compose up -d

echo "✅ Deployment completed successfully!"
echo "Backend running at: http://localhost:8080"
echo "Frontend running at: http://localhost:3000"
