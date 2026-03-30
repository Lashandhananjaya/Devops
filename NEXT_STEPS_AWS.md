# 🎯 Terraform Setup - What To Do Now

## Current Status ✅

- ✅ Terraform v1.7.5 installed
- ✅ Terraform initialized (modules downloaded, providers installed)
- ✅ Configuration validated (syntax correct)
- ✅ Region updated to eu-north-1
- ⏳ **AWS Credentials**: PENDING

---

## 📋 What You Need to Do (3 Simple Steps)

### Step 1️⃣: Get Your AWS Credentials

**Go to:** https://console.aws.amazon.com/

1. Click your **account name** (top right)
2. Click **Security Credentials**
3. Find **Access keys** section
4. Click **Create Access Key**
5. **Copy both immediately:**
   - ✓ Access Key ID (starts with `AKIA`)
   - ✓ Secret Access Key (only visible once!)

Save these securely - you'll use them next.

---

### Step 2️⃣: Create AWS Credentials File

#### On Windows:

1. **Open Notepad**
2. **Create file:** `C:\Users\ASUS\.aws\credentials`
   - (Create `.aws` folder first if it doesn't exist)
3. **Paste this content:**
   ```
   [default]
   aws_access_key_id = PASTE_YOUR_ACCESS_KEY_HERE
   aws_secret_access_key = PASTE_YOUR_SECRET_KEY_HERE
   ```
4. **Replace the values with your actual keys**
5. **Save the file**

#### On Linux/WSL:

```bash
mkdir -p ~/.aws

cat > ~/.aws/credentials << 'EOF'
[default]
aws_access_key_id = PASTE_YOUR_ACCESS_KEY_HERE
aws_secret_access_key = PASTE_YOUR_SECRET_KEY_HERE
EOF

chmod 600 ~/.aws/credentials
```

---

### Step 3️⃣: Create Terraform Variables File

1. **Go to:** `C:\Users\ASUS\Desktop\Royal Stay Hotels\Devops\terraform`
2. **Create new file:** `terraform.tfvars`
3. **Paste this content:**
   ```hcl
   aws_region    = "eu-north-1"
   key_pair_name = "your-ec2-key-pair-name"
   ssh_public_key = "ssh-rsa AAAAB3... (your public key from AWS)"
   docker_user   = "lashan123"
   ```
4. **Replace the values:**
   - `key_pair_name`: Name of your EC2 key pair in AWS
   - `ssh_public_key`: Your EC2 public key content
   - `docker_user`: Keep as `lashan123` (your Docker Hub username)

---

## 🚀 Then Run These Commands

```powershell
# 1. Navigate to Terraform directory
cd "C:\Users\ASUS\Desktop\Royal Stay Hotels\Devops\terraform"

# 2. Preview what will be created
terraform plan

# 3. Create the infrastructure (after confirming plan output)
terraform apply
```

---

## 📁 Files You Need to Create

| File | Location | Content |
|------|----------|---------|
| **credentials** | `C:\Users\ASUS\.aws\credentials` | AWS Access Key ID + Secret |
| **config** | `C:\Users\ASUS\.aws\config` | AWS region & output format |
| **terraform.tfvars** | `terraform/terraform.tfvars` | Terraform variables |

---

## ✅ Verification Checklist

Before running `terraform plan`:

- [ ] AWS credentials file created
- [ ] AWS config file created
- [ ] Terraform tfvars file created
- [ ] All values filled in correctly
- [ ] No extra spaces or special characters in keys

---

## 🎯 What Will Happen When You Run `terraform apply`

Terraform will create in AWS (eu-north-1):

✓ **VPC** with public & private subnets
✓ **EKS Kubernetes Cluster** with 2 nodes
✓ **Security Groups** for networking
✓ **EC2 Key Pair** for SSH access
✓ **NAT Gateway** for outbound traffic

**Estimated time:** 15-20 minutes
**Estimated cost:** ~$50-100/month if always running

---

## 🔗 Reference Documents

- [TERRAFORM_INIT_COMPLETE.md](TERRAFORM_INIT_COMPLETE.md) - Detailed init status
- [COMPLETE_AWS_SETUP_GUIDE.md](COMPLETE_AWS_SETUP_GUIDE.md) - Full AWS integration guide
- [SETUP_AWS_CREDENTIALS.md](SETUP_AWS_CREDENTIALS.md) - Credential setup details

---

## 🆘 Quick Troubleshooting

### "Error: Unable to locate credentials"
→ Create `~/.aws/credentials` file with your keys

### "Error: InvalidClientTokenId"
→ Check your Access Key ID is correct

### "Error: No valid credential sources found"
→ Restart your terminal after creating credentials file

### "terraform plan" takes a long time
→ Normal - it's connecting to AWS for the first time

---

## 💡 Tips

✅ **For testing:** Run `terraform plan` first (doesn't create anything)
✅ **For debugging:** Add `-var-file=terraform.tfvars` to commands
✅ **For cleanup:** Run `terraform destroy` when you want to remove everything
✅ **For state:** Never delete `.terraform/` directory - it tracks your infrastructure

---

## 📞 Next Steps After Terraform Apply

Once infrastructure is created:

1. Get output values:
   ```powershell
   terraform output
   ```

2. SSH into EC2 instance:
   ```bash
   ssh -i your-key.pem ec2-user@INSTANCE_IP
   ```

3. Deploy application using scripts:
   ```bash
   ./scripts/deploy.sh
   ```

---

**You're almost there! Create the 3 files above and you'll be ready to deploy! 🚀**
