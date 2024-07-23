# Proyecto Web


## Instalación
### Backend
1. Clonar el repositorio:
    ```bash
    git clone [URL del repositorio Backend]
    cd [directorio Backend]
    ```
2. Crear y activar el entorno virtual:
    ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows: venv\Scripts\activate
    ```
3. Instalar las dependencias:
    ```bash
    pip install -r requirements.txt
    ```
4. Configurar las variables de entorno en un archivo `.env` en la raíz del proyecto:
    ```
    SECRET_KEY=your_secret_key
    DATABASE_ENGINE=django.db.backends.postgresql
    DATABASE_NAME=your_db_name
    DATABASE_USER=your_db_user
    DATABASE_PASSWORD=your_db_password
    DATABASE_HOST=your_db_host
    DATABASE_PORT=your_db_port
    ```
5. Migrar la base de datos:
    ```bash
    python manage.py migrate
    ```
6. Crear un superusuario para acceder al admin:
    ```bash
    python manage.py createsuperuser
    ```
7. Correr el servidor de desarrollo:
    ```bash
    python manage.py runserver
    ```

### Frontend
1. Clonar el repositorio:
    ```bash
    git clone [URL del repositorio Frontend]
    cd [directorio Frontend]
    ```
2. Instalar las dependencias:
    ```bash
    npm install
    ```
3. Iniciar la aplicación:
    ```bash
    npm start
    ```

## Uso
### Backend
1. Ejecutar el servidor de desarrollo:
    ```bash
    python manage.py runserver
    ```
2. Acceder a la interfaz de administración:
    ```plaintext
    http://127.0.0.1:8000/admin
    ```
3. Usar las credenciales del superusuario creado para iniciar sesión.

### Frontend
1. Ejecutar el servidor de desarrollo:
    ```bash
    npm start
    ```
2. Acceder a la aplicación en:
    ```plaintext
    http://localhost:4200
    ```


# Simpleticket

## Descripción General

Simpleticket es una aplicación web diseñada para facilitar la gestión y el pedido de productos desde la comodidad del hogar. Utiliza Django para el backend y Angular para el frontend, ofreciendo una experiencia de usuario fluida y eficiente.

### Página de Inicio

La página de inicio de Simpleticket está diseñada para dar la bienvenida a los usuarios y destacar las categorías populares y las ofertas especiales. Incluye las siguientes secciones:

- **Banner de Bienvenida**: Presenta el nombre de la aplicación y un botón de llamada a la acción para hacer pedidos.
- **Categorías Populares**: Muestra una selección de categorías como Comida, Electrónica y Ropa, cada una con una imagen representativa.
- **Ofertas Especiales**: Presenta promociones actuales en diferentes categorías de productos.

## Instalación y Configuración

### Requisitos

- Python 3.x
- Node.js y npm
- PostgreSQL (o cualquier otra base de datos compatible con Django)

### Backend (Django)

1. **Clonar el repositorio**:
    ```bash
    git clone [URL del repositorio Backend]
    cd [directorio Backend]
    ```

2. **Crear y activar el entorno virtual**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows: venv\Scripts\activate
    ```

3. **Instalar las dependencias**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Configurar las variables de entorno** en un archivo `.env` en la raíz del proyecto:
    ```
    SECRET_KEY=your_secret_key
    DATABASE_ENGINE=django.db.backends.postgresql
    DATABASE_NAME=your_db_name
    DATABASE_USER=your_db_user
    DATABASE_PASSWORD=your_db_password
    DATABASE_HOST=your_db_host
    DATABASE_PORT=your_db_port
    EMAIL_HOST_USER=your_email
    EMAIL_HOST_PASSWORD=your_email_password
    ```

5. **Migrar la base de datos**:
    ```bash
    python manage.py migrate
    ```

6. **Crear un superusuario**:
    ```bash
    python manage.py createsuperuser
    ```

7. **Correr el servidor de desarrollo**:
    ```bash
    python manage.py runserver
    ```

### Frontend (Angular)

1. **Clonar el repositorio**:
    ```bash
    git clone [URL del repositorio Frontend]
    cd [directorio Frontend]
    ```

2. **Instalar las dependencias**:
    ```bash
    npm install
    ```

3. **Correr el servidor de desarrollo**:
    ```bash
    ng serve
    ```

## API REST

### Endpoints

#### Registro de Usuario (SignUp)

- **URL**: `/api/signup/`
- **Método**: `POST`
- **Descripción**: Registra un nuevo usuario y envía un correo de bienvenida.
- **Datos de Entrada**:
    ```json
    {
        "username": "user1",
        "password": "password123",
        "confirm_password": "password123",
        "email": "user1@example.com"
    }
    ```
- **Respuesta Exitosa**:
    ```json
    {
        "username": "user1",
        "email": "user1@example.com"
    }
    ```

#### Inicio de Sesión (SignIn)

- **URL**: `/api/signin/`
- **Método**: `POST`
- **Descripción**: Autentica al usuario y retorna un token de autenticación.
- **Datos de Entrada**:
    ```json
    {
        "username": "user1",
        "password": "password123"
    }
    ```
- **Respuesta Exitosa**:
    ```json
    {
        "token": "your_auth_token"
    }
    ```

#### Perfil del Usuario (Profile)

- **URL**: `/api/profile/`
- **Método**: `GET`
- **Descripción**: Retorna la información del perfil del usuario autenticado.
- **Cabeceras**:
    ```http
    Authorization: Token your_auth_token
    ```
- **Respuesta Exitosa**:
    ```json
    {
        "username": "user1",
        "first_name": "",
        "last_name": "",
        "date_joined": "2023-07-22T10:00:00Z",
        "is_staff": false,
        "is_superuser": false
    }
    ```

#### Actualización del Perfil (Profile Update)

- **URL**: `/api/profile/update/`
- **Método**: `PUT`
- **Descripción**: Actualiza la información del perfil del usuario autenticado.
- **Cabeceras**:
    ```http
    Authorization: Token your_auth_token
    ```
- **Datos de Entrada**:
    ```json
    {
        "first_name": "John",
        "last_name": "Doe"
    }
    ```
- **Respuesta Exitosa**:
    ```json
    {
        "username": "user1",
        "first_name": "John",
        "last_name": "Doe",
        "date_joined": "2023-07-22T10:00:00Z",
        "is_staff": false,
        "is_superuser": false
    }
    ```

## Hosting y Despliegue

El proyecto está desplegado en una URL en la nube con HTTPS y un nombre de dominio propio. Puedes acceder a la aplicación utilizando las siguientes credenciales para probar las funcionalidades CRUD:

- **Usuario**: admin
- **Contraseña**: 1234

## Video Demostrativo

•	https://drive.google.com/file/d/1kAJWRSjXIEY0HoomKr2Ha9TekdrQjx67/view?usp=sharing

## Recomendaciones y Conclusiones

- **Recomendaciones**:
  - Implementar pruebas automatizadas para garantizar la calidad del código.
  - Optimizar las consultas a la base de datos para mejorar el rendimiento.
  - Considerar la implementación de un sistema de caché para reducir la carga en el servidor.

- **Conclusiones**:
  - Simpleticket proporciona una solución eficiente para la gestión de pedidos y productos.
  - La integración de Django y Angular permite una experiencia de usuario fluida y reactiva.
  - La estructura modular del código facilita el mantenimiento y la escalabilidad del proyecto.
A continuación, te proporciono el contenido de un `README.md` para la parte del frontend de tu proyecto "Simpleticket", incluyendo consideraciones, interfaces y pantallazos del sistema:

# Simpleticket Frontend

## Descripción General

El frontend de Simpleticket está construido con Angular y proporciona una interfaz de usuario atractiva y fácil de usar para gestionar pedidos y productos. La estructura del proyecto sigue una arquitectura modular que facilita la escalabilidad y el mantenimiento.

## Estructura del Proyecto

La estructura de carpetas del proyecto es la siguiente:

### Componentes

- **footer**: Componente del pie de página.
- **header**: Componente del encabezado.
- **home**: Componente de la página de inicio.
- **list**: Componente de la lista de productos.
- **profile**: Componente del perfil de usuario.
- **sign-in**: Componente de inicio de sesión.
- **sign-up**: Componente de registro.
- **welcome**: Componente de bienvenida.

### Interfaces

- **productos.ts**: Definiciones de interfaces para los productos.

### Servicios

- **lista.service.ts**: Servicio para manejar la lista de productos.
- **accounts**:
  - **profile.service.ts**: Servicio para manejar el perfil de usuario.
  - **user.service.ts**: Servicio para manejar los usuarios.
  - **guard**:
    - **guest-guard-service.service.ts**: Guard para usuarios invitados.
    - **user-guard-service.service.ts**: Guard para usuarios autenticados.
  - **session**:
    - **session-service.service.ts**: Servicio para manejar las sesiones.
  - **sign-in**:
    - **sign-in.service.ts**: Servicio para manejar el inicio de sesión.
  - **sign-up**:
    - **sign-up.service.ts**: Servicio para manejar el registro de usuarios.
## Pantallazos del Sistema

### Página de Inicio

![Página de Inicio](screenshoots/home1.png)
![Página de Inicio](screenshoots/home2.png)

### Registro de Usuario

![Registro de Usuario](screenshoots/signup.png)

### Inicio de Sesión

![Inicio de Sesión](screenshoots/signin.png)

### Perfil de Usuario

![Perfil de Usuario](screenshoots/profile.png)

### Lista de Productos

![Lista de Productos](screenshoots/products.png)

### Django Administracion 

![Users](screenshoots/users.png)






