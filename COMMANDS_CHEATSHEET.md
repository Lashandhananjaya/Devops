# 🖥️ Terminal Commands Cheatsheet

## 📋 All Commands You'll Need

### Setup Commands

```powershell
# 1. Navigate to project
cd "C:\Users\ASUS\Desktop\Royal Stay Hotels\Devops"

# 2. Check Terraform version
terraform --version

# 3. Navigate to Terraform directory
cd terraform

# 4. Validate configuration
terraform validate

# 5. Format code (optional)
terraform fmt
```

### Credential Setup (Choose ONE)

#### Option A: Using Files

```powershell
# Windows: Create credentials file
# Create: C:\Users\ASUS\.aws\credentials
# Content:
# [default]
# aws_access_key_id = AKIA...
# aws_secret_access_key = ...

# Windows: Create config file
# Create: C:\Users\ASUS\.aws\config
# Content:
# [default]
# region = eu-north-1
# output = json

# Linux: Create both files
mkdir -p ~/.aws

cat > ~/.aws/credentials << 'EOF'
[default]
aws_access_key_id = AKIA...
aws_secret_access_key = ...
EOF

cat > ~/.aws/config << 'EOF'
[default]
region = eu-north-1
output = json
EOF

chmod 600 ~/.aws/credentials ~/.aws/config
```

#### Option B: Using Environment Variables

```powershell
# Windows PowerShell (temporary)
$env:AWS_ACCESS_KEY_ID = "AKIA..."
$env:AWS_SECRET_ACCESS_KEY = "..."
$env:AWS_DEFAULT_REGION = "eu-north-1"

# Linux/WSL (temporary)
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_DEFAULT_REGION="eu-north-1"

# Make permanent (Linux/WSL)
echo 'export AWS_ACCESS_KEY_ID="AKIA..."' >> ~/.bashrc
echo 'export AWS_SECRET_ACCESS_KEY="..."' >> ~/.bashrc
echo 'export AWS_DEFAULT_REGION="eu-north-1"' >> ~/.bashrc
source ~/.bashrc
```

### Terraform Deployment Commands

```powershell
# 1. Initialize Terraform (if needed again)
terraform init

# 2. Validate configuration
terraform validate

# 3. Format code
terraform fmt -recursive

# 4. Check plan (preview changes)
terraform plan

# 5. Save plan to file (optional)
terraform plan -out=tfplan

# 6. Apply plan (create infrastructure)
terraform apply

# 7. Apply saved plan
terraform apply tfplan

# 8. Get output values
terraform output

# 9. Get specific output
terraform output cluster_name
terraform output instance_ips

# 10. Refresh state
terraform refresh

# 11. Destroy infrastructure (CAREFUL!)
terraform destroy

# 12. Destroy without confirmation
terraform destroy -auto-approve
```

### Terraform State Management

```powershell
# 1. Show current state
terraform state list

# 2. Show specific resource
terraform state show aws_vpc.main

# 3. Remove from state (without destroying)
terraform state rm aws_instance.example

# 4. Move resource
terraform state mv aws_instance.old aws_instance.new

# 5. Lock state file
terraform state lock

# 6. Pull remote state
terraform state pull

# 7. Push state
terraform state push
```

### Debugging Commands

```powershell
# 1. Enable debug logging
$env:TF_LOG = "DEBUG"

# 2. Enable trace logging
$env:TF_LOG = "TRACE"

# 3. Disable logging
$env:TF_LOG = ""

# 4. Show detailed plan
terraform plan -detailed-exitcode

# 5. Graph resources
terraform graph

# 6. Validate JSON
terraform validate -json

# 7. Show resource dependencies
terraform graph | dot -Tsvg > graph.svg
```

### AWS CLI Verification (After Credentials Setup)

```powershell
# 1. Test AWS credentials
aws sts get-caller-identity

# 2. List EC2 instances
aws ec2 describe-instances --region eu-north-1

# 3. Get account ID
aws sts get-caller-identity --query Account --output text

# 4. List VPCs
aws ec2 describe-vpcs --region eu-north-1

# 5. List key pairs
aws ec2 describe-key-pairs --region eu-north-1
```

### Terraform Variable Commands

```powershell
# 1. Plan with variables
terraform plan -var "aws_region=eu-north-1"

# 2. Plan with variable file
terraform plan -var-file="terraform.tfvars"

# 3. Set variables from environment
$env:TF_VAR_aws_region = "eu-north-1"
terraform plan

# 4. Show variables
terraform vars

# 5. Validate variables
terraform validate -var "key_pair_name=my-key"
```

### SSH Commands (After Deployment)

```bash
# 1. SSH into EC2 instance
ssh -i /path/to/key.pem ec2-user@13.53.188.143

# 2. Copy file to instance
scp -i /path/to/key.pem file.txt ec2-user@13.53.188.143:/home/ec2-user/

# 3. Copy from instance
scp -i /path/to/key.pem ec2-user@13.53.188.143:/path/to/file.txt .

# 4. SSH without host key prompt
ssh -o StrictHostKeyChecking=no -i key.pem ec2-user@13.53.188.143

# 5. Port forwarding
ssh -i key.pem -L 8080:localhost:80 ec2-user@13.53.188.143
```

### Docker Commands (On EC2)

```bash
# 1. Check Docker status
docker ps

# 2. View Docker logs
docker logs container_id

# 3. Pull image
docker pull lashan123/backend:latest

# 4. Run container
docker run -d -p 5000:5000 lashan123/backend:latest

# 5. Stop container
docker stop container_id

# 6. Remove container
docker rm container_id

# 7. View Docker Compose
docker-compose ps

# 8. Start services
docker-compose up -d

# 9. Stop services
docker-compose down
```

### Git Commands (After Terraform)

```powershell
# 1. Stage changes
git add .

# 2. Commit changes
git commit -m "feat: initialize terraform for eu-north-1"

# 3. Push to GitHub
git push origin main

# 4. View status
git status

# 5. View logs
git log --oneline
```

---

## 🎯 Command Sequences

### Sequence 1: Full Deployment

```powershell
# Step 1: Prepare
cd "C:\Users\ASUS\Desktop\Royal Stay Hotels\Devops\terraform"

# Step 2: Create credential files (use templates above)
# Create: ~/.aws/credentials
# Create: ~/.aws/config
# Create: terraform/terraform.tfvars

# Step 3: Validate
terraform validate

# Step 4: Plan
terraform plan

# Step 5: Apply
terraform apply

# Step 6: Get outputs
terraform output
```

### Sequence 2: Quick Check

```powershell
# All-in-one check
cd terraform ; terraform validate ; terraform plan -var-file=terraform.tfvars
```

### Sequence 3: Cleanup

```powershell
# Remove all infrastructure
cd terraform
terraform destroy
# or without prompt
terraform destroy -auto-approve
```

---

## 📝 File Creation Commands

### Create AWS Credentials (Windows)

```powershell
# Create .aws directory
mkdir $env:USERPROFILE\.aws

# Create credentials file
@"
[default]
aws_access_key_id = AKIA_YOUR_KEY_HERE
aws_secret_access_key = YOUR_SECRET_KEY_HERE
"@ | Set-Content -Path "$env:USERPROFILE\.aws\credentials"

# Create config file
@"
[default]
region = eu-north-1
output = json
"@ | Set-Content -Path "$env:USERPROFILE\.aws\config"
```

### Create terraform.tfvars (Windows)

```powershell
@"
aws_region    = "eu-north-1"
key_pair_name = "your-key-pair"
ssh_public_key = "ssh-rsa AAAAB3..."
docker_user   = "lashan123"
"@ | Set-Content -Path "terraform/terraform.tfvars"
```

### Create terraform.tfvars (Linux)

```bash
cat > terraform/terraform.tfvars << 'EOF'
aws_region    = "eu-north-1"
key_pair_name = "your-key-pair"
ssh_public_key = "ssh-rsa AAAAB3..."
docker_user   = "lashan123"
EOF
```

---

## 🚀 Quick Copy-Paste Commands

### For Quick Setup (Windows)

```powershell
# 1. Navigate
cd "C:\Users\ASUS\Desktop\Royal Stay Hotels\Devops\terraform"

# 2. Validate
terraform validate

# 3. Plan (after creating credential files)
terraform plan

# 4. Apply (after reviewing plan)
terraform apply
```

### For Quick Setup (Linux/WSL)

```bash
# 1. Navigate
cd ~/path/to/Devops/terraform

# 2. Set environment variables
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_DEFAULT_REGION="eu-north-1"

# 3. Validate
terraform validate

# 4. Plan
terraform plan

# 5. Apply
terraform apply
```

---

## ⚠️ Dangerous Commands (Use Carefully!)

```powershell
# DANGER: Destroy all infrastructure
terraform destroy -auto-approve

# DANGER: Force unlock state
terraform force-unlock LOCK_ID

# DANGER: Delete state file (not recommended)
rm terraform.tfstate*

# DANGER: Taint resource (forces recreation)
terraform taint aws_vpc.main
```

---

## 📊 Common Issues & Commands to Fix

```powershell
# Issue: Terraform not found
# Fix:
# Windows: Add C:\Users\ASUS\terraform to PATH

# Issue: Credentials not found
# Fix:
aws configure
# or manually create ~/.aws/credentials

# Issue: Module not found
# Fix:
terraform init -upgrade

# Issue: State conflicts
# Fix:
terraform refresh
terraform apply -refresh-only

# Issue: Want to check before applying
# Fix:
terraform plan -out=tfplan
# Review tfplan, then:
terraform apply tfplan
```

---

## 🎓 Learning Commands

```powershell
# 1. Show help
terraform help

# 2. Show command help
terraform apply -help

# 3. Show version
terraform version

# 4. Check provider versions
terraform providers

# 5. Show state
terraform state list

# 6. Show state details
terraform state show

# 7. Show configuration
terraform show

# 8. Format check
terraform fmt -check
```

---

## 💡 Pro Tips

```powershell
# 1. Always plan before apply
terraform plan -out=tfplan

# 2. Use -auto-approve carefully
terraform apply -auto-approve  # Auto-approves without confirmation

# 3. Save outputs to file
terraform output -json > outputs.json

# 4. Check differences
terraform plan | grep -E "^\s+[+-]"

# 5. Unlock if stuck
terraform force-unlock <LOCK_ID>

# 6. Debug mode
$env:TF_LOG = "DEBUG"
terraform plan
$env:TF_LOG = ""

# 7. Import existing resource
terraform import aws_instance.example i-1234567890abcdef0
```

---

**Keep this file handy - reference it while deploying!**
