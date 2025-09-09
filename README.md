# **MAKI-Control (Frontend) 🖥️**

Este repositorio contiene el código fuente del frontend para **MAKI-Control**, un sistema de gestión y facturación. La aplicación está construida con **Next.js** y **TypeScript**, y consume una API de backend para la gestión de datos.

## **🚀 Entorno de Desarrollo**

Para levantar el proyecto en un entorno local, asegúrate de cumplir con los siguientes prerrequisitos.

  * **Node.js**: Se recomienda la versión `22.17.1` o superior.
  * **Gestor de Paquetes**: Se recomienda usar **pnpm**, aunque `npm` también es compatible.

-----

## **📦 Instalación**

Sigue estos pasos para configurar el proyecto en tu máquina.

1.  **Clonar el Repositorio**
    ```bash
    git clone https://github.com/tu-usuario/maki-control-frontend.git
    cd maki-control-frontend
    ```
2.  **Configurar Variables de Entorno**
    Crea un archivo llamado `.env.local` en la raíz del proyecto. Este archivo contendrá la URL de la API a la que se conectará el frontend para el desarrollo local.
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8081
    ```
3.  **Instalar Dependencias**
    Ejecuta el siguiente comando en la terminal. Se recomienda `pnpm`.
    ```bash
    # Usando pnpm (recomendado)
    pnpm install

    # Alternativa con npm
    npm install
    ```

-----

## **⚡ Ejecución Local**

Una vez instaladas las dependencias, inicia el servidor de desarrollo:

```bash
pnpm run dev
```

La aplicación estará disponible en **http://localhost:3000**.

-----

## **🐳 Despliegue con Docker**

El proyecto está configurado para ser desplegado fácilmente como un contenedor de Docker, creando un entorno de producción consistente y aislado.

### **Prerrequisitos**

  * **Docker Desktop**: Asegúrate de tener Docker instalado y en ejecución en tu máquina. Puedes descargarlo desde [la página oficial de Docker](https://www.docker.com/products/docker-desktop/).

### **Pasos para el Despliegue**

1.  **Configurar Variables de Entorno de Producción**
    Crea un archivo llamado `.env.production` en la raíz del proyecto. Este archivo es leído durante la construcción de la imagen de Docker para inyectar las variables de entorno públicas.

    ```env
    # .env.production
    NEXT_PUBLIC_API_URL=http://tu-api-de-produccion.com
    ```

2.  **Construir la Imagen de Docker**
    Ejecuta el siguiente comando en la raíz del proyecto. Este proceso puede tardar unos minutos la primera vez.

    ```bash
    docker build -t makicontrol-frontend .
    ```

      * `-t makicontrol-frontend`: Asigna el nombre `makicontrol-frontend` a la imagen.
      * `.`: Indica que el contexto de construcción es el directorio actual.

3.  **Ejecutar el Contenedor**
    Una vez construida la imagen, inicia un contenedor con el siguiente comando:

    ```bash
    docker run -p 3000:3000 --env-file ./.env.production makicontrol-frontend
    ```

      * `-p 3000:3000`: Mapea el puerto `3000` de tu máquina al puerto `3000` del contenedor.
      * `--env-file ./.env.production`: Carga las variables de entorno para el lado del servidor (si las hubiera).
      * `makicontrol-frontend`: El nombre de la imagen a ejecutar.

La aplicación estará disponible en **http://localhost:3000** en un entorno de producción.

-----

## **🛠️ Stack Tecnológico**

  * **Framework**: Next.js
  * **Lenguaje**: TypeScript
  * **Estilos**: Tailwind CSS
  * **Notificaciones**: React Hot Toast

-----

## **📂 Estructura del Proyecto**

El repositorio sigue una estructura organizada para facilitar el mantenimiento y la escalabilidad.

```
/
├── app/              # Enrutador y páginas de la aplicación
├── components/       # Componentes reutilizables de la UI
│   └── ui/           # Componentes de UI genéricos (botones, inputs, etc.)
├── services/         # Funciones para las llamadas a la API (ej. counterService.ts)
├── types/            # Definiciones de interfaces de TypeScript (ej. counterType.ts)
├── utilities/        # Funciones de ayuda y lógica de validación (ej. validateCounter.ts)
└── public/           # Archivos estáticos como imágenes y fuentes
```
