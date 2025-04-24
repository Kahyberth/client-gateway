<p align="center"> <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a> </p> <h1 align="center">Client Gateway – TaskMate</h1> <p align="center"> El Client Gateway de <strong>TaskMate</strong> es el punto único de entrada que orquesta y enrut a todas las peticiones y eventos hacia los microservicios de la aplicación. Construido con <a href="http://nestjs.com/" target="_blank">NestJS</a>, Docker, Redis y NATS, garantiza una comunicación eficiente, segura y escalable. </p>

---

## 🚀 Características

- **Orquestación de microservicios** Centraliza el enrutamiento de solicitudes HTTP y mensajes de eventos hacia los distintos servicios de TaskMate.
- **NestJS modular**: Arquitectura basada en módulos, controladores y proveedores para un desarrollo ágil y organizado.
- **Mensajería con NATS**: Publica y suscribe eventos de forma rápida y confiable para la coordinación entre servicios.
- **Autenticación y autorización**: Interceptores y guards centralizados para validar tokens y permisos antes de enrutar la petición.
- **Hot Reloading**: Desarrollo ágil con `npm run start:dev`.

---

## 🛠️ Requisitos previos

Asegúrate de tener instalados los siguientes elementos en tu máquina:

- [Node.js](https://nodejs.org/) (v16 o superior recomendado)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [TypeORM](https://typeorm.io/)

---

## 📦 Instalación

Sigue estos pasos para configurar el entorno local:

1. Clona el repositorio:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_REPOSITORIO>

   ```

2. Ejecuta el siguiente comando para instalar las dependencias

```
npm install
```

## 💾 Genera y migra las tablas

Antes de usar el microservicio hay que asegurarse de generar las tablas y despues migrarlas

1. Usa el comando `npm run db:gen ` para generar las tablas

2. Usa el comando `npm run db:migrate` para migrar las tablas

## 🖥️ Uso

Asegúrate de estar dentro de la carpeta del proyecto

1. Levanta el servidor Nats

```
 docker-compose run -d
```

2. Ejecuta el comando para correr el microservicio

```
  npm run start:dev
```

## Run tests

```bash
# unit tests
$ npm run test
```
