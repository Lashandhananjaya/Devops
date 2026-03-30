# AWS Configuration Instructions

## ✅ AWS CLI Installed Successfully

AWS CLI has been installed on your system. Now you need to configure it with your AWS credentials.

---

## 🔑 How to Configure AWS Credentials

You have **TWO options**:

### Option 1: Interactive Configuration (Recommended)
```powershell
# On Windows PowerShell
aws configure

# You'll be prompted to enter:
# AWS Access Key ID: [Paste your AKIA... key]
# AWS Secret Access Key: [Paste your 40-character secret]
# Default region name: eu-north-1
# Default output format: json
```

### Option 2: Create Configuration Files Manually

#### Windows: Create `C:\Users\ASUS\.aws\credentials`
```
[default]
aws_access_key_id = AKIA...YOUR_ACCESS_KEY_ID...
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
```

#### Windows: Create `C:\Users\ASUS\.aws\config`
```
[default]
region = eu-north-1
output = json
```

#### Linux/WSL: Create `~/.aws/credentials`
```
[default]
aws_access_key_id = AKIA...YOUR_ACCESS_KEY_ID...
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
```

#### Linux/WSL: Create `~/.aws/config`
```
[default]
region = eu-north-1
output = json
```

---

## ✅ Verify Configuration Works

After configuring, test your credentials:

```powershell
# Test AWS CLI access
aws sts get-caller-identity

# Expected output (shows your AWS Account ID):
{
    "UserId": "AIDAJ...",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/your-username"
}
```

If you see this output, your AWS credentials are correctly configured! ✅

---

## ⚠️ Troubleshooting

### Error: "Unable to locate credentials"
- Run `aws configure` to set up credentials
- Or manually create the files above

### Error: "Invalid Access Key ID"
- Check your Access Key ID starts with `AKIA`
- Verify you didn't accidentally paste extra spaces

### Error: "The authorization header is malformed"
- Check your Secret Access Key is correct
- Make sure there are no line breaks in the middle

---

## 🔐 Security Notes

- ✅ Never commit `.aws/credentials` to Git
- ✅ Add `~/.aws/credentials` to `.gitignore`
- ✅ Keep your access keys secret and secure
- ✅ Rotate keys periodically (every 90 days recommended)

---

## 📋 Where to Get Your AWS Keys

1. **Go to AWS Console:** https://console.aws.amazon.com/
2. **Click your account name** (top right) → **Security Credentials**
3. **Access Keys (Access Key ID and Secret Access Key)**
4. **Click "Create Access Key"** if you don't have one
5. **Copy both values immediately** (Secret only shows once!)

---

## 🚀 Next Steps After Configuration

Once AWS credentials are configured:

```powershell
# 1. Navigate to Terraform directory
cd "c:\Users\ASUS\Desktop\Royal Stay Hotels\Devops\terraform"

# 2. Create terraform.tfvars file with your values
# (See TERRAFORM_INIT_COMPLETE.md for details)

# 3. Run Terraform plan
terraform plan

# 4. Review the planned changes

# 5. Run Terraform apply
terraform apply
```

---

**Configure your AWS credentials now, then you can run `terraform plan` and `terraform apply`!**
