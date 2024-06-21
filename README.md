# iWise-Library-App

### Bienvenido/a al Proyecto iWise Library

Este repositorio contiene el código fuente para la aplicación iWise Library, una biblioteca virtual desarrollada como proyecto universitario. Aquí puedes gestionar libros, usuarios, préstamos y más.

### Instalación

Para comenzar con el proyecto, sigue estos pasos:

1. **Instalar Node.js:**
   - Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/). Esto incluirá npm, el gestor de paquetes de Node.js.

2. **Clonar el repositorio:**
   - Abre tu terminal y ejecuta:
     ```
     https://github.com/richyhoopd/iWise-Library-App
     ```
   - Esto descargará el código del proyecto en tu máquina local.

3. **Configurar variables de entorno:**
   - En el directorio `back`, crea un archivo llamado `.env`.
   - Copia y pega las siguientes variables de entorno en el archivo `.env`:
     ```
     DB_URI=ejemplo_uri_de_mongodb
     DB_NAME=iwiseciscolibrarygdl
     SESSION_SECRET=mysecret
     ```
     - `DB_URI`: Debes reemplazar `ejemplo_uri_de_mongodb` con tu URI de MongoDB, por ejemplo `mongodb://localhost:27017/iwiseciscolibrarygdl` si estás usando una base de datos local.
     - `DB_NAME`: Es el nombre de la base de datos MongoDB que estás utilizando.
     - `SESSION_SECRET`: Una cadena secreta para la sesión de usuario.

4. **Instalar dependencias:**
   - En la raíz del proyecto y luego en la carpeta `back`, ejecuta:
     ```
     cd back
     npm install
     ```

### Inicialización

Una vez configurado, puedes iniciar tanto el backend como el frontend de la aplicación.

#### Iniciar el Backend

1. En el directorio `back`, ejecuta:
   ```
   npm run start
   ```
   - Esto iniciará el servidor backend en el puerto configurado (generalmente 3001).

#### Iniciar el Frontend

1. En la raíz del proyecto y luego en la carpeta `front`, ejecuta:
   ```
   cd ..
   cd front
   npm install
   ```
   ```
para continuar
