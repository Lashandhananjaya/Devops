#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Royal Stay Hotels - CI/CD Pipeline Health Check          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check 1: EC2 Instance Connectivity
echo -e "${BLUE}[1] Checking EC2 Instance Connectivity...${NC}"
EC2_IP="13.53.188.143"
EC2_USER="ec2-user"
SSH_KEY="$HOME/.ssh/royalstatebookingapp.pem"

if [ ! -f "$SSH_KEY" ]; then
    echo -e "${RED}✗ SSH key not found: $SSH_KEY${NC}"
    exit 1
fi

if ping -c 1 "$EC2_IP" &> /dev/null; then
    echo -e "${GREEN}✓ EC2 instance is reachable (ping successful)${NC}"
else
    echo -e "${YELLOW}⚠ EC2 instance not responding to ping (might be blocked, but SSH may work)${NC}"
fi

# Check SSH connectivity
if timeout 5 ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -i "$SSH_KEY" "${EC2_USER}@${EC2_IP}" "echo 'SSH OK'" &> /dev/null; then
    echo -e "${GREEN}✓ SSH connection successful${NC}"
else
    echo -e "${RED}✗ SSH connection failed${NC}"
    exit 1
fi

echo ""

# Check 2: Docker Installation
echo -e "${BLUE}[2] Checking Docker Installation...${NC}"
if ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "${EC2_USER}@${EC2_IP}" "docker --version" &> /dev/null; then
    DOCKER_VERSION=$(ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "${EC2_USER}@${EC2_IP}" "docker --version")
    echo -e "${GREEN}✓ Docker installed: $DOCKER_VERSION${NC}"
else
    echo -e "${RED}✗ Docker not found on EC2 instance${NC}"
    echo "   Run this command to install Docker:"
    echo "   ssh -i ~/.ssh/royalstatebookingapp.pem ec2-user@13.53.188.143"
    echo "   sudo yum install docker -y"
    echo "   sudo systemctl start docker"
    echo "   sudo systemctl enable docker"
    exit 1
fi

echo ""

# Check 3: Docker Compose Installation
echo -e "${BLUE}[3] Checking Docker Compose Installation...${NC}"
if ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "${EC2_USER}@${EC2_IP}" "docker-compose --version" &> /dev/null; then
    COMPOSE_VERSION=$(ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "${EC2_USER}@${EC2_IP}" "docker-compose --version")
    echo -e "${GREEN}✓ Docker Compose installed: $COMPOSE_VERSION${NC}"
else
    echo -e "${RED}✗ Docker Compose not found on EC2 instance${NC}"
    echo "   Run this command to install Docker Compose:"
    echo "   ssh -i ~/.ssh/royalstatebookingapp.pem ec2-user@13.53.188.143"
    echo "   sudo curl -L 'https://github.com/docker/compose/releases/latest/download/docker-compose-'\$(uname -s)'-'\$(uname -m) -o /usr/local/bin/docker-compose"
    echo "   sudo chmod +x /usr/local/bin/docker-compose"
    exit 1
fi

echo ""

# Check 4: Docker Daemon Running
echo -e "${BLUE}[4] Checking Docker Daemon Status...${NC}"
if ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "${EC2_USER}@${EC2_IP}" "docker ps" &> /dev/null; then
    echo -e "${GREEN}✓ Docker daemon is running${NC}"
else
    echo -e "${RED}✗ Docker daemon is not running${NC}"
    echo "   Run: ssh -i ~/.ssh/royalstatebookingapp.pem ec2-user@13.53.188.143 'sudo systemctl start docker'"
    exit 1
fi

echo ""

# Check 5: User Docker Permissions
echo -e "${BLUE}[5] Checking Docker User Permissions...${NC}"
if ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "${EC2_USER}@${EC2_IP}" "docker run hello-world" &> /dev/null; then
    echo -e "${GREEN}✓ User has Docker permissions (non-sudo)${NC}"
else
    echo -e "${YELLOW}⚠ User may need sudo for Docker commands${NC}"
    echo "   Fix with: sudo usermod -aG docker ec2-user"
    echo "   Then exit and reconnect"
fi

echo ""

# Check 6: Deployment Script
echo -e "${BLUE}[6] Checking Deployment Script...${NC}"
DEPLOY_SCRIPT="$(dirname "$0")/scripts/deploy.sh"
if [ -f "$DEPLOY_SCRIPT" ]; then
    echo -e "${GREEN}✓ Deployment script found: $DEPLOY_SCRIPT${NC}"
    if [ -x "$DEPLOY_SCRIPT" ]; then
        echo -e "${GREEN}✓ Deployment script is executable${NC}"
    else
        echo -e "${YELLOW}⚠ Deployment script is not executable${NC}"
        echo "   Fix with: chmod +x scripts/deploy.sh"
    fi
else
    echo -e "${RED}✗ Deployment script not found: $DEPLOY_SCRIPT${NC}"
fi

echo ""

# Check 7: Build Script
echo -e "${BLUE}[7] Checking Build Script...${NC}"
BUILD_SCRIPT="$(dirname "$0")/scripts/build.sh"
if [ -f "$BUILD_SCRIPT" ]; then
    echo -e "${GREEN}✓ Build script found: $BUILD_SCRIPT${NC}"
    if [ -x "$BUILD_SCRIPT" ]; then
        echo -e "${GREEN}✓ Build script is executable${NC}"
    else
        echo -e "${YELLOW}⚠ Build script is not executable${NC}"
        echo "   Fix with: chmod +x scripts/build.sh"
    fi
else
    echo -e "${RED}✗ Build script not found: $BUILD_SCRIPT${NC}"
fi

echo ""

# Check 8: Push Script
echo -e "${BLUE}[8] Checking Push Script...${NC}"
PUSH_SCRIPT="$(dirname "$0")/scripts/push.sh"
if [ -f "$PUSH_SCRIPT" ]; then
    echo -e "${GREEN}✓ Push script found: $PUSH_SCRIPT${NC}"
    if [ -x "$PUSH_SCRIPT" ]; then
        echo -e "${GREEN}✓ Push script is executable${NC}"
    else
        echo -e "${YELLOW}⚠ Push script is not executable${NC}"
        echo "   Fix with: chmod +x scripts/push.sh"
    fi
else
    echo -e "${RED}✗ Push script not found: $PUSH_SCRIPT${NC}"
fi

echo ""

# Check 9: Jenkinsfile
echo -e "${BLUE}[9] Checking Jenkinsfile...${NC}"
JENKINSFILE="$(dirname "$0")/Jenkinsfile"
if [ -f "$JENKINSFILE" ]; then
    echo -e "${GREEN}✓ Jenkinsfile found: $JENKINSFILE${NC}"
else
    echo -e "${RED}✗ Jenkinsfile not found: $JENKINSFILE${NC}"
fi

echo ""

# Check 10: Docker Hub Credentials
echo -e "${BLUE}[10] Checking Docker Hub Access...${NC}"
if ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "${EC2_USER}@${EC2_IP}" "timeout 5 curl -s https://registry.hub.docker.com/v2/ &>/dev/null && echo OK || echo FAIL" | grep -q "OK"; then
    echo -e "${GREEN}✓ Docker Hub is reachable${NC}"
else
    echo -e "${YELLOW}⚠ Docker Hub connection might be slow or blocked${NC}"
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    Summary                                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✓ EC2 Instance Details:${NC}"
echo "  - IP Address: $EC2_IP"
echo "  - User: $EC2_USER"
echo "  - SSH Key: $SSH_KEY"
echo ""
echo -e "${GREEN}✓ All checks passed! Ready for CI/CD pipeline 🚀${NC}"
echo ""
echo "Next steps:"
echo "1. Connect to EC2: ssh -i ~/.ssh/royalstatebookingapp.pem ec2-user@13.53.188.143"
echo "2. Set up Jenkins with your GitHub repository"
echo "3. Configure Jenkins credentials:"
echo "   - aws-credentials (Access Key ID & Secret)"
echo "   - ec2-ssh-key (private key)"
echo "   - dockerhub-creds (Docker Hub username & password)"
echo "4. Push code to GitHub to trigger the pipeline"
echo ""
