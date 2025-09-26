pipeline {
    agent any
    environment {
        DOCKER_HUB_USERNAME = 'filmfilm' 
        IMAGE_NAME_ADMIN = "${DOCKER_HUB_USERNAME}/foodstore-admin-frontend"
        IMAGE_NAME_USER  = "${DOCKER_HUB_USERNAME}/foodstore-user-frontend"
    }
    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                git branch: 'changename',
                    url: 'https://github.com/5000-Bath/project-Devop.git'  // ← ลบ space ท้าย!
            }
        }
        stage('Build and Push Docker Images') {
            steps {
                // ใช้ชื่อโฟลเดอร์จริงตามที่เห็นใน repo
                sh "docker build -t ${IMAGE_NAME_ADMIN}:latest ./Foodstore_admin_Frontend"
                sh "docker build -t ${IMAGE_NAME_USER}:latest ./Foodstore_User"

                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    sh "docker push ${IMAGE_NAME_ADMIN}:latest"
                    sh "docker push ${IMAGE_NAME_USER}:latest"
                }
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker rm -f foodstore-db || true'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
            }
        }
    }
}
