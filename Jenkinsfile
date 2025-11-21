pipeline {
    agent { label 'docker-host' }

    parameters {
        string(name: 'IMAGE_VERSION', defaultValue: '1.0.0', description: 'Version for Docker images')
        booleanParam(name: 'RUN_TEST', defaultValue: false, description: 'Run Unit & E2E Tests')
    }

    environment {
        DOCKER_HUB_USERNAME = 'filmfilm'
        IMAGE_NAME_ADMIN = "${DOCKER_HUB_USERNAME}/foodstore-admin-frontend"
        IMAGE_NAME_USER  = "${DOCKER_HUB_USERNAME}/foodstore-user-frontend"
        IMAGE_NAME_BACKEND = "${DOCKER_HUB_USERNAME}/foodstore-backend"

        USER_PORT   = '3000'
        ADMIN_PORT  = '3001'
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

        /* --------------------------- TEST SECTIONS -------------------------- */

        stage('Install Dependencies') {
            when { expression { params.RUN_TEST == true } }
            steps {
                echo "Installing dependencies required for Cypress..."
                sh '''
                    sudo apt-get update
                    sudo apt-get install -y xvfb libgtk-3-0 libgbm-dev || true
                '''
            }
        }

        stage('Start Test Environment') {
            when { expression { params.RUN_TEST == false } }
            steps {
                echo "Starting DB and Backend API..."
                sh "docker-compose -f ${COMPOSE_FILE} up -d db backend"
                sh "sleep 45"

                echo "Installing frontend dependencies..."
                sh '''
                    cd Foodstore_User && npm install
                    cd ..
                    cd Foodstore_admin_Frontend && npm install
                '''

                echo "Starting dev servers..."
                sh '''
                    cd Foodstore_User && npm run dev > /tmp/user-dev.log 2>&1 &
                    cd ..
                    cd Foodstore_admin_Frontend && npm run dev > /tmp/admin-dev.log 2>&1 &
                '''

                sh "sleep 15"
            }
        }

        stage('Unit Test') {
            when { expression { return params.RUN_TEST } }
            steps {
                echo "Running Unit Tests..."
                sh "cd Foodstore_User && npm test"
                sh "cd Foodstore_admin_Frontend && npm test"
            }
        }

        stage('E2E Test') {
            when { expression { return params.RUN_TEST } }
            steps {
                echo "Running Cypress Tests..."

                sh '''
                    cd Foodstore_User
                    npx cypress install
                    DISPLAY=:99 xvfb-run -a npx cypress run --config baseUrl=http://localhost:'"${USER_PORT}"' --headless || true
                '''

                sh '''
                    cd Foodstore_admin_Frontend
                    npx cypress install
                    DISPLAY=:99 xvfb-run -a npx cypress run --config baseUrl=http://localhost:'"${ADMIN_PORT}"' --headless || true
                '''
            }
        }

        stage('Cleanup Test Environment') {
            when { expression { return params.RUN_TEST } }
            steps {
                echo "Cleaning up test environment..."
                sh "docker-compose -f ${COMPOSE_FILE} down"
            }
        }

        /* --------------------------- BUILD IMAGES -------------------------- */

        stage('Build and Push Docker Images') {
            steps {
                echo "Building production Docker images version ${params.IMAGE_VERSION}..."

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
            script {
                if (params.RUN_TEST) {
                    echo "Archiving Cypress artifacts..."
                    archiveArtifacts artifacts: 'Foodstore_User/cypress/screenshots/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'Foodstore_User/cypress/videos/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'Foodstore_admin_Frontend/cypress/screenshots/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'Foodstore_admin_Frontend/cypress/videos/**', allowEmptyArchive: true
                } else {
                    echo "RUN_TEST=false → Skip archiving test artifacts"
                }
            }
        }
        failure {
            echo "🚨 Pipeline failed! Check logs."
        }
    }
}
