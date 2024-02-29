# Blog de  Elden Ring usando Node.js y Docker

Este proyecto es un servidor de blog simple desarrollado con Node.JS, Docker y Express. Sigue una metodología de CRUD para las publicaciones. Cuenta con soporte para imagenes en formato base64 y cuenta con documentación e Swagger.
## Comenzando

Sigue los pasos para correr y copiar el proyecto.

### Prerrequisitos

Para correr el proyecto es necesario tener instalado 'node', 'npm' y 'Docker. Enlaces de instalacion:
- [Node.js y npm](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/get-docker/)

### Instalación

1. Clona el repositorio en tu máquina local.
2. Navega al directorio del proyecto
3. docker-compose up --build para iniciar el servidor y la base de datos y configuraciones necesarias.




## Uso

Crear un Post

POST /posts

json
Copy code
{
  "title": "Mi primer post",
  "content": "Este es el contenido de mi primer post",
  "imageBase64": "data:image/png;base64,iVBORw0KGgo..."
}
Obtener Posts

GET /posts


## Despliegue

Es necesario configurar las variables de entorno y ajustar docker-compose.yml para desplegar el proyecto.
## Construido con

* [Node.js](https://nodejs.org/) - El entorno de ejecución usado
* [Express](https://expressjs.com/) - El framework web usado
* [Docker](https://www.docker.com/) - Contenedorización
* [MySQL] (https://www.mysql.com/)- Base de datos



## Autores

* **Rodrigo Alfonso Mansilla Dubón**  - [https://github.com/Rodrimansidub14](url)


