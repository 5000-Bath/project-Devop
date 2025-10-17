pipeline {
    agent { label 'docker-host' }
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
        stage('Checkout') {
            steps {
                deleteDir()
                git branch: 'recover_stash',
                    url: 'https://github.com/5000-Bath/project-Devop.git'
            }
        }
        
        stage('Start Test Environment') {
            steps {
                echo "1. Starting DB and Backend API on host ports (localhost:${BACKEND_PORT})..."
                // 1. Start DB, Backend
                sh "docker compose -f ${COMPOSE_FILE} up -d db backend" 
                sh 'sleep 45' // รอ Backend พร้อม
                
                echo "2. Installing Frontend Dependencies and starting Vite Dev Servers..."
                
                // --- User Frontend Setup ---
                sh 'cd Foodstore_User && npm install'
                // รัน Vite Dev Server ในพื้นหลัง (VITE_API_URL จะชี้ไปที่ localhost:8080)
                sh "cd Foodstore_User && VITE_API_URL=http://localhost:${BACKEND_PORT} npm run dev &" 
                
                // --- Admin Frontend Setup ---
                sh 'cd Foodstore_admin_Frontend && npm install'
                sh "cd Foodstore_admin_Frontend && VITE_API_URL=http://localhost:${BACKEND_PORT} npm run dev &" 
                
                sh 'sleep 15' // รอ Vite Dev Servers พร้อม
            }
        }

        stage('Unit Test') {
            steps {
                echo "Running Frontend Unit Tests on Host..."
                
                // Unit Test ไม่ได้ต้องการ Server แต่การรัน npm test/vitest จะทำงานกับ Source Code ที่มี Dependencies แล้ว
                // Server รันอยู่แล้ว แต่ Unit Test จะรันเร็วและไม่กระทบการทำงานของ Server
                sh 'cd Foodstore_User && npm test' 
                sh 'cd Foodstore_admin_Frontend && npm test'
            }
        }

        stage('E2E Test') {
            steps {
                echo "Running Cypress E2E Tests (Targeting Dev Servers)..."
                
                // *** 1. User E2E Test ***
                sh 'cd Foodstore_User && npx cypress install' 
                sh "cd Foodstore_User && npx cypress run --config baseUrl=http://localhost:${USER_PORT}"
                
                // *** 2. Admin E2E Test ***
                sh 'cd Foodstore_admin_Frontend && npx cypress install' 
                sh "cd Foodstore_admin_Frontend && npx cypress run --config baseUrl=http://localhost:${ADMIN_PORT}"
            }
        }

        stage('Cleanup Test Environment') {
            steps {
                echo "Killing running Frontend Dev Servers..."
                // ฆ่า Process ของ Frontend Dev Servers ที่รันในพื้นหลัง
                sh "kill \$(lsof -t -i:${USER_PORT}) || true"
                sh "kill \$(lsof -t -i:${ADMIN_PORT}) || true"

                echo "Stopping Docker Compose services..."
                // ปิด Services ที่รันอยู่
                sh "docker compose -f ${COMPOSE_FILE} down"
            }
        }

        stage('Build and Push Docker Images') {
            // ... (ส่วน Build Production Image เหมือนเดิม) ...
            steps {
                echo "Building FINAL Production Images..."
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
