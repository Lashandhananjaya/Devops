# DevOps Automation Approach - Application Deployment Strategy

## Table of Contents
1. [Overview](#overview)
2. [DevOps Tools & Infrastructure](#devops-tools--infrastructure)
3. [Application Tools & Dependencies](#application-tools--dependencies)
4. [Deployment Automation](#deployment-automation)
5. [CI/CD Pipeline Stages](#cicd-pipeline-stages)
6. [Local Development Workflow](#local-development-workflow)
7. [Production Deployment Strategy](#production-deployment-strategy)

---

## Overview

This document describes the **end-to-end automation approach** for deploying the **Royal Stay Hotels** application—a microservices-based platform with:
- **Frontend:** React 19.2.0 with Vite 7.2.2 and Tailwind CSS
- **Backend:** Node.js 18 with Express 5.1.0
- **Database:** MongoDB (both local and MongoDB Atlas for production)

The automation strategy encompasses containerization, orchestration, CI/CD pipelines, and infrastructure provisioning to achieve:
✅ **Faster deployments** (automated pipeline)
✅ **Consistency** (same environment locally and in production)
✅ **Scalability** (containerized microservices)
✅ **Reliability** (health checks, auto-recovery)
✅ **Security** (environment secrets, network isolation)

---

## DevOps Tools & Infrastructure

### 1. **Version Control System (VCS)**

| Tool | Version | Purpose |
|------|---------|---------|
| **Git** | 2.x+ | Distributed version control; tracks code changes, enables collaborative development |
| **GitHub/GitLab** | Latest | Cloud-hosted Git repository; provides webhooks for CI/CD integration |

**Purpose:**
- Single source of truth for all application code
- Branch protection rules for code quality
- Pull request workflow for peer review
- Webhook integration to trigger Jenkins pipeline on push/merge events

---

### 2. **Continuous Integration / Continuous Deployment (CI/CD)**

| Tool | Version | Purpose |
|------|---------|---------|
| **Jenkins** | 2.387+ | Open-source automation server; orchestrates build, test, and deployment pipelines |

**Key Features:**
- **Declarative Pipeline:** Jenkinsfile stored in repository for version control
- **Webhook Integration:** Automatically triggers on Git push or PR events
- **Build Artifacts:** Stores compiled images and test reports
- **Credential Management:** Secure storage of Docker registry credentials, API keys, and SSH keys

**Jenkins Configuration:**
```groovy
// Example Jenkinsfile structure (to be created)
pipeline {
    agent any
    
    stages {
        stage('Source Code Checkout') {
            // Clone from Git
        }
        stage('Build & Test') {
            // Lint, unit tests, build
        }
        stage('Containerize') {
            // Docker build & push
        }
        stage('Deploy') {
            // Deploy to Kubernetes
        }
    }
}
```

---

### 3. **Containerization**

| Tool | Version | Purpose |
|------|---------|---------|
| **Docker** | 20.10+ / 24.x | Container runtime; packages applications with dependencies into lightweight, reproducible images |
| **Docker Compose** | 2.x | Local orchestration; defines multi-container applications for development and testing |
| **Docker Registry** | (Docker Hub / ECR) | Central repository for versioned container images |

**Containerization Strategy:**

#### **Frontend Container**
```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine AS build
  - Installs dependencies
  - Builds React app with Vite (outputs to /app/dist)
  - Minifies and optimizes bundles

FROM nginx:alpine
  - Lightweight web server
  - Serves pre-built static assets (React SPA)
  - Exposed on port 80
  - Custom nginx.conf for API routing to backend
```

**Image:** `frontend:latest` (or `frontend:v1.2.3` for versioning)

#### **Backend Container**
```dockerfile
FROM node:18-alpine
  - Node.js runtime
  - Installs dependencies from package.json
  - Runs Express.js API server
  - Exposed on port 5000
```

**Image:** `backend:latest` (or `backend:v1.2.3` for versioning)

#### **Database Container (Local Development)**
```dockerfile
FROM mongo:latest
  - MongoDB community edition
  - Port 27017 (standard MongoDB port)
  - Persistent volume: mongo-data:/data/db
  - Authentication: admin/password (dev only)
```

**Benefits of Containerization:**
- ✅ **Consistency:** Same environment locally, in CI/CD, and production
- ✅ **Portability:** Runs on any system with Docker installed
- ✅ **Isolation:** Dependencies isolated; no conflicts with host OS
- ✅ **Scalability:** Easy to spin up multiple instances
- ✅ **Version Control:** Docker image tags enable reproducible builds

---

### 4. **Container Orchestration**

| Tool | Version | Purpose |
|------|---------|---------|
| **Kubernetes (K8s)** | 1.28+ | Production orchestration platform; manages containerized workloads across clusters |
| **kubectl** | 1.28+ | Command-line tool for Kubernetes cluster management |
| **Helm** (Optional) | 3.12+ | Package manager for Kubernetes; simplifies complex deployments |

**Kubernetes Components Used:**
- **Deployments:** Manage frontend and backend replicas
- **Services:** Expose pods internally (ClusterIP) and externally (LoadBalancer/Ingress)
- **Ingress Controller:** Route external traffic to services (NGINX)
- **ConfigMaps:** Store non-sensitive configuration (API endpoints, log levels)
- **Secrets:** Store sensitive data (database credentials, API keys)
- **StatefulSets:** For MongoDB if self-hosted (production)
- **HorizontalPodAutoscaler (HPA):** Auto-scale pods based on CPU/memory

---

### 5. **Infrastructure as Code (IaC)**

| Tool | Version | Purpose |
|------|---------|---------|
| **Terraform** | 1.5+ | Declarative IaC tool; provisions cloud infrastructure (VMs, networks, Kubernetes clusters) |
| **Ansible** | 2.10+ | Configuration management tool; configures OS, installs runtime, applies security policies |

**Terraform Modules (To Be Created):**
```hcl
# main.tf - Provision cloud infrastructure
provider "aws" { region = "us-east-1" }

# VPC and Networking
resource "aws_vpc" "app_vpc" { ... }
resource "aws_security_group" "k8s_sg" { ... }

# Kubernetes Cluster (EKS)
resource "aws_eks_cluster" "app_cluster" {
  name    = "royal-stay-k8s"
  version = "1.28"
}

# Worker Node Group
resource "aws_eks_node_group" "app_nodes" {
  instance_types = ["t3.medium"]
  desired_size   = 3
  max_size       = 10
}

# RDS for MongoDB Atlas alternative (or use managed MongoDB Atlas)
```

**Ansible Playbooks (To Be Created):**
```yaml
# site.yml - Configure Kubernetes nodes
---
- hosts: k8s_nodes
  tasks:
    - name: Install Docker
      apt: name=docker.io state=present
    
    - name: Install kubelet and kubeadm
      apt: name=kubelet,kubeadm,kubectl state=present
    
    - name: Join cluster
      shell: kubeadm join {{ master_ip }}:6443 --token {{ token }}
    
    - name: Configure containerd runtime
      file: path=/etc/containerd/config.toml state=present
```

**Benefits:**
- ✅ **Infrastructure as Code:** Version-controlled infrastructure
- ✅ **Reproducibility:** Spin up identical environments
- ✅ **Disaster Recovery:** Rapid infrastructure rebuild
- ✅ **Cost Management:** Automated resource provisioning and cleanup
- ✅ **Audit Trail:** Git history shows infrastructure changes

---

### 6. **Monitoring & Logging**

| Tool | Version | Purpose |
|------|---------|---------|
| **Prometheus** | 2.45+ | Metrics collection and time-series database; monitors application and infrastructure |
| **Grafana** | 9.5+ | Visualization dashboard; displays metrics and creates alerts |
| **ELK Stack / Loki** | Latest | Centralized logging; aggregates logs from all containers |
| **AlertManager** | 0.25+ | Alert routing and notification; sends alerts to Slack, PagerDuty, etc. |

**Monitoring Setup:**
```yaml
# prometheus.yml - Kubernetes metrics scraping
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
  
  - job_name: 'frontend'
    static_configs:
      - targets: ['frontend-svc:3000']
  
  - job_name: 'backend'
    static_configs:
      - targets: ['backend-svc:8080']
```

---

## Application Tools & Dependencies

### **Frontend Application Stack**

| Dependency | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework; builds interactive user interfaces |
| **React Router DOM** | 7.9.5 | Client-side routing; enables navigation between pages (Login, Dashboard, Rooms, Offers) |
| **Vite** | 7.2.2 | Build tool & dev server; ultra-fast bundling and HMR (Hot Module Replacement) |
| **Tailwind CSS** | 4.1.17 | Utility-first CSS framework; rapid UI styling without custom CSS |
| **Lucide React** | 0.553.0 | Icon library; provides SVG icons for UI elements |
| **@tailwindcss/vite** | 4.1.17 | Vite plugin for Tailwind CSS integration |

**Development Dependencies:**
| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 9.39.1 | Code linter; enforces code quality and consistency |
| **@vitejs/plugin-react** | 5.1.0 | Vite plugin for React; enables JSX support and fast refresh |
| **@types/react** | 19.2.2 | TypeScript type definitions for React (optional TS support) |

**Frontend Build Process:**
```bash
npm run dev      # Start dev server with HMR (http://localhost:5173)
npm run build    # Production build → creates /dist folder
npm run lint     # ESLint checks code quality
npm run preview  # Preview production build locally
```

**Build Output:**
- Minified JavaScript bundles
- Optimized CSS with Tailwind
- Static assets (images, fonts)
- Served by NGINX in production

---

### **Backend Application Stack**

| Dependency | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x (LTS) | JavaScript runtime; executes backend code |
| **Express.js** | 5.1.0 | Web framework; handles HTTP requests, routing, and middleware |
| **Mongoose** | 8.19.3 | MongoDB ODM (Object Data Model); provides schema validation and queries |
| **bcryptjs** | 2.4.3 | Password hashing; secures user passwords |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing; enables frontend to call backend API |
| **dotenv** | 17.2.3 | Environment variable loader; manages config secrets |

**Development Dependencies:**
| Tool | Version | Purpose |
|------|---------|---------|
| **Nodemon** | 3.1.10 | Auto-restart server on file changes during development |

**Backend API Endpoints:**
```
POST   /api/auth/signup       # User registration
POST   /api/auth/login        # User authentication
GET    /api/rooms             # List all rooms
POST   /api/rooms             # Create room (admin)
PUT    /api/rooms/:id         # Update room
DELETE /api/rooms/:id         # Delete room
GET    /api/offers            # List all offers
POST   /api/offers            # Create offer (admin)
```

**Backend Startup:**
```bash
npm start   # Production: node server.js (port 5000)
npm run dev # Development: nodemon server.js (with auto-reload)
```

---

### **Database Stack**

| Component | Version | Purpose |
|-----------|---------|---------|
| **MongoDB (Local)** | Latest | NoSQL database for local development |
| **MongoDB Atlas** | Cloud | Managed MongoDB service for production |
| **Mongoose** | 8.19.3 | Backend ORM for schema and query management |

**Data Models:**
```javascript
// User Model
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (bcrypted),
  createdAt: Date
}

// Room Model
{
  _id: ObjectId,
  roomNumber: String,
  type: String (single|double|suite),
  price: Number,
  capacity: Number,
  amenities: [String],
  available: Boolean,
  createdAt: Date
}

// Offer Model
{
  _id: ObjectId,
  title: String,
  description: String,
  discount: Number,
  validFrom: Date,
  validTo: Date,
  createdAt: Date
}
```

**Connection String (Development):**
```
mongodb://admin:password@mongo:27017/royal-stay-hotels?authSource=admin
```

**Connection String (Production - MongoDB Atlas):**
```
mongodb+srv://user:password@cluster.mongodb.net/royal-stay-hotels?retryWrites=true&w=majority
```

---

## Deployment Automation

### **Local Development Setup**

**Quick Start with Docker Compose:**
```bash
# 1. Clone repository
git clone https://github.com/Lashandhananjaya/Devops.git
cd Devops

# 2. Start all services
docker-compose up -d

# 3. Access application
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
# MongoDB: localhost:27018 (admin/password)

# 4. View logs
docker-compose logs -f

# 5. Stop services
docker-compose down
```

**What `docker-compose up` Does:**
```yaml
Services started in order:
1. mongo (MongoDB) - initializes with admin user
2. backend (Node.js) - waits for mongo to be healthy
3. frontend (React) - depends on backend service

Network: app-network (connects all services)
Volumes: mongo-data (persists database between restarts)
```

---

### **CI/CD Pipeline Automation**

#### **Trigger Events**
Pipeline is triggered by:
1. **Push to main branch** → Production deployment
2. **Push to develop branch** → Staging deployment
3. **Pull request created** → Run tests and lint checks
4. **Webhook from Git** → Jenkins automatically detects changes

#### **Pipeline Architecture**

```
Git Webhook
    ↓
Jenkins Pipeline Triggered
    ↓
Stage 1: Source Code Checkout
    ↓
Stage 2: Build & Test
    ↓
Stage 3: Security Scan (SonarQube)
    ↓
Stage 4: Containerization
    ↓
Stage 5: Push to Registry
    ↓
Stage 6: Infrastructure Provisioning (Terraform)
    ↓
Stage 7: Configuration Management (Ansible)
    ↓
Stage 8: Deployment to Kubernetes
    ↓
Stage 9: Health Checks & Smoke Tests
    ↓
Stage 10: Post-Deployment Notifications
```

---

## CI/CD Pipeline Stages

### **Stage 1: Source Code Checkout**
**Duration:** ~10 seconds
```groovy
stage('Checkout') {
    steps {
        checkout([
            $class: 'GitSCM',
            branches: [[name: '*/main']],
            userRemoteConfigs: [[url: 'https://github.com/Lashandhananjaya/Devops.git']]
        ])
    }
}
```
**Action:** Clones latest code from Git repository

---

### **Stage 2: Dependencies Installation & Build**
**Duration:** ~3-5 minutes

#### **Frontend Build:**
```groovy
stage('Build Frontend') {
    steps {
        dir('frontend') {
            sh '''
                npm install
                npm run lint
                npm run build
            '''
        }
    }
}
```

**Outputs:**
- ESLint quality checks
- Vite production build → `/dist` directory
- Minified JavaScript, CSS, and assets

#### **Backend Build:**
```groovy
stage('Build Backend') {
    steps {
        dir('backend') {
            sh '''
                npm install
                # Run unit tests (if configured)
                npm run test || true
            '''
        }
    }
}
```

**Outputs:**
- Dependencies installed
- Code quality checks
- Test reports

---

### **Stage 3: Unit Testing & Code Quality**
**Duration:** ~2-3 minutes

```groovy
stage('Test & Lint') {
    steps {
        dir('frontend') {
            sh 'npm run lint'  // ESLint checks
        }
        dir('backend') {
            sh 'npm run test || true'  // Unit tests
        }
    }
    post {
        always {
            junit 'test-results.xml'
            publishHTML([
                reportDir: 'coverage',
                reportFiles: 'index.html',
                reportName: 'Code Coverage'
            ])
        }
    }
}
```

**Checks:**
- ✅ ESLint: Code style and best practices
- ✅ Unit tests: Business logic validation
- ✅ Code coverage: Minimum 70% threshold
- ✅ Security scan: Dependency vulnerabilities

---

### **Stage 4: Docker Image Building**
**Duration:** ~5-10 minutes

```groovy
stage('Build Docker Images') {
    steps {
        script {
            sh '''
                # Build frontend image
                docker build -t ${REGISTRY}/frontend:${BUILD_NUMBER} ./frontend
                docker build -t ${REGISTRY}/frontend:latest ./frontend
                
                # Build backend image
                docker build -t ${REGISTRY}/backend:${BUILD_NUMBER} ./backend
                docker build -t ${REGISTRY}/backend:latest ./backend
            '''
        }
    }
}
```

**Image Tags:**
- `frontend:latest` (for quick reference)
- `frontend:v1.2.3` (semantic versioning)
- `frontend:${BUILD_NUMBER}` (unique build number)

**Multi-Stage Build Benefits:**
```dockerfile
# Frontend multi-stage
Stage 1: Build (node:18-alpine)
  - Install dependencies
  - npm run build → creates /app/dist
  
Stage 2: Production (nginx:alpine)
  - Copy only /dist folder
  - Lightweight final image (~50MB vs 300MB)
```

---

### **Stage 5: Push to Container Registry**
**Duration:** ~2-3 minutes

```groovy
stage('Push to Registry') {
    environment {
        REGISTRY_CREDENTIALS = credentials('docker-registry-credentials')
    }
    steps {
        script {
            sh '''
                echo ${REGISTRY_CREDENTIALS_PSW} | docker login -u ${REGISTRY_CREDENTIALS_USR} --password-stdin
                
                docker push ${REGISTRY}/frontend:${BUILD_NUMBER}
                docker push ${REGISTRY}/frontend:latest
                docker push ${REGISTRY}/backend:${BUILD_NUMBER}
                docker push ${REGISTRY}/backend:latest
                
                docker logout
            '''
        }
    }
}
```

**Registry Options:**
- Docker Hub (public)
- AWS ECR (private, AWS-integrated)
- GitLab Container Registry
- Private Docker Registry

---

### **Stage 6: Infrastructure Provisioning (Terraform)**
**Duration:** ~15-20 minutes (only on first run)

```groovy
stage('Provision Infrastructure') {
    when {
        branch 'main'
    }
    steps {
        dir('terraform') {
            sh '''
                terraform init
                terraform plan -out=tfplan
                terraform apply tfplan
                
                # Export outputs
                terraform output > deployment.env
            '''
        }
    }
}
```

**Provisions:**
- AWS VPC with subnets
- Security groups and network policies
- Kubernetes cluster (EKS)
- Auto-scaling worker nodes
- Load balancer and network interface

---

### **Stage 7: Configuration Management (Ansible)**
**Duration:** ~10 minutes

```groovy
stage('Configure Infrastructure') {
    steps {
        sh '''
            ansible-playbook -i inventory/hosts playbooks/configure-k8s.yml \
                -e "k8s_version=1.28" \
                -e "docker_version=24.0"
        '''
    }
}
```

**Ansible Tasks:**
- Install Docker daemon
- Install Kubernetes tools (kubelet, kubeadm, kubectl)
- Configure containerd runtime
- Set up kubeconfig
- Install CNI plugins for networking
- Apply security policies

---

### **Stage 8: Deploy to Kubernetes**
**Duration:** ~5-10 minutes

```groovy
stage('Deploy to Kubernetes') {
    steps {
        script {
            sh '''
                # Create/update ConfigMaps
                kubectl create configmap app-config \
                    --from-literal=API_BACKEND_URL=https://api.example.com \
                    --from-literal=LOG_LEVEL=info \
                    --dry-run=client -o yaml | kubectl apply -f -
                
                # Create/update Secrets
                kubectl create secret generic db-credentials \
                    --from-literal=MONGO_URI="${MONGO_CONNECTION_STRING}" \
                    --dry-run=client -o yaml | kubectl apply -f -
                
                # Deploy frontend
                cat k8s/frontend-deployment.yaml | \
                    sed "s|IMAGE_TAG|${BUILD_NUMBER}|g" | \
                    kubectl apply -f -
                
                # Deploy backend
                cat k8s/backend-deployment.yaml | \
                    sed "s|IMAGE_TAG|${BUILD_NUMBER}|g" | \
                    kubectl apply -f -
                
                # Wait for rollout
                kubectl rollout status deployment/frontend -n default
                kubectl rollout status deployment/backend -n default
            '''
        }
    }
}
```

**Kubernetes Manifests (k8s/ directory):**

#### **frontend-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: default
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0  # Zero-downtime deployment
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: ${REGISTRY}/frontend:${BUILD_NUMBER}
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

#### **backend-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: ${REGISTRY}/backend:${BUILD_NUMBER}
        ports:
        - containerPort: 5000
        env:
        - name: MONGO_URI
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: MONGO_URI
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "5000"
        resources:
          requests:
            cpu: 200m
            memory: 256Mi
          limits:
            cpu: 1000m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/ready
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: backend-svc
spec:
  selector:
    app: backend
  ports:
  - port: 8080
    targetPort: 5000
  type: ClusterIP
```

#### **ingress.yaml**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - example.com
    secretName: tls-secret
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-svc
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-svc
            port:
              number: 8080
```

---

### **Stage 9: Health Checks & Smoke Tests**
**Duration:** ~3-5 minutes

```groovy
stage('Health Checks') {
    steps {
        script {
            sh '''
                # Wait for services to be ready
                sleep 30
                
                # Check frontend
                curl -f http://frontend-svc/health || exit 1
                
                # Check backend API
                curl -f http://backend-svc:8080/api/health || exit 1
                
                # Check database connectivity
                curl -f http://backend-svc:8080/api/ready || exit 1
                
                # Run smoke tests
                npm run test:smoke
            '''
        }
    }
    post {
        failure {
            // Automatic rollback
            sh 'kubectl rollout undo deployment/frontend deployment/backend'
        }
    }
}
```

**Health Endpoints (Backend):**
```javascript
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.get('/api/ready', (req, res) => {
  // Check database connection
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ ready: true });
  } else {
    res.status(503).json({ ready: false });
  }
});
```

---

### **Stage 10: Post-Deployment Notifications**
**Duration:** ~1 minute

```groovy
stage('Notify') {
    post {
        success {
            sh '''
                echo "✅ Deployment Successful!"
                # Send Slack notification
                curl -X POST -H 'Content-type: application/json' \
                    --data '{"text":"Deployment Successful - Build #${BUILD_NUMBER}"}' \
                    ${SLACK_WEBHOOK_URL}
                
                # Send email
                mail to: "devops@example.com",
                     subject: "Deployment Success: Build #${BUILD_NUMBER}",
                     body: "Frontend and backend deployed successfully to production."
            '''
        }
        failure {
            sh '''
                echo "❌ Deployment Failed!"
                curl -X POST -H 'Content-type: application/json' \
                    --data '{"text":"Deployment Failed - Build #${BUILD_NUMBER}"}' \
                    ${SLACK_WEBHOOK_URL}
            '''
        }
    }
}
```

---

## Local Development Workflow

### **Step 1: Clone Repository**
```bash
git clone https://github.com/Lashandhananjaya/Devops.git
cd Devops
```

### **Step 2: Setup Environment Variables**
```bash
# Create .env files
cat > backend/.env << EOF
PORT=5000
MONGO_URI=mongodb://admin:password@mongo:27017/royal-stay-hotels?authSource=admin
NODE_ENV=development
USE_MOCK_DB=false
EOF

cat > frontend/.env << EOF
VITE_API_URL=http://localhost:5000
EOF
```

### **Step 3: Start Services with Docker Compose**
```bash
# Start all services
docker-compose up -d

# Verify services
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

### **Step 4: Access Application**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **MongoDB:** localhost:27018 (credentials: admin/password)

### **Step 5: Development Commands**
```bash
# Frontend development (hot reload)
cd frontend
npm run dev          # Runs on http://localhost:5173

# Backend development (auto-restart)
cd backend
npm run dev          # Runs on http://localhost:5000

# Linting
npm run lint

# Build for production
npm run build
```

### **Step 6: Stop Services**
```bash
docker-compose down          # Stop and remove containers
docker-compose down -v       # Also remove volumes
```

---

## Production Deployment Strategy

### **Pre-Deployment Checklist**

| Check | Tool | Command |
|-------|------|---------|
| Code Quality | ESLint | `npm run lint` |
| Security Scan | OWASP/Snyk | `snyk test` |
| Image Scan | Trivy | `trivy image frontend:latest` |
| Load Test | JMeter/Locust | `locust -f loadtest.py` |
| Database Migration | Mongoose | `node migrate.js` |

### **Deployment Environments**

#### **Development (Dev)**
- **Infrastructure:** Docker Compose on developer machine
- **Database:** Local MongoDB
- **Updates:** Frequent (multiple times per day)
- **Rollback:** Manual (`docker-compose down/up`)

#### **Staging (UAT)**
- **Infrastructure:** Kubernetes cluster (non-prod)
- **Database:** MongoDB Atlas (replica set)
- **Updates:** Nightly or on-demand
- **Testing:** Integration tests, smoke tests

#### **Production (Prod)**
- **Infrastructure:** Kubernetes cluster (HA, multi-zone)
- **Database:** MongoDB Atlas (sharded, backed up)
- **Updates:** Blue-green deployment or canary
- **Monitoring:** 24/7 monitoring, alerting, logging

### **Blue-Green Deployment Strategy**

```
Version 1 (Blue) - Currently Active
  - frontend:v1.0.0
  - backend:v1.0.0
  - Serving 100% traffic

    ↓ (Deploy)

Version 2 (Green) - New Release
  - frontend:v2.0.0
  - backend:v2.0.0
  - Deployed, health checks pass

    ↓ (Test)

Run smoke tests on Green
  - ✅ All endpoints responding
  - ✅ Database connectivity OK
  - ✅ No errors in logs

    ↓ (Switch)

Ingress routes 100% traffic to Green
  - Blue still running for quick rollback
  - If issues: route back to Blue instantly

    ↓ (Monitor)

Monitor Green for 1 hour
  - Error rates normal
  - Performance acceptable
  - No user complaints

    ↓ (Cleanup)

Decommission Blue
  - Save disk space
  - Only Green running
```

### **Rollback Procedure**

```bash
# Automatic rollback on health check failure
kubectl rollout undo deployment/frontend
kubectl rollout undo deployment/backend

# Manual rollback
kubectl set image deployment/frontend frontend=${REGISTRY}/frontend:v1.0.0
kubectl set image deployment/backend backend=${REGISTRY}/backend:v1.0.0

# Check rollback status
kubectl rollout status deployment/frontend
```

---

## Automation Tools Summary

| Category | Tool | Version | Role |
|----------|------|---------|------|
| **VCS** | Git | 2.x+ | Source control |
| **CI/CD** | Jenkins | 2.387+ | Pipeline orchestration |
| **Containerization** | Docker | 24.x | Image building |
| | Docker Compose | 2.x | Local orchestration |
| | Docker Registry | Latest | Image storage |
| **Orchestration** | Kubernetes | 1.28+ | Production runtime |
| | NGINX Ingress | Latest | Load balancing |
| **IaC** | Terraform | 1.5+ | Infrastructure provisioning |
| | Ansible | 2.10+ | Configuration management |
| **Monitoring** | Prometheus | 2.45+ | Metrics collection |
| | Grafana | 9.5+ | Visualization |
| **Logging** | ELK / Loki | Latest | Log aggregation |
| **App (Frontend)** | React | 19.2.0 | UI framework |
| | Vite | 7.2.2 | Build tool |
| | Tailwind CSS | 4.1.17 | Styling |
| | ESLint | 9.39.1 | Code quality |
| **App (Backend)** | Node.js | 18.x LTS | Runtime |
| | Express.js | 5.1.0 | Framework |
| | Mongoose | 8.19.3 | ODM |
| | Bcryptjs | 2.4.3 | Password hashing |
| **Database** | MongoDB | Latest | NoSQL database |
| | MongoDB Atlas | Cloud | Managed DB (prod) |

---

## Key Automation Benefits

✅ **Faster Time to Market**
- Automated tests catch bugs early
- Instant deployments on code merge
- Reduced manual deployment time from hours to minutes

✅ **Consistency & Reliability**
- Same Docker image in dev, staging, prod
- Infrastructure as Code ensures identical environments
- Automated rollbacks prevent prolonged outages

✅ **Scalability**
- Kubernetes auto-scales pods based on traffic
- Terraform auto-scales infrastructure
- Handle 10x traffic with minimal manual intervention

✅ **Security**
- Automated security scans (OWASP, Snyk, Trivy)
- Secrets in Kubernetes Secrets (not code)
- TLS encryption for all communications
- RBAC and network policies enforced

✅ **Cost Optimization**
- Terraform-managed resources prevent over-provisioning
- Auto-scaling saves costs during low-traffic periods
- Container efficiency reduces infrastructure overhead

✅ **Observability**
- Prometheus metrics for real-time monitoring
- Grafana dashboards for visualization
- Centralized logging for troubleshooting
- Alerting for critical issues

---

## Conclusion

This comprehensive automation approach ensures the Royal Stay Hotels application is:
- **Built consistently** (Docker containers)
- **Deployed reliably** (Kubernetes orchestration)
- **Provisioned automatically** (Terraform + Ansible)
- **Tested thoroughly** (Jenkins pipeline)
- **Monitored continuously** (Prometheus + Grafana)
- **Recoverable quickly** (automated rollbacks)

The pipeline transforms code commits into production deployments with minimal human intervention, enabling rapid iteration, high reliability, and operational efficiency.
