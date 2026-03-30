# Complete AWS Account Integration - Step-by-Step Instructions

## 📋 **YOUR NEW AWS ACCOUNT DETAILS**

Before you start, gather these from your AWS account:

```
AWS Account ID:              [Get from: AWS Console → Account → Account ID]
AWS Region:                  eu-north-1 (Sweden - based on IP 13.53.188.143)
App Instance IP:             13.53.188.143
App Instance ID:             [From AWS EC2 Dashboard]
EC2 Key Pair Name:          [Name you gave when creating the key]
AWS Access Key ID:          AKIA... [Generate in IAM if not exists]
AWS Secret Access Key:      [Generate in IAM if not exists]
EC2 SSH Private Key:        [The .pem file you downloaded]
```

---

## ⚠️ **BEFORE YOU START - REQUIRED AWS SETUP**

### 1. Generate AWS Access Keys (if you don't have them)
```
AWS Console → IAM → Users → Your User → Security Credentials → Access Keys → Create Access Key
- Save the Access Key ID (starts with AKIA)
- Save the Secret Access Key (40 characters)
⚠️ IMPORTANT: You can only view the Secret once! Save it securely.
```

### 2. Create/Download EC2 Key Pair
```
AWS Console → EC2 → Key Pairs
- Download your .pem file (royal-stay-key.pem or similar)
- Set permissions: chmod 400 your-key.pem (on Mac/Linux)
- Keep this file safe - you need it for SSH access
```

### 3. Verify EC2 Instances
```
AWS Console → EC2 → Instances
Verify both instances exist:
- ✓ App Instance: 13.53.188.143 (running)
- ✓ Jenkins Instance: [Note its IP for later]
Both must be in "running" state
```

### 4. Configure Security Groups for App Instance
```
AWS Console → EC2 → Security Groups → [App Instance SG]

Inbound Rules needed:
- SSH (22):       From 0.0.0.0/0 or your Jenkins IP
- HTTP (80):      From 0.0.0.0/0
- HTTPS (443):    From 0.0.0.0/0
- Custom TCP (5000): From 0.0.0.0/0  (Backend API)
- Custom TCP (3000): From 0.0.0.0/0  (Frontend dev)

☑️ Save/Apply rules
```

---

## 🔧 **STEP 1: Update Terraform Provider Configuration**

### File 1: [terraform/provider.tf](../terraform/provider.tf)

**Current:**
```hcl
provider "aws" {
  region = "ap-south-1"
}
```

**Update to:**
```hcl
provider "aws" {
  region = "eu-north-1"
}
```

---

## 🔧 **STEP 2: Update Terraform Variables**

### File 2: [terraform/variables.tf](../terraform/variables.tf)

**Current:**
```hcl
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "ap-south-1"
}
```

**Update to:**
```hcl
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-north-1"
}
```

---

## 🔧 **STEP 3: Update Terraform Main Configuration**

### File 3: [terraform/main.tf](../terraform/main.tf)

**Current:**
```hcl
  azs             = ["ap-south-1a", "ap-south-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
```

**Update to:**
```hcl
  azs             = ["eu-north-1a", "eu-north-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
```

---

## 🔧 **STEP 4: Update Terraform Outputs**

### File 4: [terraform/output.tf](../terraform/output.tf)

**Current:**
```hcl
output "cluster_region" {
  description = "AWS region"
  value       = "ap-south-1"
}
```

**Update to:**
```hcl
output "cluster_region" {
  description = "AWS region"
  value       = "eu-north-1"
}
```

---

## 🔧 **STEP 5: Create Environment Configuration File**

### File 5: Create [.env.production](.env.production)

```bash
# AWS Configuration
AWS_REGION=eu-north-1
AWS_ACCOUNT_ID=<YOUR_ACCOUNT_ID>

# App Instance Configuration
APP_INSTANCE_IP=13.53.188.143
APP_INSTANCE_ID=<Your instance ID>
EC2_USER=ec2-user
EC2_KEY_NAME=<your-key-pair-name>

# Application Ports
BACKEND_PORT=5000
FRONTEND_PORT=3000
NGINX_PORT=80

# Database Configuration (Choose one)
# Option A: MongoDB Atlas (Cloud)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/royal-stay-hotels?retryWrites=true&w=majority

# Option B: Local MongoDB on EC2
# MONGO_URI=mongodb://admin:password@13.53.188.143:27017/royal-stay-hotels?authSource=admin

# Application URLs
BACKEND_URL=http://13.53.188.143:5000/api
FRONTEND_URL=http://13.53.188.143

# Docker Configuration
DOCKER_REPO=lashan123
DOCKER_USER=lashan123

# Environment
NODE_ENV=production
```

---

## 🔧 **STEP 6: Update Jenkinsfile Parameters**

### File 6: [Jenkinsfile](../Jenkinsfile)

**Find this section (around line 7-12):**
```groovy
parameters {
    string(name: 'AWS_REGION', defaultValue: 'us-east-1', description: 'AWS region for Terraform (infra/)')
    string(name: 'KEY_PAIR_NAME', defaultValue: 'Royal_Stay_Hotels', description: 'AWS EC2 key pair name to create/use')
```

**Update to:**
```groovy
parameters {
    string(name: 'AWS_REGION', defaultValue: 'eu-north-1', description: 'AWS region for Terraform (infra/)')
    string(name: 'KEY_PAIR_NAME', defaultValue: '<your-key-pair-name>', description: 'AWS EC2 key pair name to create/use')
```

Replace `<your-key-pair-name>` with your actual key pair name from AWS.

---

## 🔧 **STEP 7: Create .env Files for Application**

### File 7: Create [backend/.env.production](../backend/.env.production)

```bash
# Backend Production Configuration
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/royal-stay-hotels?retryWrites=true&w=majority
LOG_LEVEL=info
```

### File 8: Create [frontend/.env.production](../frontend/.env.production)

```bash
# Frontend Production Configuration
VITE_API_URL=http://13.53.188.143:5000/api
VITE_APP_NAME=Royal Stay Hotels
VITE_LOG_LEVEL=warn
```

---

## 🔧 **STEP 8: Update Backend CORS Configuration**

### File 9: [backend/server.js](../backend/server.js)

**Find this section:**
```javascript
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:80"],
  credentials: true
}));
```

**Update to:**
```javascript
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:5175",
    "http://localhost:80",
    "http://13.53.188.143",
    "http://13.53.188.143:80",
    "http://13.53.188.143:3000",
    "http://13.53.188.143:5000"
  ],
  credentials: true
}));
```

---

## 🔧 **STEP 9: Update Frontend API Service**

### File 10: [frontend/src/services/api.js](../frontend/src/services/api.js)

**Find the API_BASE_URL:**
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';
```

**Keep as-is (it will use env variable in production)**

Create/Update the Vite config for production build:

### File 11: [frontend/vite.config.js](../frontend/vite.config.js)

Ensure it has production build optimizations:
```javascript
export default {
  // ... existing config
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
}
```

---

## 🔧 **STEP 10: Update Deployment Scripts**

### File 12: [scripts/deploy.sh](../scripts/deploy.sh)

Update to use production Docker Compose:

```bash
#!/bin/bash
set -e

DOCKER_REPO=${DOCKER_REPO:-lashan123}
BACKEND_IMAGE="${DOCKER_REPO}/backend:latest"
FRONTEND_IMAGE="${DOCKER_REPO}/frontend:latest"
APP_DIR="/opt/royal-stay-hotels"

echo "🚀 Deploying Royal Stay Hotels to AWS EC2..."

# Create app directory
sudo mkdir -p $APP_DIR
sudo chown ec2-user:ec2-user $APP_DIR

cd $APP_DIR

# Create production docker-compose file
cat > docker-compose.prod.yml <<'EOF'
version: '3.8'

services:
  backend:
    image: ${DOCKER_REPO}/backend:latest
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - NODE_ENV=production
      - MONGO_URI=${MONGO_URI}
    restart: always
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/rooms"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: ${DOCKER_REPO}/frontend:latest
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  app-network:
    driver: bridge
EOF

# Pull latest images
echo "Pulling Docker images..."
docker pull $BACKEND_IMAGE
docker pull $FRONTEND_IMAGE

# Stop old containers
echo "Stopping old containers..."
docker-compose -f docker-compose.prod.yml down || true

# Start new containers
echo "Starting new containers..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Deployment completed!"
docker ps
```

---

## 🔧 **STEP 11: Update Build Scripts**

### File 13: [scripts/build.sh](../scripts/build.sh)

```bash
#!/bin/bash
set -e

echo "🔨 Building Docker images..."

# Build backend
echo "Building backend..."
docker build -t lashan123/backend:latest -f ./backend/Dockerfile ./backend

# Build frontend  
echo "Building frontend..."
docker build -t lashan123/frontend:latest -f ./frontend/Dockerfile ./frontend

echo "✅ Build completed successfully!"
docker images | grep -E "(backend|frontend)"
```

---

## 📌 **STEP 12: Generate AWS Credentials for Jenkins**

### Create temporary credentials file: [jenkins-credentials-setup.txt](../jenkins-credentials-setup.txt)

```
JENKINS CREDENTIALS SETUP
========================

When Jenkins is ready, add these credentials in Jenkins UI:

1. AWS Credentials:
   - Kind: Username and password
   - Username: <YOUR_AWS_ACCESS_KEY_ID>
   - Password: <YOUR_AWS_SECRET_ACCESS_KEY>
   - ID: aws-credentials
   - Description: AWS Account - Royal Stay Hotels

2. EC2 SSH Key:
   - Kind: SSH Username with private key
   - Username: ec2-user
   - Private Key: (contents of your .pem file)
   - ID: ec2-ssh-key
   - Description: EC2 SSH Key - Royal Stay Hotels

3. Docker Hub Credentials:
   - Kind: Username and password
   - Username: lashan123
   - Password: <your-docker-hub-password>
   - ID: dockerhub-creds
   - Description: Docker Hub Account
```

---

## ✅ **VERIFICATION CHECKLIST**

After making all changes:

- [ ] **Terraform files updated:**
  - [ ] `terraform/provider.tf` - region changed to `eu-north-1`
  - [ ] `terraform/variables.tf` - default region updated
  - [ ] `terraform/main.tf` - AZs updated to `eu-north-1a, eu-north-1b`
  - [ ] `terraform/output.tf` - region output updated

- [ ] **Environment files created:**
  - [ ] `.env.production` - AWS account ID and instance IP added
  - [ ] `backend/.env.production` - MongoDB URI configured
  - [ ] `frontend/.env.production` - API URL set to `http://13.53.188.143:5000/api`

- [ ] **Configuration files updated:**
  - [ ] `Jenkinsfile` - AWS_REGION and KEY_PAIR_NAME updated
  - [ ] `backend/server.js` - CORS origins include your instance IP
  - [ ] `scripts/deploy.sh` - uses production Docker Compose
  - [ ] `scripts/build.sh` - builds correct images

- [ ] **Credentials prepared:**
  - [ ] AWS Access Key ID noted
  - [ ] AWS Secret Access Key saved securely
  - [ ] EC2 .pem file downloaded and permissions set (chmod 400)
  - [ ] All credentials ready for Jenkins

---

## 🚀 **FINAL DEPLOYMENT STEPS**

### 1. Push changes to GitHub
```bash
cd c:\Users\ASUS\Desktop\Royal\ Stay\ Hotels\Devops
git add -A
git commit -m "feat: integrate new AWS account (eu-north-1, instance 13.53.188.143)"
git push origin main
```

### 2. SSH into App Instance and prepare it
```bash
ssh -i your-key.pem ec2-user@13.53.188.143

# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

### 3. When Jenkins is ready:
- Add credentials to Jenkins (see Step 12)
- Create Jenkins pipeline job
- Run pipeline with parameters:
  ```
  AWS_REGION: eu-north-1
  KEY_PAIR_NAME: <your-key-pair-name>
  TERRAFORM_APPLY: true
  ```

### 4. Verify Application
```bash
# Test backend API
curl http://13.53.188.143:5000/api/rooms

# Test frontend
curl http://13.53.188.143

# Or open browser:
# Frontend: http://13.53.188.143
# Backend:  http://13.53.188.143:5000/api
```

---

## 📞 **Troubleshooting**

### Problem: Port 80 already in use
```bash
ssh -i your-key.pem ec2-user@13.53.188.143
sudo netstat -tlnp | grep :80
sudo kill -9 <PID>
```

### Problem: Docker permission denied
```bash
# Ensure ec2-user is in docker group
ssh -i your-key.pem ec2-user@13.53.188.143
groups ec2-user  # Should show 'docker' group

# If not, add it:
sudo usermod -aG docker ec2-user
# Then logout and login again
```

### Problem: Can't connect to MongoDB
```bash
# Check MONGO_URI in .env.production is correct
# For MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/db
# For local: mongodb://localhost:27017/royal-stay-hotels
```

---

## 📊 **Summary Table**

| File | Change | From | To |
|------|--------|------|-----|
| provider.tf | AWS Region | ap-south-1 | eu-north-1 |
| variables.tf | Default Region | ap-south-1 | eu-north-1 |
| main.tf | Availability Zones | ap-south-1a/b | eu-north-1a/b |
| output.tf | Region Output | ap-south-1 | eu-north-1 |
| Jenkinsfile | AWS_REGION | us-east-1 | eu-north-1 |
| Jenkinsfile | KEY_PAIR_NAME | Royal_Stay_Hotels | <your-key-name> |
| server.js | CORS Origins | localhost only | + 13.53.188.143 |
| .env.production | Instance IP | N/A | 13.53.188.143 |

---

## 🔒 **Security Notes**

⚠️ **NEVER commit sensitive data:**
- Don't commit AWS access keys to GitHub
- Don't commit private .pem files to GitHub
- Use `.env.production` locally, not in repo
- Use Jenkins Secrets for sensitive values

✅ **Best Practice:**
- Store `.env.production` locally only
- Reference environment variables from Jenkins Secrets
- Use AWS IAM roles instead of access keys when possible

---

**Ready to start?** Begin with Step 1 and work through each step in order!

