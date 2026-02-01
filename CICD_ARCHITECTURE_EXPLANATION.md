# CI/CD Pipeline Architecture - Detailed Explanation

## Overview
This CI/CD diagram illustrates a complete DevOps pipeline for a containerized microservices application (Frontend + Backend + MongoDB). It integrates industry-standard tools for source control, continuous integration, infrastructure provisioning, and container orchestration.

---

## Component Breakdown

### 1. **Source Control (Git)**
- **Tool:** GitHub / GitLab
- **Role:** Single source of truth for all application code
- **Flow:** Developers write code → commit to feature branches → create pull requests → merge to main branch
- **Integration:** Git webhooks trigger Jenkins CI pipeline automatically on push/PR events
- **Benefits:** Version control, code review, audit trail

### 2. **Continuous Integration (Jenkins)**
- **Tool:** Jenkins
- **Role:** Automates build, test, and containerization
- **Pipeline Steps:**
  1. **SCM Checkout** – Clone repository from Git
  2. **Lint & Test** – Run ESLint, unit tests (Jest/Mocha)
  3. **Build** – Compile frontend (Vite) and backend (Node.js)
  4. **Docker Build** – Build Docker images for frontend and backend
  5. **Push to Registry** – Push images with semantic versioning tags (e.g., `v1.2.3`)
- **Trigger:** Webhook from Git on branch updates
- **Artifact Storage:** Jenkinsfile stored in repo for pipeline-as-code
- **Benefits:** Automated validation, fast feedback, consistent builds

### 3. **Container Registry (Docker Registry)**
- **Tool:** Docker Hub / AWS ECR / Private Registry
- **Role:** Central repository for versioned container images
- **Storage:**
  - `frontend:v1.x` – React/Vite app packaged in container
  - `backend:v1.x` – Node.js/Express app packaged in container
- **Access:** Kubernetes cluster pulls images with image pull secrets for authentication
- **Benefits:** Reproducible deployments, image versioning, rollback capability

### 4. **Infrastructure as Code (Terraform)**
- **Tool:** Terraform
- **Role:** Declaratively provisions cloud infrastructure
- **Provisions:**
  - Virtual machines (EC2/VMs) as Kubernetes worker nodes
  - Kubernetes cluster (managed or self-hosted)
  - Virtual networks, security groups, IAM roles
  - Storage for persistent data (optional)
- **Trigger:** Jenkins applies Terraform plans during deployment
- **Benefits:** Infrastructure reproducibility, version control, infrastructure drift detection

### 5. **Configuration Management (Ansible)**
- **Tool:** Ansible
- **Role:** Configures OS, installs dependencies, applies post-provisioning tasks
- **Playbooks:**
  - Install Docker, kubelet, and kubeadm on nodes
  - Configure system packages and kernel parameters
  - Deploy secrets and SSL certificates
  - Health checks and monitoring agent setup
- **Trigger:** Jenkins runs Ansible playbooks after Terraform provisioning
- **Benefits:** Idempotent configuration, human-readable YAML, agentless architecture

---

## Kubernetes Cluster Architecture

### **Ingress Controller (Load Balancer)**
- **Tool:** NGINX Ingress Controller
- **Port:** 443 (HTTPS/TLS)
- **Role:**
  - Terminates external TLS connections
  - Routes traffic to frontend and backend services
  - Acts as single entry point for all users
- **Routing Rules:**
  - `/` → `frontend-svc:80`
  - `/api/*` → `backend-svc:8080`

### **Frontend Deployment**
- **Container:** React/Vite application
- **Replicas:** 2+ pods for high availability
- **Service:** `frontend-svc` (ClusterIP, port 80)
- **Pod Specs:**
  - Image: `frontend:v1.x` from Docker Registry
  - Port: 3000 (internal container port mapped to service port 80)
  - Resources: CPU/memory requests and limits
  - Liveness/readiness probes
- **Configuration:** Injected via ConfigMaps for API endpoints

### **Backend Deployment**
- **Container:** Node.js/Express API server
- **Replicas:** 2+ pods for high availability and load distribution
- **Service:** `backend-svc` (ClusterIP, port 8080)
- **Pod Specs:**
  - Image: `backend:v1.x` from Docker Registry
  - Port: 8080 (exposed API port)
  - Environment variables: Injected from ConfigMaps and Secrets
  - Liveness/readiness probes
- **Configuration:** Database credentials stored in Kubernetes Secrets (never in code)

### **Application Inter-Component Connectivity**
1. **User Request Flow:**
   - User browser sends HTTPS request to Ingress public IP
   - Ingress terminates TLS, routes to frontend service
   - Frontend pods serve static React app

2. **Frontend to Backend Communication:**
   - Frontend JavaScript code makes HTTP/REST calls to backend
   - Calls routed via Ingress → backend-svc → backend pods
   - URL used: `http://backend-svc.default.svc.cluster.local:8080` (Kubernetes DNS)
   - Or via Ingress: `https://api.yourdomain.com` (external access)

3. **Backend to Database Connection:**
   - Backend pods connect to MongoDB Atlas (external managed service)
   - Connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname?tls=true`
   - TLS encryption for all database traffic
   - Credentials stored in Kubernetes Secret `mongodb-credentials`
   - Connection pooling for efficient resource usage

### **ConfigMaps & Secrets**
- **ConfigMaps:** Non-sensitive application configuration
  - API endpoints, log levels, feature flags
  - Example: `API_BACKEND_URL=http://backend-svc:8080`
- **Secrets:** Sensitive data (base64 encoded)
  - MongoDB connection string, database passwords
  - JWT signing keys, OAuth tokens
  - TLS certificates for HTTPS

### **Monitoring & Logging**
- **Prometheus:** Collects metrics from pods and Kubernetes API
- **ELK Stack / Grafana:** Stores metrics and logs
- **Purpose:** Monitor application health, resource usage, performance

---

## Full End-to-End Data Flow

### **Deployment Flow (CI/CD Control Path – Dashed Arrows):**
```
Developer commits code → Git webhook → Jenkins pipeline triggers
   ↓
Jenkins: checkout code → lint → test → build Docker images
   ↓
Jenkins: push images to Docker Registry
   ↓
Jenkins: trigger Terraform apply (provision infrastructure)
   ↓
Terraform: create/update Kubernetes cluster and VMs
   ↓
Jenkins: trigger Ansible playbooks (configure OS, install k8s tools)
   ↓
Ansible: configure worker nodes, setup networking
   ↓
Jenkins: deploy manifests (or trigger via ArgoCD)
   ↓
Kubernetes: pulls images from Registry, deploys pods
```

### **Runtime Data Flow (Solid Arrows):**
```
User (HTTPS:443) → Ingress Controller (TLS termination)
   ↓
Frontend Service (ClusterIP:80) → Frontend Pods (React app)
   ↓
Frontend app (JavaScript) makes API calls → Ingress (route to backend) or direct service DNS
   ↓
Backend Service (ClusterIP:8080) → Backend Pods (Node.js API)
   ↓
Backend app queries → MongoDB Atlas (TLS:27017)
   ↓
Data persisted in MongoDB; response returned through same path
```

---

## Security & Best Practices

| Component | Security Measure |
|-----------|-----------------|
| **Git** | Branch protection, code review requirements, SSH keys |
| **Jenkins** | Restricted access, credentials stored in Jenkins secrets, API token auth |
| **Docker Registry** | Private registry with authentication, image scanning for vulnerabilities |
| **Kubernetes** | RBAC (role-based access control), network policies, pod security policies |
| **Database** | TLS encryption, credentials in K8s Secrets, VPC peering or IP whitelisting |
| **Network** | TLS/HTTPS for all external traffic, internal cluster DNS, NetworkPolicies |

---

## Scalability & High Availability

- **Frontend Replicas:** 2+ pods spread across nodes
  - Horizontal Pod Autoscaler (HPA) scales based on CPU/memory metrics
  - Service automatically load balances across pods

- **Backend Replicas:** 2+ pods with stateless design
  - Horizontal Pod Autoscaler scales based on traffic
  - Session management via JWT (not server-side state)
  - Database connection pooling for efficient resource usage

- **Kubernetes Cluster:** Multi-node setup
  - Node auto-scaling: Add/remove nodes based on resource demand
  - Pod disruption budgets for rolling updates without downtime

---

## Key Technologies & Tools Summary

| Layer | Tool | Purpose |
|-------|------|---------|
| **Source Control** | Git (GitHub/GitLab) | Version control, webhooks |
| **CI/CD** | Jenkins | Automated build, test, containerization |
| **Registry** | Docker Hub / ECR | Container image storage |
| **IaC (Provisioning)** | Terraform | Cloud infrastructure provisioning |
| **IaC (Configuration)** | Ansible | OS configuration, node setup |
| **Orchestration** | Kubernetes | Container orchestration, scheduling |
| **Load Balancing** | NGINX Ingress | Traffic routing, TLS termination |
| **Database** | MongoDB Atlas | Managed NoSQL database |
| **Monitoring** | Prometheus/Grafana | Metrics and visualization |
| **Logging** | ELK / Loki | Centralized logging |

---

## Deployment Example Workflow

1. **Developer creates feature branch, commits code to GitHub**
2. **Webhook triggers Jenkins pipeline**
3. **Jenkins runs tests, builds Docker images: `frontend:v1.2.3` and `backend:v1.2.3`**
4. **Jenkins pushes images to Docker Registry**
5. **Jenkins triggers Terraform to ensure infrastructure is provisioned**
6. **Jenkins triggers Ansible to configure k8s cluster**
7. **Jenkins deploys Kubernetes manifests with new image tags**
8. **Kubernetes pulls images from registry, creates new pods**
9. **Rolling update replaces old pods with new ones (zero downtime)**
10. **Ingress routes user traffic to new pods**
11. **Monitoring systems track metrics and logs**
12. **If issues detected, Jenkins can trigger automatic rollback to previous image version**

---

## How to Import & Edit This Diagram

1. **Go to [draw.io](https://draw.io)**
2. **File → Open → Select `CICD_Diagram.drawio` from your workspace**
   - Or drag-and-drop the file into draw.io
3. **Edit components, add your specific domain names, IP addresses, or tool names**
4. **Export as PNG/SVG for documentation or presentations**

---

## Conclusion

This CI/CD architecture ensures:
- ✅ **Automation:** Minimal manual steps, fast deployments
- ✅ **Reliability:** Infrastructure as code, repeatable builds
- ✅ **Scalability:** Kubernetes auto-scaling, horizontal pod autoscaling
- ✅ **Security:** TLS encryption, secrets management, RBAC
- ✅ **Observability:** Centralized logging, metrics, alerting
- ✅ **Recovery:** Versioned images, rollback capability, health checks
