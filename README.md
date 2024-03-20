<h1>Sistema de Inventario de Usuarios</h1>

Este proyecto es un sistema de inventario de usuarios desarrollado utilizando PostgreSQL, Flask y Next.js.
Configuración del Entorno

<h2>Configuración de PostgreSQL</h2>

    1. Asegúrate de tener PostgreSQL instalado en tu máquina. Puedes descargarlo desde el sitio oficial de PostgreSQL.

    2. Crea una base de datos en PostgreSQL con el nombre `inventario`.

    3. Crea un archivo .env en la carpeta backend/ y configura las variables de entorno como sigue:

    ```
    SQLALCHEMY_DATABASE_URL="postgresql://USERNAME:PASSWD@localhost:5432/inventario"
    SECRET_KEY='secret_key_of_flask'
    ```

    Reemplaza `USERNAME` y `PASSWD` con tus credenciales de PostgreSQL.

<h2>Configuración del Entorno Virtual de Python</h2>
Linux y macOS

```
cd backend/
python3 -m venv venv
source venv/bin/activate
```

Windows
```
cd backend/
python -m venv venv
.\venv\Scripts\activate
```

<h3>Instalación de Dependencias de Python</h3>

```
cd backend/
pip install -r requirements.txt
```

<h3>Ejecución de la Aplicación Flask</h3>

```
cd backend/
python app.py
```

La aplicación Flask estará disponible en http://localhost:8010.
<h2>Configuración del Desarrollo de Next.js</h2>
<h3>Instalación de Dependencias de Node.js</h3>

Asegúrate de tener Node.js instalado en tu máquina. Puedes descargarlo desde el sitio oficial de Node.js.

```
cd frontend/
npm install
```

<h3>Ejecución del Servidor de Desarrollo de Next.js</h3>

```
cd frontend/
npm run dev
```

El servidor de desarrollo de Next.js estará disponible en http://localhost:3000.
<h3>Build de Next.js para Implementación</h3>

```
cd frontend/
npm run build
```

Este comando generará una carpeta `out/` con los archivos estáticos listos para ser desplegados.

¡Listo! Con estas instrucciones, deberías poder configurar el entorno de desarrollo, ejecutar la aplicación Flask y trabajar con el proyecto de Next.js tanto en desarrollo como en producción. Si encuentras algún problema o tienes alguna pregunta, no dudes en contactarnos. ¡Feliz codificación! 🚀🔧📦