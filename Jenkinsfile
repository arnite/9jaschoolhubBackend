pipeline {
    agent any

    environment {
        REGISTRY = "162.246.19.130:8083"
        IMAGE = "my-node-app"
        DEPLOY_SERVER = "devops@162.246.19.130"
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
                sh "docker build -t ${IMAGE}:test ."
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

    }
}
