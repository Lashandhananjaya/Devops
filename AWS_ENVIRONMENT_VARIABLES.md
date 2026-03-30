# Alternative: Use Environment Variables Instead of Credentials File

If you prefer not to create the `.aws/credentials` file, you can use **environment variables** instead.

## Option: Set Environment Variables

### Windows PowerShell

```powershell
# Set environment variables (valid for current PowerShell session only)
$env:AWS_ACCESS_KEY_ID = "your-access-key-id"
$env:AWS_SECRET_ACCESS_KEY = "your-secret-access-key"
$env:AWS_DEFAULT_REGION = "eu-north-1"

# Verify they're set
echo $env:AWS_ACCESS_KEY_ID
echo $env:AWS_SECRET_ACCESS_KEY
echo $env:AWS_DEFAULT_REGION
```

### Windows (Permanent - System Environment Variables)

1. **Search for:** "Environment Variables"
2. **Click:** "Edit the system environment variables"
3. **Click:** "Environment Variables..." button
4. **Under "User variables" or "System variables"**, click "New"
5. **Create these variables:**
   ```
   Variable name:  AWS_ACCESS_KEY_ID
   Variable value: AKIA...YOUR_KEY...

   Variable name:  AWS_SECRET_ACCESS_KEY
   Variable value: YOUR_SECRET_KEY

   Variable name:  AWS_DEFAULT_REGION
   Variable value: eu-north-1
   ```
6. **Click OK** and restart PowerShell

### Linux/WSL

```bash
# Set for current session
export AWS_ACCESS_KEY_ID="your-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-secret-access-key"
export AWS_DEFAULT_REGION="eu-north-1"

# Make permanent (add to ~/.bashrc or ~/.zshrc)
echo 'export AWS_ACCESS_KEY_ID="your-access-key-id"' >> ~/.bashrc
echo 'export AWS_SECRET_ACCESS_KEY="your-secret-access-key"' >> ~/.bashrc
echo 'export AWS_DEFAULT_REGION="eu-north-1"' >> ~/.bashrc

source ~/.bashrc
```

---

## ✅ Then Test With Terraform

```powershell
cd "C:\Users\ASUS\Desktop\Royal Stay Hotels\Devops\terraform"

# This will use the environment variables
terraform plan
```

---

## ⚠️ Comparison: Which Method to Use?

| Method | Pros | Cons |
|--------|------|------|
| **Credentials File** (`.aws/credentials`) | - Persistent<br>- Secure<br>- Best practice<br>- Works everywhere | - Need to create folder |
| **Environment Variables** | - Quick<br>- Temporary<br>- No files to manage | - Visible in process list<br>- Lost on restart (if temporary) |
| **Both (Recommended)** | - Best of both | - Takes more setup |

---

## 🎯 Recommendation

**Use both methods:**
1. Create `.aws/credentials` for persistence
2. Can still use env variables for Jenkins/scripts

This way Terraform works from anywhere!

---

**Pick whichever method works for you, then run `terraform plan`!** ✨
