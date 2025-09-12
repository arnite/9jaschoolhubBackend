pipeline {
    agent any

    environment {
        REGISTRY = "162.246.19.130:8083"
        IMAGE = "my-node-app"
        DEPLOY_SERVER = "root@162.246.19.130"
    }

    parameters {
        string(name: 'BRANCH', defaultValue: 'dev', description: 'Git branch to build')
    }

    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir() // ensures a fresh workspace
            }
        }

        stage('Checkout') {
            steps {
                git branch: params.BRANCH,
                    url: 'https://github.com/arnite/9jaschoolhubBackend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }


        stage('Docker Build') {
            steps {
                sh "docker build -t ${REGISTRY}/${IMAGE}:${BUILD_NUMBER} ."
            }
        }

    stage('Push to Nexus') {
    steps {
        script {
            withCredentials([usernamePassword(
                credentialsId: 'nexus-cred',   // 🔑 Jenkins credentials ID (username/password)
                usernameVariable: 'NEXUS_USER',
                passwordVariable: 'NEXUS_PASS'
            )]) {
                sh """
                    echo "$NEXUS_PASS" | docker login ${REGISTRY} -u "$NEXUS_USER" --password-stdin
                    docker push ${REGISTRY}/${IMAGE}:${BUILD_NUMBER}
                    docker logout ${REGISTRY}
                """
            }
        }
    }
}

stage('Deploy to Server') {
    steps {
        script {
            // 🔑 Ensure you create SSH credentials in Jenkins with ID "server-ssh"
            withCredentials([sshUserPrivateKey(
                credentialsId: 'server-ssh',
                keyFileVariable: 'SSH_KEY',
                usernameVariable: 'SSH_USER'
            )]) {
                sh """
                    ssh -o StrictHostKeyChecking=no -i $SSH_KEY $SSH_USER@${DEPLOY_SERVER} '
                        docker login ${REGISTRY} -u ${NEXUS_USER} -p ${NEXUS_PASS} &&
                        docker pull ${REGISTRY}/${IMAGE}:${BUILD_NUMBER} &&
                        docker stop ${IMAGE} || true &&
                        docker rm ${IMAGE} || true &&
                        docker run -d --name ${IMAGE} -p 3000:3000 ${REGISTRY}/${IMAGE}:${BUILD_NUMBER}
                    '
                """
            }
        }
    }
}


    }
}
