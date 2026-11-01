# 🚀 Guía de Instalación y Ejecución del Proyecto

Este documento describe los pasos necesarios para instalar las dependencias, configurar las variables de entorno y ejecutar los diferentes componentes del proyecto en un ambiente de desarrollo local.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas:

- Node.js
- npm
- Expo CLI (a través de npx)
- Git

## ⚙️ 1. Configuración de Variables de Entorno

Antes de iniciar el servidor, es necesario configurar las variables de entorno.

1. Dirígete a la raíz de la carpeta `codigo server`.
2. Localiza el archivo `.env.local`.
3. Completa las variables de entorno requeridas para el funcionamiento del proyecto.

**Importante:** La configuración del archivo `.env.local` es obligatoria para ejecutar correctamente el servidor.

> ⚠️ **Nota:** Verifica que todas las variables de entorno estén correctamente configuradas antes de iniciar el ambiente de desarrollo.

## 🖥️ 2. Levantar Server y Nexus Page

Para iniciar el servidor y Nexus Page, sigue estos pasos:

### Paso 1: Acceder al directorio

Ubícate en la raíz de la carpeta `codigo server`.

```bash
cd "codigo server"
```

### Paso 2: Instalar dependencias

Ejecuta el siguiente comando para instalar las dependencias necesarias:

```bash
npm install
```

### Paso 3: Iniciar el servidor

Una vez instaladas las dependencias y configurado el archivo `.env.local`, ejecuta:

```bash
npm run dev
```

Esto iniciará el ambiente de desarrollo correspondiente a **Server y Nexus Page**.

## 📱 3. Levantar la Aplicación con Expo

Para ejecutar la aplicación móvil, sigue estos pasos:

### Paso 1: Acceder al directorio

Ubícate en la raíz de la carpeta `codigo app`.

```bash
cd "codigo app"
```

### Paso 2: Instalar dependencias

Si es la primera vez que ejecutas el proyecto, instala las dependencias:

```bash
npm install
```

### Paso 3: Iniciar Expo

Ejecuta el siguiente comando:

```bash
npx expo start
```

Este comando iniciará el servidor de desarrollo de Expo, desde donde podrás ejecutar la aplicación en un emulador o dispositivo físico compatible.

## 🔄 4. Orden Recomendado de Ejecución

Para garantizar el correcto funcionamiento del proyecto, se recomienda seguir este orden:

1. Configurar las variables de entorno en `codigo server/.env.local`.
2. Instalar las dependencias de `codigo server`.
3. Iniciar Server y Nexus Page mediante `npm run dev`.
4. Abrir una nueva terminal.
5. Acceder a la carpeta `codigo app`.
6. Instalar las dependencias de la aplicación, si es necesario.
7. Iniciar Expo mediante `npx expo start`.

## ⚠️ Consideraciones Importantes

- El archivo `.env.local` debe contener todas las variables necesarias para ejecutar el servidor.
- Se recomienda mantener **Server y Nexus Page** en ejecución mientras se utiliza la aplicación móvil.
- Server y Expo deben ejecutarse en terminales independientes.
- Verifica que las dependencias estén correctamente instaladas antes de iniciar cada componente.
- Por seguridad, evita compartir o subir el archivo `.env.local` al repositorio si contiene información sensible.

---

## 📌 Resumen de Comandos

### Server y Nexus Page

```bash
cd "codigo server"
npm install
npm run dev
```

### Aplicación Expo

```bash
cd "codigo app"
npm install
npx expo start
```

**Nota:** Recuerda configurar el archivo `codigo server/.env.local` antes de iniciar el servidor.