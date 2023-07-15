# Descripción del Sistema ℹ️

API Rest que permite hacer un CRUD de Usuarios, Eventos y Reservaciones de Eventos. Para obtener las diferentes peticiones, el usuario debe autenticarse ingresando su usuario y contraseña, la cual es encriptada para mayor seguridad. Después de haberse autenticado, el usuario obtendrá una autorización por medio de un token, lo que le permitirá realizar las diferentes solicitudes del sistema sin problemas. Esto es posible gracias a la implementación de JWT.

## Instalación del Sistema 🔧

En la terminal y ubicado dentro de tu proyecto, utiliza los siguientes comandos:

1. Usa el comando `npm init` para crear un archivo `package.json`.
2. Usa el comando `npm i express` para instalar Express.js.
3. Usa el comando `npm i typescript -D` para instalar TypeScript como dependencia de desarrollo en `package.json`.
4. Usa el comando `npm i ts-node-dev -D` para instalar `ts-node-dev` como dependencia de desarrollo. Es una librería que permite monitorear si hay cambios en el código y, si es así, lo compila nuevamente.
5. Usa el comando `npm i morgan cors` para instalar los módulos externos: `morgan` (para ver por consola las peticiones que llegan, como `get`, `post`, `put`, `delete`) y `cors` (para comunicar tu servidor con servidores externos, como el de frontend u otros frameworks).
6. Usa el comando `npm i @types/morgan @types/cors -D` para instalar las dependencias de desarrollo `@types/morgan`, `@types/cors` y `@types/express`. Al ejecutar la aplicación, `morgan` mostrará el intento de acceso en un log.

Instalamos TypeORM:

![image](https://github.com/CristianT2/api-reservaciones-mod4-fswd/assets/65424066/65372db3-967f-41ba-a9f2-f67b5e5d4359)

- `typeorm`: el ORM.
- `reflect-metadata`: permite interactuar con los decoradores de tipos.
- `types` de `node`.
- `mysql`: módulo de conexión.

Agregar scripts para:

![image](https://github.com/CristianT2/api-reservaciones-mod4-fswd/assets/65424066/3bff2c0b-f750-4d6f-8e89-3325bbb6a2a0)

- `compilar`: `npm run build`.
- `ejecutar`: `npm start`.

Usa el comando `npm i passport passport-local passport-jwt jsonwebtoken bcrypt` y luego utiliza el siguiente comando `npm i -D @types/passport @types/passport-local @types/passport-jwt @types/jsonwebtoken @types/bcrypt`.

- `passport`: librería base para implementar un sistema de autenticación.
- `passport-local`: nos permite crear middleware passport con estrategia de tipo local.
- `passport-jwt`: nos permite crear middleware passport con estrategia de tipo JWT, que permitirá recibir un token vía cabecera y hacer su validación.
- `jsonwebtoken`: librería que nos permite la creación de tokens JWT.
- `bcrypt`: permite hacer el hash y el verify.

## Ejecución de la Aplicación 🚀

En la consola, utiliza el comando `npm run dev` para ejecutar la aplicación.
