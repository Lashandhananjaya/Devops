pipeline {
    agent any

    parameters {
        string(name: 'AWS_REGION', defaultValue: 'eu-north-1', description: 'AWS region for Terraform')
        string(name: 'KEY_PAIR_NAME', defaultValue: 'royalstatebookingapp', description: 'AWS EC2 key pair name')
        text(name: 'SSH_PUBLIC_KEY', defaultValue: '', description: 'Optional: SSH public key material for EC2 access (e.g., contents of id_rsa.pub). If empty, Jenkins will derive it from the ec2-ssh-key private key.')
        string(name: 'ALLOWED_SSH_CIDR', defaultValue: '0.0.0.0/0', description: 'CIDR allowed for SSH (22)')
        string(name: 'ALLOWED_HTTP_CIDR', defaultValue: '0.0.0.0/0', description: 'CIDR allowed for app ports (8081, 3000)')
        string(name: 'EC2_IP', defaultValue: '13.53.188.143', description: 'EC2 instance IP for deployment (leave blank to get from AWS)')
        string(name: 'DOCKERHUB_CREDENTIALS_ID', defaultValue: 'dockerhub-credentials', description: 'Jenkins credentials ID for Docker Hub username/password')
        booleanParam(name: 'TERRAFORM_APPLY', defaultValue: false, description: 'If true, run Terraform apply (provision infrastructure). If false, deploy to existing EC2_IP')
    }

    environment {
        DOCKER_REPO = "lashan123"
        TF_VERSION  = "1.7.5"
        EC2_USER    = "ec2-user"
    }

    stages {

        stage('Get EC2 IP') {
            when {
                expression { return !params.TERRAFORM_APPLY }
            }
            steps {
                script {
                    if (params.EC2_IP && params.EC2_IP != '') {
                        env.EC2_IP = params.EC2_IP
                        echo "✓ Using provided EC2_IP: ${env.EC2_IP}"
                    } else {
                        withCredentials([
                            usernamePassword(
                                credentialsId: 'aws-credentials',
                                usernameVariable: 'AWS_ACCESS_KEY_ID',
                                passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                            )
                        ]) {
                            sh '''
                                export AWS_DEFAULT_REGION="${AWS_REGION}"
                                EC2_IP=$(aws ec2 describe-instances \
                                  --filters "Name=instance-state-name,Values=running" \
                                  --query 'Reservations[0].Instances[0].PublicIpAddress' \
                                  --output text)
                                echo "$EC2_IP" > /tmp/ec2_ip.txt
                            '''
                        }
                        env.EC2_IP = readFile('/tmp/ec2_ip.txt').trim()
                        echo "✓ Retrieved EC2_IP from AWS: ${env.EC2_IP}"
                    }
                }
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Lashandhananjaya/Devops.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                  chmod +x scripts/build.sh
                                    DOCKER_REPO=$DOCKER_REPO ./scripts/build.sh
                '''
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    def credentialIdsToTry = [params.DOCKERHUB_CREDENTIALS_ID, 'dockerhub-credentials', 'dockerhub-creds']
                        .findAll { it?.trim() }
                        .unique()

                    def pushed = false
                    def lastError = null

                    for (def credId : credentialIdsToTry) {
                        try {
                            withCredentials([usernamePassword(
                                credentialsId: credId,
                                usernameVariable: 'DOCKER_USER',
                                passwordVariable: 'DOCKER_PASS'
                            )]) {
                                sh '''
                                  chmod +x scripts/push.sh
                                  DOCKER_REPO=$DOCKER_REPO ./scripts/push.sh $DOCKER_USER $DOCKER_PASS
                                '''
                            }
                            echo "Docker push succeeded using credentialsId='${credId}'"
                            pushed = true
                            break
                        } catch (Exception e) {
                            lastError = e
                            if (e.message?.contains('Could not find credentials entry')) {
                                echo "Credentials ID '${credId}' not found. Trying next option..."
                            } else {
                                throw e
                            }
                        }
                    }

                    if (!pushed) {
                        error("Docker Hub credentials not found. Create a Jenkins Username/Password credential and set ID to one of: ${credentialIdsToTry.join(', ')}")
                    }
                }
            }
        }

        stage('Provision Infrastructure (Terraform)') {
            when {
                expression { return params.TERRAFORM_APPLY }
            }

            steps {
                script {
                    try {
                        withCredentials([
                            sshUserPrivateKey(
                                credentialsId: 'ec2-ssh-key',
                                keyFileVariable: 'EC2_KEY',
                                usernameVariable: 'EC2_USER'
                            ),
                            usernamePassword(
                                credentialsId: 'aws-credentials',
                                usernameVariable: 'AWS_ACCESS_KEY_ID',
                                passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                            )
                        ]) {
                            sh '''
                                set -e

                                # If the public key parameter isn't provided, derive it from the same private key used for SSH deploy.
                                if [ -z "${SSH_PUBLIC_KEY}" ]; then
                                    if command -v ssh-keygen >/dev/null 2>&1; then
                                        SSH_PUBLIC_KEY="$(ssh-keygen -y -f "$EC2_KEY" 2>/dev/null || true)"
                                    fi
                                fi

                                if [ -z "${SSH_PUBLIC_KEY}" ]; then
                                    echo "ERROR: SSH_PUBLIC_KEY is empty and could not be derived (is the private key passphrase-protected, or is ssh-keygen missing?)."
                                    echo "Provide SSH_PUBLIC_KEY in the Jenkins job parameters (public key only)."
                                    exit 1
                                fi

                                cat > terraform/terraform.tfvars <<EOF
aws_region       = "${AWS_REGION}"
key_pair_name    = "${KEY_PAIR_NAME}"
ssh_public_key   = <<EOT
${SSH_PUBLIC_KEY}
EOT
docker_user      = "${DOCKER_REPO}"
allowed_ssh_cidr = "${ALLOWED_SSH_CIDR}"
allowed_http_cidr = "${ALLOWED_HTTP_CIDR}"
EOF

                                docker run --rm \
                                  -e AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}" \
                                  -e AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}" \
                                  -v "$WORKSPACE/terraform:/workspace" \
                                  -w /workspace \
                                  hashicorp/terraform:${TF_VERSION} \
                                  init

                                docker run --rm \
                                  -e AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}" \
                                  -e AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}" \
                                  -v "$WORKSPACE/terraform:/workspace" \
                                  -w /workspace \
                                  hashicorp/terraform:${TF_VERSION} \
                                  apply -auto-approve

                                docker run --rm \
                                  -e AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}" \
                                  -e AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}" \
                                  -v "$WORKSPACE/terraform:/workspace" \
                                  -w /workspace \
                                  hashicorp/terraform:${TF_VERSION} \
                                  output -raw instance_public_ip > /tmp/ec2_ip.txt
                            '''

                            def ec2Ip = readFile('/tmp/ec2_ip.txt').trim()
                            if (!ec2Ip) {
                                error('Terraform output instance_public_ip was empty')
                            }
                            env.EC2_IP = ec2Ip
                            echo "Terraform provisioned EC2_IP=${env.EC2_IP}"
                        }
                    } catch (Exception e) {
                        if (e.message.contains('Could not find credentials entry')) {
                            echo "⚠️  AWS credentials not found. To set up AWS credentials in Jenkins:"
                            echo "1. Go to Jenkins Dashboard → Manage Credentials → System → Global credentials"
                            echo "2. Click 'Add Credentials'"
                            echo "3. Select 'Username and password' credential type"
                            echo "4. Username: Your AWS Access Key ID"
                            echo "5. Password: Your AWS Secret Access Key"
                            echo "6. ID: aws-credentials"
                            echo "7. Click 'Create'"
                            echo ""
                            echo "Then re-run the pipeline."
                            currentBuild.result = 'FAILURE'
                            error("Missing AWS credentials: ${e.message}")
                        } else {
                            throw e
                        }
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    withCredentials([
                        sshUserPrivateKey(
                            credentialsId: 'ec2-ssh-key',
                            keyFileVariable: 'EC2_KEY',
                            usernameVariable: 'SSH_USER'
                        )
                    ]) {
                        sh '''
                          set -e
                          
                          if [ -z "${EC2_IP}" ]; then
                            echo "ERROR: EC2_IP is empty. Set EC2_IP parameter or run Terraform stage."
                            exit 1
                          fi

                          echo "📤 Deploying to EC2: ${EC2_IP}"
                          echo "🔐 Using SSH user from credential: ${SSH_USER}"
                          chmod 600 $EC2_KEY

                          # Ensure app directory exists on target host
                          ssh -o StrictHostKeyChecking=no \
                              -o ConnectTimeout=30 \
                              -i $EC2_KEY \
                              ${SSH_USER}@${EC2_IP} \
                              "mkdir -p /home/${SSH_USER}/app"

                          # Copy deployment script
                          scp -o StrictHostKeyChecking=no \
                              -o ConnectTimeout=30 \
                              -i $EC2_KEY \
                              scripts/deploy.sh \
                              ${SSH_USER}@${EC2_IP}:/home/${SSH_USER}/deploy.sh

                          # Copy compose file
                          scp -o StrictHostKeyChecking=no \
                              -o ConnectTimeout=30 \
                              -i $EC2_KEY \
                              docker-compose.yml \
                              ${SSH_USER}@${EC2_IP}:/home/${SSH_USER}/app/docker-compose.yml

                          # Execute deployment
                          ssh -o StrictHostKeyChecking=no \
                              -o ConnectTimeout=30 \
                              -i $EC2_KEY \
                              ${SSH_USER}@${EC2_IP} \
                              "chmod +x ~/deploy.sh && DOCKER_REPO=${DOCKER_REPO} ~/deploy.sh"

                          echo "✓ Deployment to EC2 completed successfully"
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD pipeline completed successfully!"
            echo "📍 Application deployed to: http://${EC2_IP}:3000"
            echo "🔗 API available at: http://${EC2_IP}:8081"
        }
        failure {
            echo "❌ Pipeline failed. Check Jenkins console output for details."
        }
        always {
            cleanWs()
        }
    }
}
