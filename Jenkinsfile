pipeline {
    agent { label 'docker-host' }

    parameters {
        string(name: 'IMAGE_VERSION', defaultValue: '1.0.0', description: 'Version for Docker images')
    }

    environment {
        DOCKER_HUB_USERNAME = 'filmfilm'
        IMAGE_NAME_ADMIN = "${DOCKER_HUB_USERNAME}/foodstore-admin-frontend"
        IMAGE_NAME_USER  = "${DOCKER_HUB_USERNAME}/foodstore-user-frontend"
        IMAGE_NAME_BACKEND = "${DOCKER_HUB_USERNAME}/foodstore-backend"
        
        USER_PORT = '3000'
        ADMIN_PORT = '3001'
        BACKEND_PORT = '8080'
        
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {

        /* ------------------------------- GIT ------------------------------- */
        stage('Checkout') {
            steps {
                deleteDir()
                git branch: 'main',
                    url: 'https://github.com/5000-Bath/project-Devop.git'
            }
        }

        /* ----------------------- START TEST ENV ----------------------- */
        stage('Start Test Environment') {
            steps {
                echo "🔥 Cleaning old containers before starting test..."

                // 🔥 ป้องกัน container name conflict
                sh "docker-compose -f ${COMPOSE_FILE} down --remove-orphans || true"
                sh "docker rm -f foodstore-db || true"
                sh "docker rm -f firstapp-backend || true"

                echo "1. Starting DB and Backend API..."
                sh "docker-compose -f ${COMPOSE_FILE} up -d db backend"

                sh 'sleep 45'

                echo "2. Installing Frontend Dependencies and starting Vite Dev Servers..."
                sh 'cd Foodstore_User && npm install'
                sh "cd Foodstore_User && VITE_API_URL=http://localhost:${BACKEND_PORT} npm run dev > /tmp/user-dev.log 2>&1 &"
                
                sh 'cd Foodstore_admin_Frontend && npm install'
                sh "cd Foodstore_admin_Frontend && VITE_API_URL=http://localhost:${BACKEND_PORT} npm run dev > /tmp/admin-dev.log 2>&1 &"

                sh 'sleep 15'
            }
        }

        /* --------------------------- E2E Test -------------------------- */
        stage('E2E Test') {
            steps {
                echo "Running Cypress E2E Tests with Xvfb..."

                sh 'cd Foodstore_User && npx cypress install'
                sh "cd Foodstore_User && DISPLAY=:99 xvfb-run -a npx cypress run --config baseUrl=http://localhost:${USER_PORT} --headless || true"

                sh 'cd Foodstore_admin_Frontend && npx cypress install'
                sh "cd Foodstore_admin_Frontend && DISPLAY=:99 xvfb-run -a npx cypress run --config baseUrl=http://localhost:${ADMIN_PORT} --headless || true"
            }
        }

        /* --------------------------- CLEANUP -------------------------- */
        stage('Cleanup Test Environment') {
            steps {
                echo "Killing running Frontend Dev Servers..."
                sh "kill \$(lsof -t -i:${USER_PORT}) || true"
                sh "kill \$(lsof -t -i:${ADMIN_PORT}) || true"

                echo "Stopping Docker Compose services..."
                sh "docker-compose -f ${COMPOSE_FILE} down --remove-orphans || true"
            }
        }

        /* --------------------------- BUILD IMAGES -------------------------- */
        stage('Build and Push Docker Images') {
            steps {
                echo "Building FINAL Production Images version ${params.IMAGE_VERSION}..."

                sh "docker build -t ${IMAGE_NAME_ADMIN}:${params.IMAGE_VERSION} ./Foodstore_admin_Frontend"
                sh "docker build -t ${IMAGE_NAME_USER}:${params.IMAGE_VERSION} ./Foodstore_User"
                sh "docker build -t ${IMAGE_NAME_BACKEND}:${params.IMAGE_VERSION} ./firstapp"

                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'

                    sh "docker push ${IMAGE_NAME_ADMIN}:${params.IMAGE_VERSION}"
                    sh "docker push ${IMAGE_NAME_USER}:${params.IMAGE_VERSION}"
                    sh "docker push ${IMAGE_NAME_BACKEND}:${params.IMAGE_VERSION}"
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'Foodstore_User/cypress/screenshots/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'Foodstore_User/cypress/videos/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'Foodstore_admin_Frontend/cypress/screenshots/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'Foodstore_admin_Frontend/cypress/videos/**', allowEmptyArchive: true
        }
        failure {
            echo "🚨 Pipeline failed! Check logs in /tmp/*.log"
        }
    }
}
