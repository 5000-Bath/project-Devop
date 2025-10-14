pipeline {
    agent { label 'docker-host' }
    environment {
        DOCKER_HUB_USERNAME = 'filmfilm'
        IMAGE_NAME_ADMIN = "${DOCKER_HUB_USERNAME}/foodstore-admin-frontend"
        IMAGE_NAME_USER  = "${DOCKER_HUB_USERNAME}/foodstore-user-frontend"
        IMAGE_NAME_BACKEND = "${DOCKER_HUB_USERNAME}/foodstore-backend"
        COMPOSE_PROJECT_NAME = 'node1_devops'  // ชื่อ network จาก docker-compose
    }
    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                git branch: 'changename',
                    url: 'https://github.com/5000-Bath/project-Devop.git'
            }
        }

        stage('Unit Test') {
            steps {
                echo "Skipping Unit Tests for now"
            }
        }

        stage('Deploy') {
            steps {
                echo "Skipping Docker Compose deploy due to port conflict"
            }
        }

        stage('E2E Test') {
            steps {
                echo "Skipping E2E Test for now"
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                // ลบ folder downloads ของ Cypress ก่อน build
                sh 'rm -rf ./Foodstore_User/cypress/downloads || true'

                sh "docker build -t ${IMAGE_NAME_ADMIN}:latest ./Foodstore_admin_Frontend"
                sh "docker build -t ${IMAGE_NAME_USER}:latest ./Foodstore_User"
                sh "docker build -t ${IMAGE_NAME_BACKEND}:latest ./firstapp"

                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    sh "docker push ${IMAGE_NAME_ADMIN}:latest"
                    sh "docker push ${IMAGE_NAME_USER}:latest"
                    sh "docker push ${IMAGE_NAME_BACKEND}:latest"
                }
            }
        }

        stage('unDeploy') {
            steps {
                echo "Skipping unDeploy for safety"
                // sh 'docker-compose down || true'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'Foodstore_User/cypress/screenshots/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'Foodstore_User/cypress/videos/**', allowEmptyArchive: true
        }
    }
}
