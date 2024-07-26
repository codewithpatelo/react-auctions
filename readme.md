# Configuración del Proyecto

Este documento describe cómo configurar y ejecutar el proyecto tanto para el front-end como para el back-end.

## Configuración del Back-End (NestJs-Prisma-PostgreSQL)

1. **Levantar la Base de Datos**

   Ejecutamos el contenedor de Docker para levantar la base de datos. Hay que estar en el directorio del repositorio del back-end y ejecutar:

   ```bash
   docker-compose up
    ```
Esto iniciará la base de datos PostgreSQL definida en docker-compose.yml.

2. **Instalar Dependencias**

Instalamos las dependencias del proyecto con compatibilidad garantizada de librerías de testing:

```bash
  npm install --legacy-peer-deps
```

3. **Creamos las Variables Ambientales**

Crea un archivo .env en el directorio raíz del proyecto con el siguiente contenido:

```env
  DATABASE_URL=postgresql://<user>:<pass>@localhost:5432/auction_db
  JWT_SECRET=<jwt>
```

4. **Configuramos Prisma para el Back-End**

Hay que tener Prisma instalado.

Ejecutamos la migración para aplicar cambios al esquema de la base de datos:

```bash
  npx prisma migrate deploy
  npx prisma generate
```

5. **Corremos el Back-End en una terminal**

```bash
  npm run start
```

## Configuración del Front-End (React-NextJs-TailWind-Prisma)

Ahora vamos al repositorio del front-end.

1. **Instalar Dependencias**

Instalamos las dependencias del proyecto con compatibilidad garantizada de librerías de testing:

```bash
  npm install --legacy-peer-deps
```

2. **Creamos las Variables Ambientales**

Creamos un archivo .env en el directorio raíz del proyecto con el siguiente contenido:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
DATABASE_URL=postgresql://<user>:<pass>@localhost:5432/auction_db
```

Hay que reemplazar <user> y <pass> con los valores correspondientes.

3. **Configuramos Prisma para el Front-End**

Hacemos lo mismo que hicimos con el BE.


4. **Corremos Front-End**

```bash
  npm run dev 
```

5. **Creamos un usuario y unas subastas de prueba** 

## Se hicieron unas pruebas básicas en BE y FE - JEST | VITEST -

Respectivamente:

```bash
  npm run test 
```

