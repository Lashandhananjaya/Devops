#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Royal Stay Hotels - EC2 Setup ===${NC}"
echo ""

# Check if running on EC2
if ! grep -q ec2 /sys/hypervisor/uuid 2>/dev/null; then
    echo "Note: Not running on EC2 (this is expected if running locally)"
fi

# Update system
echo -e "${BLUE}[1/5] Updating system packages...${NC}"
sudo yum update -y > /dev/null 2>&1

# Install Docker
echo -e "${BLUE}[2/5] Installing Docker...${NC}"
sudo yum install docker -y > /dev/null 2>&1

# Install Docker Compose
echo -e "${BLUE}[3/5] Installing Docker Compose...${NC}"
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose > /dev/null 2>&1
sudo chmod +x /usr/local/bin/docker-compose

# Start Docker
echo -e "${BLUE}[4/5] Starting Docker service...${NC}"
sudo systemctl start docker
sudo systemctl enable docker

# Add ec2-user to docker group
echo -e "${BLUE}[5/5] Configuring Docker permissions...${NC}"
sudo usermod -aG docker ec2-user

echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Docker version:"
docker --version
echo ""
echo "Docker Compose version:"
docker-compose --version
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Exit and reconnect to apply group changes"
echo "2. Clone your repository or transfer docker-compose.yml"
echo "3. Run: docker-compose up -d"
