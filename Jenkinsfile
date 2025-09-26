pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                deleteDir() // ล้าง workspace เก่าทิ้ง
                git branch: 'changename',
                    url: 'https://github.com/5000-Bath/project-Devop.git'
            }
        }
        stage('Build') {
            steps {
                sh 'docker-compose build'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}
