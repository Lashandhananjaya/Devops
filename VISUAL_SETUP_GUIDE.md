# 🎨 Visual Setup Guide

## Step 1: Get AWS Keys (2 minutes)

```
┌─────────────────────────────────────┐
│  AWS Console                        │
│  https://console.aws.amazon.com     │
└─────────────┬───────────────────────┘
              │
              ├─→ Account Name (top right)
              │
              ├─→ Security Credentials
              │
              ├─→ Access Keys
              │
              ├─→ Create Access Key
              │
              ├─→ Copy Access Key ID (AKIA...)
              │
              └─→ Copy Secret Access Key
                  ⚠️  Only visible ONCE!
```

---

## Step 2: Create Files (3 minutes)

```
Your Computer
│
├─ C:\Users\ASUS\.aws\
│  │
│  ├─ credentials         ← Create this file
│  │   [default]
│  │   aws_access_key_id = AKIA...
│  │   aws_secret_access_key = ...
│  │
│  └─ config              ← Create this file
│      [default]
│      region = eu-north-1
│
└─ C:\Users\ASUS\Desktop\Royal Stay Hotels\Devops\terraform\
   │
   └─ terraform.tfvars    ← Create this file
      aws_region = "eu-north-1"
      key_pair_name = "your-key"
      ssh_public_key = "ssh-rsa..."
      docker_user = "lashan123"
```

---

## Step 3: Run Terraform (20 minutes)

```
Terminal
│
├─ terraform plan         ← Preview changes (no changes made)
│  │
│  ├─ Downloads AWS configuration
│  ├─ Checks current state
│  ├─ Shows what will be created
│  └─ Prompts for approval
│
├─ terraform apply        ← Create infrastructure
│  │
│  ├─ Creates VPC
│  ├─ Creates EKS Cluster
│  ├─ Creates Security Groups
│  ├─ Creates EC2 Key Pair
│  └─ Writes state to .tfstate
│
└─ terraform output       ← Get IP addresses
   │
   └─ Shows: EC2 IPs, Security Groups, etc.
```

---

## What Gets Created in AWS

```
AWS eu-north-1 Region
│
├─ VPC (10.0.0.0/16)
│  │
│  ├─ Public Subnets
│  │  ├─ eu-north-1a: 10.0.101.0/24
│  │  └─ eu-north-1b: 10.0.102.0/24
│  │
│  ├─ Private Subnets
│  │  ├─ eu-north-1a: 10.0.1.0/24
│  │  └─ eu-north-1b: 10.0.2.0/24
│  │
│  └─ NAT Gateway
│
├─ EKS Cluster
│  ├─ Name: room-booking-eks
│  ├─ Version: 1.29
│  └─ Nodes: 2 × t3.medium
│
├─ Security Groups
│  ├─ For VPC
│  └─ For Nodes
│
└─ EC2 Key Pair
   └─ For SSH access
```

---

## Directory Tree After Setup

```
Your Project
│
├─ terraform/
│  ├─ .terraform/              ✅ Downloaded
│  │  ├─ modules/
│  │  └─ plugins/
│  │
│  ├─ .terraform.lock.hcl      ✅ Created
│  ├─ provider.tf              ✅ Updated (eu-north-1)
│  ├─ variables.tf             ✅ Updated (eu-north-1)
│  ├─ main.tf                  ✅ Ready (AZs eu-north-1a/b)
│  ├─ output.tf                ✅ Ready
│  ├─ terraform.tfvars         ⏳ YOU CREATE
│  └─ terraform.tfstate        ✅ Created after apply
│
└─ .aws/                       ⏳ YOU CREATE
   ├─ credentials              ⏳ YOU CREATE (your AWS keys)
   └─ config                   ⏳ YOU CREATE (region config)
```

---

## File Creation Checklist

```
┌─────────────────────────────────────────────┐
│ BEFORE running terraform apply              │
├─────────────────────────────────────────────┤
│                                             │
│  ☐ ~/.aws/credentials exists               │
│    - aws_access_key_id = AKIA...           │
│    - aws_secret_access_key = ...           │
│                                             │
│  ☐ ~/.aws/config exists                    │
│    - region = eu-north-1                   │
│    - output = json                         │
│                                             │
│  ☐ terraform/terraform.tfvars exists       │
│    - aws_region = "eu-north-1"             │
│    - key_pair_name = "your-key"            │
│    - ssh_public_key = "ssh-rsa..."         │
│    - docker_user = "lashan123"             │
│                                             │
│  ☐ All values filled in correctly          │
│  ☐ No extra spaces or line breaks          │
│  ☐ No special characters in paths          │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Command Sequence Flow

```
START
  │
  ├─→ cd terraform
  │
  ├─→ terraform plan
  │    │
  │    ├─ Reads .aws/credentials ✅
  │    ├─ Reads .aws/config ✅
  │    ├─ Reads terraform.tfvars ✅
  │    ├─ Connects to AWS ✅
  │    ├─ Downloads current state
  │    ├─ Calculates changes
  │    └─ Shows preview
  │
  ├─→ Review output
  │    │
  │    ├─ VPC will be created
  │    ├─ EKS cluster will be created
  │    ├─ Security groups will be created
  │    └─ Looks good? Continue
  │
  ├─→ terraform apply
  │    │
  │    ├─ Creates resources in AWS
  │    ├─ Takes 15-20 minutes
  │    ├─ Shows progress
  │    └─ Saves state to .tfstate
  │
  ├─→ terraform output
  │    │
  │    ├─ Gets EC2 IP addresses
  │    ├─ Gets cluster information
  │    └─ Shows how to access
  │
  └─→ SUCCESS! Infrastructure ready
```

---

## Error Recovery Flow

```
IF terraform plan FAILS
│
├─ Error: "No credential sources found"
│  └─→ Create ~/.aws/credentials file
│
├─ Error: "Unable to locate credentials"
│  └─→ Restart terminal after creating files
│
├─ Error: "InvalidClientTokenId"
│  └─→ Check Access Key ID is correct
│
├─ Error: "SignatureDoesNotMatch"
│  └─→ Check Secret Access Key is correct
│
└─ IF ALL ELSE FAILS
   └─→ Use Environment Variables instead:
       $env:AWS_ACCESS_KEY_ID = "AKIA..."
       $env:AWS_SECRET_ACCESS_KEY = "..."
       $env:AWS_DEFAULT_REGION = "eu-north-1"
```

---

## Success Indicators

```
✅ terraform plan shows no errors
✅ Plan shows resources to be created
✅ terraform apply starts without auth errors
✅ Resources appear in AWS Console
✅ terraform output shows IP addresses
✅ Can SSH to instance: ssh -i key.pem ec2-user@IP
✅ Application can be accessed at http://IP
```

---

## Time Breakdown

```
Getting AWS Keys:           2 minutes  ⏱️
Creating 3 files:           3 minutes  ⏱️
Running terraform plan:     3 minutes  ⏱️
Running terraform apply:   20 minutes  ⏱️ (largest)
─────────────────────────────────────
TOTAL:                     28 minutes  🎉
```

---

## Next: After Terraform Completes

```
Terraform Outputs
├─ cluster_name: room-booking-eks
├─ cluster_endpoint: https://...
├─ cluster_region: eu-north-1
└─ EC2 IP addresses: 13.53.xxx.xxx

Then:
├─ SSH into instance
├─ Install Docker
├─ Deploy application
├─ Access via browser
└─ Monitor in CloudWatch
```

---

## 🎯 Start Here

1. Read this visual guide (5 min)
2. Open [QUICK_REFERENCE.txt](QUICK_REFERENCE.txt) (2 min)
3. Follow [NEXT_STEPS_AWS.md](NEXT_STEPS_AWS.md) (10 min)
4. Create the 3 files (3 min)
5. Run terraform commands (25 min)

**Total: ~45 minutes to running infrastructure!**

---

**Ready? Let's go! 🚀**
