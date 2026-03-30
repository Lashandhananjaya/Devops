# AWS Integration Quick Checklist

## 🎯 Quick Reference - All Changes Needed

### Information You Need to Gather
```
□ AWS Account ID (from AWS Console → Account)
□ AWS Access Key ID (starts with AKIA)
□ AWS Secret Access Key (save it securely!)
□ EC2 Key Pair Name (from AWS EC2 → Key Pairs)
□ EC2 Private Key File (.pem) - downloaded and chmod 400
```

### Files to Update (13 Files Total)

#### Terraform Files (4 files)
```
□ 1. terraform/provider.tf
     - Change: region = "ap-south-1" → region = "eu-north-1"

□ 2. terraform/variables.tf
     - Change: default = "ap-south-1" → default = "eu-north-1"

□ 3. terraform/main.tf
     - Change: azs = ["ap-south-1a", "ap-south-1b"] → ["eu-north-1a", "eu-north-1b"]

□ 4. terraform/output.tf
     - Change: value = "ap-south-1" → value = "eu-north-1"
```

#### Jenkinsfile (1 file)
```
□ 5. Jenkinsfile
     - Change: AWS_REGION default from 'us-east-1' to 'eu-north-1'
     - Change: KEY_PAIR_NAME default from 'Royal_Stay_Hotels' to '<your-key-pair-name>'
```

#### Backend (2 files)
```
□ 6. backend/server.js
     - Add to CORS origins: 13.53.188.143

□ 7. backend/.env.production (CREATE NEW)
     - PORT=5000
     - NODE_ENV=production
     - MONGO_URI=mongodb+srv://...
```

#### Frontend (2 files)
```
□ 8. frontend/src/services/api.js
     - Verify VITE_API_URL environment variable is used

□ 9. frontend/.env.production (CREATE NEW)
     - VITE_API_URL=http://13.53.188.143:5000/api
```

#### Environment Configuration (1 file)
```
□ 10. .env.production (CREATE NEW)
     - AWS_ACCOUNT_ID=<your-account-id>
     - APP_INSTANCE_IP=13.53.188.143
     - EC2_KEY_NAME=<your-key-pair-name>
     - MONGO_URI=<your-mongodb-uri>
     - DOCKER_REPO=lashan123
```

#### Deployment Scripts (2 files)
```
□ 11. scripts/deploy.sh
     - Update to use production Docker Compose configuration
     - Add health checks

□ 12. scripts/build.sh
     - Verify Docker build commands are correct
```

#### Documentation (1 file)
```
□ 13. jenkins-credentials-setup.txt (CREATE NEW)
     - Document your AWS credentials for Jenkins setup
```

---

## 📋 Pre-Deployment Checklist

### Before Running Jenkins Pipeline

#### AWS Account Setup
- [ ] AWS Account ID obtained
- [ ] AWS Access Key ID created and saved
- [ ] AWS Secret Access Key saved securely (only visible once!)
- [ ] EC2 instances created and running
  - [ ] App instance (13.53.188.143) - running
  - [ ] Jenkins instance - running
- [ ] EC2 Key Pair downloaded and saved
- [ ] Security groups configured with correct inbound rules

#### Local Development
- [ ] All 13 files updated with correct values
- [ ] `.env.production` created with your account ID
- [ ] `backend/.env.production` created with MongoDB URI
- [ ] `frontend/.env.production` created with instance IP
- [ ] Git changes committed and pushed to main branch

#### EC2 Instance Preparation
- [ ] SSH into app instance successfully
- [ ] Docker installed and running
- [ ] Docker Compose installed
- [ ] `/opt/royal-stay-hotels` directory created
- [ ] Docker group added to ec2-user

#### Jenkins Setup (when ready)
- [ ] Jenkins instance running
- [ ] AWS Credentials added (ID: aws-credentials)
- [ ] EC2 SSH Key added (ID: ec2-ssh-key)
- [ ] Docker Hub Credentials added (ID: dockerhub-creds)
- [ ] Pipeline job created with Jenkinsfile

---

## 🚀 Deployment Flow

```
1. Update all 13 files ✓
   ↓
2. Push to GitHub ✓
   ↓
3. SSH into app instance and install Docker ✓
   ↓
4. Set up Jenkins (later)
   ↓
5. Add AWS credentials to Jenkins
   ↓
6. Create Jenkins pipeline job
   ↓
7. Run pipeline with parameters:
   - AWS_REGION: eu-north-1
   - KEY_PAIR_NAME: <your-key-pair>
   - TERRAFORM_APPLY: true
   ↓
8. Verify application running at:
   - Frontend: http://13.53.188.143
   - Backend: http://13.53.188.143:5000/api
```

---

## 🔑 Keys and Secrets Location

### Store Securely (NOT in Git)
```
- AWS Access Key ID          → Jenkins Credentials
- AWS Secret Access Key      → Jenkins Credentials
- EC2 Private Key (.pem)     → Jenkins Credentials + local backup
- MongoDB Atlas Password     → .env.production (local only)
- Docker Hub Password        → Jenkins Credentials
```

### Can Be in Git
```
- Terraform code with variables
- Dockerfile configurations
- Application code
- Pipeline scripts (no secrets embedded)
```

---

## ⏱️ Time Estimate

| Task | Time |
|------|------|
| Gather AWS information | 10 min |
| Update 13 files | 20 min |
| Push to GitHub | 2 min |
| SSH and install Docker on EC2 | 10 min |
| Set up Jenkins (later) | 30 min |
| Add credentials to Jenkins | 5 min |
| Run first pipeline | 5 min |
| Verify application | 5 min |
| **TOTAL** | **~87 minutes** |

---

## 📞 Getting Help

If stuck on:
- **Terraform**: Check [COMPLETE_AWS_SETUP_GUIDE.md](COMPLETE_AWS_SETUP_GUIDE.md) Steps 1-4
- **Environment variables**: Check Step 5-8
- **Deployment**: Check Step 10-11
- **Jenkins credentials**: Check [JENKINS_CREDENTIALS_SETUP.md](JENKINS_CREDENTIALS_SETUP.md)
- **AWS account**: Check Step 12

---

## ✅ Success Criteria

After deployment, verify:

```bash
# 1. Can SSH to app instance
ssh -i your-key.pem ec2-user@13.53.188.143

# 2. Docker containers are running
docker ps
# Expected: Both backend and frontend containers running

# 3. Backend API responds
curl http://13.53.188.143:5000/api/rooms
# Expected: JSON array of rooms

# 4. Frontend loads
curl http://13.53.188.143
# Expected: HTML content

# 5. No errors in logs
docker logs $(docker ps -q -f ancestor=lashan123/backend)
docker logs $(docker ps -q -f ancestor=lashan123/frontend)
```

---

**Start with the COMPLETE_AWS_SETUP_GUIDE.md for detailed step-by-step instructions!**
