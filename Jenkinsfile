pipeline {
    agent any

    stages {
        stage('Parando los servicios...') {
            steps {
                script {
                    bat """
                    echo Parando servicios existentes...
                    docker compose -p sgu-demo down || exit /b 0
                    """
                }
            }
        }

stage('Eliminando imágenes anteriores...') {
    steps {
        script {
            bat '''
            echo Eliminando imágenes anteriores...
            for /f "tokens=*" %%i in ('docker images --filter "label=com.docker.compose.project=sgu-demo" -q') do (
                docker rmi -f %%i || echo No se pudo eliminar la imagen %%i
            )
            echo Limpieza de imágenes completada.
            '''
        }
    }
}


        stage('Obteniendo actualización...') {
            steps {
                checkout scm
            }
        }

        stage('Construyendo y desplegando servicios...') {
            steps {
                script {
                    bat """
                    echo Construyendo y levantando servicios...
                    docker compose up --build -d
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado con éxito'
        }
        failure {
            echo 'Hubo un error al ejecutar el pipeline'
        }
        always {
            echo 'Pipeline finalizado'
        }
    }
}
