pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'changename',
                    url: 'https://github.com/5000-Bath/project-Devop.git'
            }
        }
        stage('Build') {
            steps {
                bat 'docker-compose build'
            }
        }
        stage('Deploy') {
            steps {
                bat 'docker-compose up -d'
            }
        }
    }
}
