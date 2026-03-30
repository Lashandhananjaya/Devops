# AWS Credentials Configuration for Terraform

## 📋 Quick Setup Steps

Since AWS CLI installation had issues, let's configure credentials directly for Terraform.

### Step 1: Create AWS Credentials File

**Windows:** Create file `C:\Users\ASUS\.aws\credentials`

```
[default]
aws_access_key_id = AKIA...YOUR_KEY_HERE...
aws_secret_access_key = YOUR_SECRET_KEY_HERE
```

**Linux/WSL:** Create file `~/.aws/credentials`

```
[default]
aws_access_key_id = AKIA...YOUR_KEY_HERE...
aws_secret_access_key = YOUR_SECRET_KEY_HERE
```

### Step 2: Create AWS Config File

**Windows:** Create file `C:\Users\ASUS\.aws\config`

```
[default]
region = eu-north-1
output = json
```

**Linux/WSL:** Create file `~/.aws/config`

```
[default]
region = eu-north-1
output = json
```

### Step 3: Create Terraform Variables File

Create file: `C:\Users\ASUS\Desktop\Royal Stay Hotels\Devops\terraform\terraform.tfvars`

```hcl
aws_region    = "eu-north-1"
key_pair_name = "your-ec2-key-pair-name"
ssh_public_key = "ssh-rsa AAAAB3NzaC1yc2E... (your full public key)"
docker_user   = "lashan123"
```

---

## 🔑 Where to Get Your AWS Keys

### Get AWS Access Key ID & Secret Key:

1. **Go to:** https://console.aws.amazon.com/
2. **Click your account name** (top right) → **Security Credentials**
3. **Under "Access keys"** → Click **"Create access key"**
4. **Copy immediately:**
   - Access Key ID (starts with `AKIA`)
   - Secret Access Key (40 characters, only visible once!)

⚠️ **IMPORTANT:** If you lose the secret key, you must create a new pair!

---

## 🔧 Directory Structure After Setup

```
C:\Users\ASUS\
├── .aws/
│   ├── credentials          ← Create this with your keys
│   └── config              ← Create this with region config
│
└── Desktop/Royal Stay Hotels/Devops/
    └── terraform/
        ├── provider.tf     (region = eu-north-1)
        ├── variables.tf
        ├── main.tf
        ├── output.tf
        └── terraform.tfvars  ← Create this with your values
```

---

## ✅ Verification Steps

### 1. Check Credentials File Exists
```powershell
# Windows
Test-Path $env:USERPROFILE\.aws\credentials
Test-Path $env:USERPROFILE\.aws\config

# Should return: True
```

### 2. Try Terraform Plan
```powershell
cd "C:\Users\ASUS\Desktop\Royal Stay Hotels\Devops\terraform"

# Run plan (don't apply yet)
terraform plan

# If no errors, credentials are configured!
```

---

## 🚀 After Configuration Complete

### Run Terraform Commands

```powershell
# 1. Check what will be created
terraform plan

# 2. Create the infrastructure
terraform apply

# 3. View outputs
terraform output
```

---

## 🔒 Security Notes

⚠️ **DO NOT:**
- Share your Access Key ID or Secret Key with anyone
- Commit `.aws/credentials` to Git
- Paste credentials in chat/email

✅ **DO:**
- Keep `.aws/credentials` file secure (permissions: 600)
- Store `.aws` in `.gitignore`
- Rotate keys every 90 days
- Create separate keys for Jenkins (least privilege)

---

## 📝 Template Files to Create

### File 1: `C:\Users\ASUS\.aws\credentials`
```
[default]
aws_access_key_id = AKIA2ABCDEFGHIJKLMNO
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY
```

### File 2: `C:\Users\ASUS\.aws\config`
```
[default]
region = eu-north-1
output = json
```

### File 3: `terraform/terraform.tfvars`
```hcl
aws_region    = "eu-north-1"
key_pair_name = "royal-stay-key"
ssh_public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDi1..."
docker_user   = "lashan123"
```

---

## 🆘 Troubleshooting

### "Error: Unable to locate credentials"
→ Create `.aws/credentials` file with your keys

### "Error: InvalidClientTokenId"
→ Your Access Key ID is wrong or disabled

### "Error: SignatureDoesNotMatch"
→ Your Secret Access Key is wrong

### "terraform plan" shows no changes
→ Good! Means credentials are working

---

**Create these files and Terraform will work! ✨**
