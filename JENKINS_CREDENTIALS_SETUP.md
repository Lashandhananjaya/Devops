# Jenkins AWS Credentials Setup Guide

## Prerequisites
- Jenkins instance running and accessible
- AWS Access Key ID and Secret Key
- EC2 SSH private key (.pem file)

---

## Option 1: Manual Setup via Jenkins UI

### Step 1: Add AWS Credentials (Username & Password)

1. **Log into Jenkins:**
   - Open browser: `http://<jenkins-ip>:8080`
   - Log in with Jenkins admin credentials

2. **Navigate to Credentials Section:**
   - Click: **Dashboard** (top left)
   - Click: **Manage Jenkins** (left sidebar)
   - Click: **Manage Credentials**
   - Click: **System** (under "Stores scoped to Jenkins")
   - Click: **Global credentials (unrestricted)**

3. **Add AWS Credentials:**
   - Click: **+ Add Credentials** (left sidebar)
   - Fill in the form:
     ```
     Kind:               Username and password
     Username:           <Your AWS Access Key ID>
     Password:           <Your AWS Secret Access Key>
     ID:                 aws-credentials
     Description:        AWS Account - Royal Stay Hotels
     Scope:              Global
     ```
   - Click: **Create**

### Step 2: Add EC2 SSH Private Key Credentials

1. **Get SSH Private Key Content:**
   - Open your EC2 key pair file (e.g., `royal-stay-key.pem`)
   - Copy the entire content (from `-----BEGIN RSA PRIVATE KEY-----` to `-----END RSA PRIVATE KEY-----`)

2. **Add SSH Credential in Jenkins:**
   - Click: **+ Add Credentials** (left sidebar)
   - Fill in the form:
     ```
     Kind:               SSH Username with private key
     Username:           ec2-user
     Private Key:        (Select "Enter directly")
     Key:                (Paste the entire .pem file content)
     Passphrase:         (Leave empty if key has no passphrase)
     ID:                 ec2-ssh-key
     Description:        EC2 SSH Key - Royal Stay Hotels
     Scope:              Global
     ```
   - Click: **Create**

3. **Verify Credentials:**
   - Go back to: **Global credentials**
   - You should see:
     - ✅ `aws-credentials` (username/password)
     - ✅ `ec2-ssh-key` (SSH key)

---

## Option 2: Automated Setup via Jenkins Groovy Script

If you want to automate the credential creation, use this approach:

### Using Jenkins Script Console

1. **Log into Jenkins:**
   - `http://<jenkins-ip>:8080`

2. **Navigate to Script Console:**
   - **Manage Jenkins** → **Script Console**

3. **Run the Groovy Script:**
   - Copy the script from [jenkins-add-credentials.groovy](jenkins-add-credentials.groovy)
   - Paste into Script Console
   - Click: **Run**

---

## Option 3: Using Jenkins Configuration as Code (JCasC)

For production Jenkins setups, use YAML configuration:

1. **Create Jenkins ConfigMap (if using Kubernetes):**
   ```yaml
   # jenkins-casc-config.yaml
   credentials:
     system:
       domainCredentials:
         - credentials:
             - aws:
                 accessKey: "${AWS_ACCESS_KEY_ID}"
                 secretKey: "${AWS_SECRET_ACCESS_KEY}"
                 id: "aws-credentials"
                 description: "AWS Account - Royal Stay Hotels"
             - basicSSHUserPrivateKey:
                 id: "ec2-ssh-key"
                 username: "ec2-user"
                 privateKeySource:
                   directEntry:
                     privateKey: "${EC2_PRIVATE_KEY}"
   ```

2. **Or for Docker Compose:**
   ```dockerfile
   # In Dockerfile
   ENV CASC_JENKINS_CONFIG=/var/jenkins_home/casc.yaml
   COPY casc.yaml /var/jenkins_home/casc.yaml
   ```

---

## Verification Steps

### Verify AWS Credentials Work

1. **Via Jenkins Pipeline:**
   - Create new Pipeline job
   - Script:
   ```groovy
   pipeline {
       agent any
       stages {
           stage('Test AWS Credentials') {
               steps {
                   withCredentials([
                       usernamePassword(
                           credentialsId: 'aws-credentials',
                           usernameVariable: 'AWS_ACCESS_KEY_ID',
                           passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                       )
                   ]) {
                       sh '''
                           echo "AWS Credentials loaded successfully"
                           # Install AWS CLI if not present
                           which aws || pip install awscli
                           # Test AWS access
                           aws sts get-caller-identity --region eu-north-1
                       '''
                   }
               }
           }
       }
   }
   ```

2. **Via Jenkins Script Console:**
   ```groovy
   import jenkins.model.Jenkins
   import com.cloudbees.plugins.credentials.CredentialsProvider
   import com.cloudbees.plugins.credentials.domains.Domain

   def store = Jenkins.instance.getExtensionList('com.cloudbees.plugins.credentials.SystemCredentialsProvider')[0].getStore()
   def awsCreds = CredentialsProvider.lookupCredentials(null, Jenkins.instance, null, null)

   awsCreds.each { cred ->
       if (cred.id == 'aws-credentials') {
           println "✓ AWS Credentials found: ${cred.description}"
       }
       if (cred.id == 'ec2-ssh-key') {
           println "✓ EC2 SSH Key found: ${cred.description}"
       }
   }
   ```

### Verify SSH Key Works

1. **Via Jenkins Pipeline:**
   ```groovy
   pipeline {
       agent any
       stages {
           stage('Test SSH Connection') {
               steps {
                   withCredentials([
                       sshUserPrivateKey(
                           credentialsId: 'ec2-ssh-key',
                           keyFileVariable: 'EC2_KEY',
                           usernameVariable: 'EC2_USER'
                       )
                   ]) {
                       sh '''
                           chmod 600 $EC2_KEY
                           # Test SSH to app instance
                           ssh -o StrictHostKeyChecking=no \
                               -i $EC2_KEY \
                               $EC2_USER@13.53.188.143 \
                               "echo 'SSH Connection Successful' && uptime"
                       '''
                   }
               }
           }
       }
   }
   ```

---

## Troubleshooting

### Issue: "Credentials not found"
**Solution:**
```bash
# Check credential IDs match in Jenkinsfile
# Verify credentials are in Global scope, not folder scope
# Check Jenkins logs: /var/log/jenkins/jenkins.log
```

### Issue: AWS credentials wrong format
**Solution:**
```bash
# Verify Access Key ID format: AKIA... (20 characters)
# Verify Secret Key is the full secret, not truncated
# Check for extra spaces or newlines when pasting
```

### Issue: SSH key permission denied
**Solution:**
```bash
# Ensure key format is correct (RSA, not OpenSSH format)
# Check passphrase - if key has one, provide it in Jenkins
# Verify username matches EC2 AMI (ec2-user for Amazon Linux, ubuntu for Ubuntu)
```

### Issue: "Cannot open keyfile" error
**Solution:**
```bash
# In Jenkins Groovy script, use "Enter directly" option
# Not "Upload existing key" if having path issues
# Ensure no hidden characters in key content
```

---

## Security Best Practices

1. **Rotate AWS Keys Regularly:**
   - Update credentials every 90 days
   - Keep old keys in case rollback needed

2. **Use IAM Roles Instead (Recommended):**
   - Assign IAM role to Jenkins EC2 instance
   - Remove need for static credentials
   - More secure than storing keys in Jenkins

3. **Encrypt Credentials:**
   - Jenkins automatically encrypts credentials
   - Use strong Jenkins master key
   - Back up Jenkins configuration securely

4. **Restrict Credential Access:**
   - In Jenkins: Manage Credentials → Set permissions
   - Only allow specific projects/users to use credentials

5. **Audit Credential Usage:**
   - Jenkins logs all credential usage
   - Monitor: **Manage Jenkins** → **System Log**

---

## Next Steps

After setting up credentials:
1. ✅ Test credentials with verification pipelines (see Verification section)
2. ✅ Update Jenkinsfile to use `aws-credentials` and `ec2-ssh-key`
3. ✅ Configure GitHub webhook for automatic pipeline triggers
4. ✅ Run the full Royal Stay Hotels deployment pipeline

---

