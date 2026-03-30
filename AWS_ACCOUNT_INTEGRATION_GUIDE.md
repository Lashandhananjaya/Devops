# AWS Account Integration Guide - New AWS Account Setup

## 📋 Overview
This guide provides step-by-step instructions to integrate your new AWS account into the Royal Stay Hotels DevOps pipeline. You have:
- **App Instance IP:** `13.53.188.143` (for running the application)
- **Jenkins Instance:** (to be set up later)
- **Region:** `eu-north-1` (Stockholm - based on IP range 13.53.x.x)

---

## 🔧 Prerequisites Before Starting

### 1. Verify EC2 Instances
```bash
# On AWS Console:
# - Go to EC2 Dashboard
# - Verify both instances are in "running" state
# - Note down:
#   - Instance IDs
#   - Security group names
#   - Availability zones
```

### 2. Verify Security Groups
Ensure the **app instance** security group has these inbound rules:
```
- SSH (22): From your Jenkins IP or 0.0.0.0/0
- HTTP (80): From 0.0.0.0/0
- HTTPS (443): From 0.0.0.0/0
- Custom TCP (5000): From 0.0.0.0/0 (Backend API)
- Custom TCP (3000): From 0.0.0.0/0 (Frontend dev)
```

### 3. Create/Download EC2 Key Pair
```bash
# AWS Console: EC2 > Key Pairs > Create Key Pair (if not exists)
# Download the .pem file and save it securely
# Set permissions: chmod 400 your-key.pem
```

---

## 📝 Step 1: Update Terraform Configuration

### Update Region in Terraform

**File:** [terraform/variables.tf](terraform/variables.tf)

Change the default region from `ap-south-1` to `eu-north-1`:

```hcl
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-north-1"  # ← Change from ap-south-1
}
```

**File:** [terraform/main.tf](terraform/main.tf)

Update the availability zones to match `eu-north-1`:

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"

  name = "room-booking-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["eu-north-1a", "eu-north-1b"]  # ← Update to eu-north-1 AZs
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Project = "Room Booking System for Hotel"
  }
}
```

---

## 🔐 Step 2: Configure AWS Credentials in Jenkins

### Add AWS Credentials to Jenkins

1. **Log into Jenkins Dashboard:**
   - URL: `http://your-jenkins-ip:8080`
   - Navigate to: **Dashboard → Manage Credentials → System → Global credentials**

2. **Add AWS Access Key Credentials:**
   - Click **"Add Credentials"**
   - Fill in the form:
     ```
     Kind: Username and password
     Username: <Your AWS Access Key ID>
     Password: <Your AWS Secret Access Key>
     ID: aws-credentials
     Description: AWS Account - New Account
     ```
   - Click **Create**

3. **Add EC2 SSH Key Credentials:**
   - Click **"Add Credentials"**
   - Fill in the form:
     ```
     Kind: SSH Username with private key
     Username: ec2-user (or ubuntu, depending on AMI)
     Private Key: (Paste contents of your .pem file)
     ID: ec2-ssh-key
     Description: EC2 SSH Key - New Account
     ```
   - Click **Create**

### Verify Credentials
```bash
# Test AWS CLI access (from Jenkins server)
aws ec2 describe-instances --region eu-north-1 --query 'Reservations[*].Instances[*].InstanceId'

# Test SSH access to app instance
ssh -i /path/to/key.pem ec2-user@13.53.188.143 "echo 'SSH Connection Successful'"
```

---

## 🚀 Step 3: Update Jenkins Pipeline Configuration

### Update Jenkinsfile Parameters

**File:** [Jenkinsfile](Jenkinsfile)

Modify the pipeline parameters section to use your new AWS account:

```groovy
parameters {
    string(name: 'AWS_REGION', defaultValue: 'eu-north-1', description: 'AWS region for Terraform')
    string(name: 'KEY_PAIR_NAME', defaultValue: 'your-new-key-pair-name', description: 'AWS EC2 key pair name')
    text(name: 'SSH_PUBLIC_KEY', defaultValue: '', description: 'SSH public key material for EC2 access')
    string(name: 'ALLOWED_SSH_CIDR', defaultValue: '0.0.0.0/0', description: 'CIDR allowed for SSH')
    string(name: 'ALLOWED_HTTP_CIDR', defaultValue: '0.0.0.0/0', description: 'CIDR allowed for app ports')
    booleanParam(name: 'TERRAFORM_APPLY', defaultValue: true, description: 'Apply Terraform changes')
}
```

### Environment Variables Configuration

Create a file: [.env.production](.env.production)

```bash
# AWS Configuration
AWS_REGION=eu-north-1
AWS_ACCOUNT_ID=<Your-AWS-Account-ID>
EC2_INSTANCE_IP=13.53.188.143
EC2_USER=ec2-user  # or ubuntu/admin based on your AMI

# Application Configuration
APP_ENV=production
BACKEND_PORT=5000
FRONTEND_PORT=3000

# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/royal-stay-hotels

# Docker Configuration
DOCKER_REPO=lashan123
```

---

## 🔑 Step 4: Configure Application for AWS Deployment

### Update Backend Environment Variables

**File:** [backend/server.js](backend/server.js)

Ensure environment variables are properly configured:

```javascript
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/royal-stay-hotels';
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
```

### Update Frontend API Configuration

**File:** [frontend/src/services/api.js](frontend/src/services/api.js)

```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

// In production, set VITE_API_URL to your app instance public IP
// Example: http://13.53.188.143:5000/api
```

### Create Production Vite Config

**File:** [frontend/vite.config.production.js](frontend/vite.config.production.js)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

---

## 🐳 Step 5: Prepare App Instance (13.53.188.143)

### SSH into the App Instance

```bash
ssh -i /path/to/key.pem ec2-user@13.53.188.143
```

### Install Required Software

```bash
#!/bin/bash
# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo usermod -aG docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js (optional for direct deployment)
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install MongoDB CLI tools (optional)
sudo yum install -y mongodb-org-shell

# Verify installations
docker --version
docker-compose --version
node --version
```

### Create Application Directory

```bash
# Create app directory
sudo mkdir -p /opt/royal-stay-hotels
sudo chown ec2-user:ec2-user /opt/royal-stay-hotels
cd /opt/royal-stay-hotels

# Clone repository (or Jenkins will do this)
git clone https://github.com/Lashandhananjaya/Devops.git .
```

---

## 📤 Step 6: Update Deployment Scripts

### Update Deploy Script

**File:** [scripts/deploy.sh](scripts/deploy.sh)

```bash
#!/bin/bash
set -e

DOCKER_REPO=${DOCKER_REPO:-lashan123}
BACKEND_IMAGE="${DOCKER_REPO}/backend:latest"
FRONTEND_IMAGE="${DOCKER_REPO}/frontend:latest"

echo "Deploying Royal Stay Hotels Application..."

# Navigate to app directory
cd /opt/royal-stay-hotels

# Pull latest images
docker pull $BACKEND_IMAGE
docker pull $FRONTEND_IMAGE

# Create docker-compose.prod.yml
cat > docker-compose.prod.yml <<EOF
version: '3.8'

services:
  backend:
    image: $BACKEND_IMAGE
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - NODE_ENV=production
      - MONGO_URI=\${MONGO_URI}
    restart: always
    networks:
      - app-network

  frontend:
    image: $FRONTEND_IMAGE
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
EOF

# Stop old containers
docker-compose -f docker-compose.prod.yml down || true

# Start new containers
docker-compose -f docker-compose.prod.yml up -d

echo "Deployment completed successfully!"
docker ps
```

### Update Build Script

**File:** [scripts/build.sh](scripts/build.sh)

```bash
#!/bin/bash
set -e

echo "Building Docker images..."

# Build backend
docker build -t lashan123/backend:latest ./backend

# Build frontend with production optimizations
docker build -t lashan123/frontend:latest ./frontend

echo "Build completed successfully!"
docker images | grep -E "(backend|frontend)"
```

---

## 🔄 Step 7: Jenkins Pipeline Execution

### Configure Jenkins Job

1. **Create or Update Jenkins Job:**
   - Dashboard → New Item → Pipeline
   - Name: `Royal-Stay-Hotels-Deploy`
   - Pipeline script from SCM:
     ```
     Repository URL: https://github.com/Lashandhananjaya/Devops.git
     Branch: */main
     Script Path: Jenkinsfile
     ```

2. **Configure Build Triggers:**
   - Check: "GitHub hook trigger for GITScm polling"
   - This requires webhook setup in GitHub

3. **Configure Parameters:**
   - AWS_REGION: `eu-north-1`
   - KEY_PAIR_NAME: `your-key-pair-name`
   - ALLOWED_SSH_CIDR: `0.0.0.0/0` (or restrict to your IP)
   - TERRAFORM_APPLY: `true` (on first run)

### Run the Pipeline

```bash
# Option 1: Manual trigger in Jenkins UI
# Dashboard → Royal-Stay-Hotels-Deploy → Build Now

# Option 2: Push to main branch (if webhook configured)
git push origin main
```

### Monitor Pipeline Execution

```bash
# View logs in Jenkins UI
# Dashboard → Royal-Stay-Hotels-Deploy → Build #<number> → Console Output

# Expected output:
# ✓ Checkout Code
# ✓ Build Docker Images
# ✓ Push Docker Images
# ✓ Provision Infrastructure (Terraform)
# ✓ Deploy to EC2
```

---

## ✅ Step 8: Post-Deployment Verification

### Verify Application is Running

```bash
# SSH into app instance
ssh -i /path/to/key.pem ec2-user@13.53.188.143

# Check running containers
docker ps

# Expected output:
# CONTAINER ID   IMAGE                    PORTS                    STATUS
# xxxxx          lashan123/frontend       0.0.0.0:80->80/tcp       Up 2 minutes
# xxxxx          lashan123/backend        0.0.0.0:5000->5000/tcp   Up 2 minutes
```

### Test API Endpoints

```bash
# Test backend API
curl http://13.53.188.143:5000/api/rooms

# Expected response: JSON array of rooms
# [{"id": 1, "name": "Deluxe Room", ...}, ...]

# Test frontend (HTTPS)
curl https://13.53.188.143
# Should return HTML content
```

### Access the Application

```
Frontend:    http://13.53.188.143 or https://13.53.188.143
Backend API: http://13.53.188.143:5000/api
```

### Check Container Logs

```bash
ssh -i /path/to/key.pem ec2-user@13.53.188.143

# Backend logs
docker logs $(docker ps -q -f ancestor=lashan123/backend)

# Frontend logs
docker logs $(docker ps -q -f ancestor=lashan123/frontend)

# MongoDB logs (if applicable)
docker logs mongo
```

---

## 🐛 Troubleshooting

### Issue: Jenkins can't connect to AWS
**Solution:**
```bash
# Verify AWS credentials in Jenkins
# Manage Credentials → Check aws-credentials exists
# Test: aws ec2 describe-instances --region eu-north-1
```

### Issue: SSH connection fails to app instance
**Solution:**
```bash
# Check security group allows SSH from Jenkins IP
# Verify .pem file permissions: chmod 400 key.pem
# Test: ssh -i key.pem ec2-user@13.53.188.143 "uptime"
```

### Issue: Docker images don't pull on EC2
**Solution:**
```bash
# SSH into instance
ssh -i key.pem ec2-user@13.53.188.143

# Login to Docker Hub
docker login -u lashan123

# Manually pull images
docker pull lashan123/backend:latest
docker pull lashan123/frontend:latest
```

### Issue: Application can't reach MongoDB
**Solution:**
```bash
# Verify MONGO_URI environment variable is set correctly
# For MongoDB Atlas:
# mongodb+srv://username:password@cluster.mongodb.net/royal-stay-hotels?retryWrites=true&w=majority

# Test connection from instance:
docker exec -it <backend-container-id> curl http://localhost:5000/api/rooms
```

### Issue: Port conflicts (80, 443, 5000)
**Solution:**
```bash
# Check what's listening on port 80
sudo netstat -tlnp | grep :80

# Kill existing process if needed
sudo kill -9 <PID>

# Or change ports in docker-compose.prod.yml
```

---

## 🔒 Security Best Practices

### 1. Restrict Security Group Rules
Instead of `0.0.0.0/0`, restrict to specific IPs:
```bash
# SSH: Only from Jenkins IP
# HTTP/HTTPS: From load balancer or your office IP
# Backend: From frontend container only
```

### 2. Use AWS Secrets Manager
Store sensitive data in AWS Secrets Manager instead of environment variables:
```bash
aws secretsmanager create-secret \
  --name royal-stay/mongodb-uri \
  --secret-string "mongodb+srv://user:pass@cluster.mongodb.net/db"
```

### 3. Enable VPC Flow Logs
Monitor network traffic to instances:
```bash
# AWS Console → VPC → Flow Logs → Create
```

### 4. Use IAM Roles
Instead of access keys, use IAM roles for EC2 instances:
```bash
# EC2 Instance → IAM Role → Select role with necessary permissions
# Permissions: EC2FullAccess, ECRReadOnly, CloudWatchLogsFullAccess
```

---

## 📊 Monitoring and Logging

### Enable CloudWatch Logs

```bash
# SSH into instance
ssh -i key.pem ec2-user@13.53.188.143

# Install CloudWatch Agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm

# Configure logs to stream to CloudWatch
# Edit: /opt/aws/amazon-cloudwatch-agent/etc/config.json
```

### Monitor Container Metrics

```bash
# View CPU/Memory usage
docker stats

# Set up Prometheus + Grafana for advanced monitoring
# (Optional, out of scope for this guide)
```

---

## 📌 Summary Checklist

- [ ] Updated Terraform region to `eu-north-1`
- [ ] Updated availability zones in `terraform/main.tf`
- [ ] Added AWS credentials to Jenkins (aws-credentials)
- [ ] Added EC2 SSH key to Jenkins (ec2-ssh-key)
- [ ] Updated Jenkinsfile parameters
- [ ] Created `.env.production` file
- [ ] Installed Docker, Docker Compose on app instance
- [ ] Updated deploy.sh script
- [ ] Updated build.sh script
- [ ] Tested API endpoints
- [ ] Verified application is running on 13.53.188.143
- [ ] Set up security group rules
- [ ] Enabled CloudWatch logging (optional)
- [ ] Set up monitoring (optional)

---

## 📞 Next Steps

### For Jenkins Instance Setup (Later):
When ready to set up Jenkins on the second instance:
1. Follow [JENKINS_DOCKER_SETUP.md](JENKINS_DOCKER_SETUP.md)
2. Configure Jenkins with Docker socket access
3. Set up GitHub webhook integration
4. Create production pipeline

### For Database Setup:
- For MongoDB local: Use [setup-mongodb.ps1](setup-mongodb.ps1)
- For MongoDB Atlas: Follow [MONGODB_ATLAS_SETUP.txt](MONGODB_ATLAS_SETUP.txt)

### For Kubernetes Deployment (Future):
- Use Terraform EKS configuration in `terraform/main.tf`
- Deploy using kubectl or Helm charts
- Configure ingress controller for routing

---

## 📚 Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Jenkins Kubernetes Plugin](https://plugins.jenkins.io/kubernetes/)
- [Docker Container Documentation](https://docs.docker.com/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [MongoDB Atlas Documentation](https://docs.mongodb.com/atlas/)
