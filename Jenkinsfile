pipeline {
    agent any

    parameters {
        string(name: 'AWS_REGION', defaultValue: 'us-east-1', description: 'AWS region for Terraform (infra/)')
        string(name: 'KEY_PAIR_NAME', defaultValue: 'Royal_Stay_Hotels', description: 'AWS EC2 key pair name to create/use')
        text(name: 'SSH_PUBLIC_KEY', defaultValue: '', description: 'Optional: SSH public key material for EC2 access (e.g., contents of id_rsa.pub). If empty, Jenkins will derive it from the ec2-ssh-key private key.')
        string(name: 'ALLOWED_SSH_CIDR', defaultValue: '0.0.0.0/0', description: 'CIDR allowed for SSH (22)')
        string(name: 'ALLOWED_HTTP_CIDR', defaultValue: '0.0.0.0/0', description: 'CIDR allowed for app ports (8081, 3000)')
        booleanParam(name: 'TERRAFORM_APPLY', defaultValue: true, description: 'If false, skip Terraform apply (deploy only)')
    }

    environment {
        DOCKER_REPO = "lashan123"
        TF_VERSION  = "1.7.5"
    }

    stages {

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
                  ./scripts/build.sh
                '''
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                      chmod +x scripts/push.sh
                      ./scripts/push.sh $DOCKER_USER $DOCKER_PASS
                    '''
                }
            }
        }

        stage('Provision Infrastructure (Terraform)') {
            when {
                expression { return params.TERRAFORM_APPLY }
            }

            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ec2-ssh-key',
                        keyFileVariable: 'EC2_KEY',
                        usernameVariable: 'EC2_USER'
                    ),
                    aws(
                        credentialsId: 'aws-credentials',
                        accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                        secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
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

                    script {
                        def ec2Ip = readFile('/tmp/ec2_ip.txt').trim()
                        if (!ec2Ip) {
                            error('Terraform output instance_public_ip was empty')
                        }
                        env.EC2_IP = ec2Ip
                        echo "Terraform provisioned EC2_IP=${env.EC2_IP}"
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ec2-ssh-key',
                        keyFileVariable: 'EC2_KEY',
                        usernameVariable: 'EC2_USER'
                    )
                ]) {
                    sh '''
                      set -e
                      if [ -z "${EC2_IP}" ]; then
                        echo "ERROR: EC2_IP is empty. Run Terraform stage (or set EC2_IP via environment)."
                        exit 1
                      fi

                      chmod 600 $EC2_KEY

                      scp -o StrictHostKeyChecking=no -i $EC2_KEY \
                        scripts/deploy.sh \
                        $EC2_USER@$EC2_IP:/home/$EC2_USER/deploy.sh

                      ssh -o StrictHostKeyChecking=no -i $EC2_KEY \
                        $EC2_USER@$EC2_IP \
                        "chmod +x ~/deploy.sh && DOCKER_REPO=$DOCKER_REPO ~/deploy.sh"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "CI/CD pipeline completed successfully 🎉"
        }
        failure {
            echo "Pipeline failed ❌ Check Jenkins console output."
        }
    }
}
