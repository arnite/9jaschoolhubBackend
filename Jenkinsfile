pipeline {
    agent {
        docker {
            image 'node:18'
            args '-v /var/run/docker.sock:/var/run/docker.sock'  // Mount host Docker socket
        }
    }

    environment {
        REGISTRY = "162.246.19.130:8083"     // Nexus Docker registry
        IMAGE = "my-node-app"                 // e.g., my-node-app
        DEPLOY_SERVER = "devops@162.246.19.130"      // SSH user@host
    }

    parameters {
        string(name: 'BRANCH', defaultValue: 'dev', description: 'Git branch to build')
    }

    stages {

        stage('Install Git') {
            steps {
                sh 'apt-get update && apt-get install -y git'
            }
        }

        stage('Clean Workspace') {
            steps {
                deleteDir()  // ensure fresh workspace
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

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $REGISTRY/$IMAGE:latest ."
            }
        }

        stage('Push to Nexus') {
            steps {
                withCredentials([usernamePassword(credentialsId: '363bc55d-70ed-4aae-b108-d020021e6d7f', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                    sh "echo $NEXUS_PASS | docker login $REGISTRY -u $NEXUS_USER --password-stdin"
                    sh "docker push $REGISTRY/$IMAGE:latest"
                }
            }
        }

        stage('Deploy via SSH') {
            steps {
                sshagent(['ae4c5ca4-afa1-4dbd-9a00-c5ac5022b8e0']) {
                    sh """
                        ssh $DEPLOY_SERVER '
                        docker pull $REGISTRY/$IMAGE:latest &&
                        docker stop $IMAGE || true &&
                        docker rm $IMAGE || true &&
                        docker run -d -p 3000:3000 --name $IMAGE $REGISTRY/$IMAGE:latest
                        '
                    """
                }
            }
        }

    }
}