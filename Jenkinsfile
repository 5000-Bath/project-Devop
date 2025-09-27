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
                dir('Foodstore_User') {
                    // รัน Cypress ผ่าน Docker container
                    sh """
                    docker run --rm \
                      --network ${COMPOSE_PROJECT_NAME}_default \
                      -v \$PWD:/e2e \
                      -w /e2e \
                      cypress/included:13.7.0 \
                      npx cypress run --browser chrome --config-file cypress.config.js
                    """
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
