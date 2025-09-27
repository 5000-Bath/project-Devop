pipeline {
    agent { label 'docker-host' }  // ← ตรงกับ Labels ที่ตั้งใน agent
    environment {
        DOCKER_HUB_USERNAME = 'filmfilm'
        IMAGE_NAME_ADMIN = "${DOCKER_HUB_USERNAME}/foodstore-admin-frontend"
        IMAGE_NAME_USER  = "${DOCKER_HUB_USERNAME}/foodstore-user-frontend"
        IMAGE_NAME_BACKEND = "${DOCKER_HUB_USERNAME}/foodstore-backend"
    }
    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                git branch: 'changename',
                    url: 'https://github.com/5000-Bath/project-Devop.git'
            }
        }

        stage('Build and Push Docker Images') {
            steps {
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

        stage('Deploy') {
            steps {
                sh 'docker rm -f foodstore-db || true'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
            }
        }

        stage('E2E Test') {
            steps {
                dir('Foodstore_User') { // เข้าไปโฟลเดอร์ที่มี cypress
                    sh 'npm ci'   // ติดตั้ง dependencies ตาม package-lock.json
                    // รัน Cypress แบบ headless (มีไฟล์ cypress.config.js อยู่แล้ว)
                    sh 'npx cypress run --browser chrome --config-file cypress.config.js'
                }
            }
        }
    }

    post {
        always {
            // เก็บผลลัพธ์ E2E test ไว้ใน Jenkins
            junit 'Foodstore_User/cypress/results/*.xml'
            archiveArtifacts artifacts: 'Foodstore_User/cypress/screenshots/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'Foodstore_User/cypress/videos/**', allowEmptyArchive: true
        }
    }
}
