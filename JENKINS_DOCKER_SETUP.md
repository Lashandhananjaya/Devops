# Jenkins Docker Socket Access Fix

## Issue
The Jenkins pipeline fails with: `ERROR: permission denied while trying to connect to the docker API at unix:///var/run/docker.sock`

## Root Cause
The Jenkins user doesn't have permission to access the Docker socket (`/var/run/docker.sock`).

## Solution

### 1. Add Jenkins User to Docker Group (Recommended)
On the Jenkins server, run:

```bash
# Add jenkins user to docker group
sudo usermod -aG docker jenkins

# Restart Jenkins to apply group changes
sudo systemctl restart jenkins
```

### 2. Verify the Fix
After restart, check if the jenkins user can access Docker:

```bash
# SSH into Jenkins server
ssh -i your-key jenkins@jenkins-server

# Test Docker access
docker ps

# Check group membership
groups jenkins
```

### 3. Re-run the Pipeline
Once the fix is applied, trigger the Jenkins pipeline again by pushing a commit or clicking "Build Now".

## Why This Works
- The Docker daemon creates `/var/run/docker.sock` with permissions readable only by the docker group
- Adding the jenkins user to the docker group grants it permission to access the socket
- No `sudo` is needed when the user is in the docker group

## For Docker Compose
If using Docker Compose, the same fix applies - the jenkins user needs docker group access.

## Security Note
⚠️ **Important**: Being in the docker group is equivalent to having root access. Only add trusted users to the docker group.

