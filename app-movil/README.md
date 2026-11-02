# Nexus Campus Digital Mobile

Aplicación móvil nativa Expo/React Native para el proyecto Nexus.

## Requisitos

- Node.js LTS y npm.
- Android Studio, Android SDK, JDK y un emulador o dispositivo Android para ejecutar Android.
- Xcode y CocoaPods para ejecutar iOS en macOS.
- Un development build para probar OAuth con el esquema `nexus://`.

## Configuración de entorno

Copia el archivo de ejemplo y completa el Client ID de Auth0:

```bash
cp .env.example .env
```

Las variables `EXPO_PUBLIC_*` no deben contener secretos. El archivo `.env` está ignorado por Git.

Auth0 debe permitir este callback para la aplicación móvil:

```text
nexus://auth/callback
```

## Instalación

```bash
npm install
```

La aplicación consume el backend configurado en `EXPO_PUBLIC_API_BASE_URL`. Si no se define, utiliza la URL pública configurada en `src/config/environment.js`.

## Arquitectura inicial

- Expo Router con Stack y Tabs.
- Catálogo y detalle de libros consumidos desde `/api/books`.
- Cliente HTTP común en `src/services/api.js`.
- NativeWind con una paleta Nexus.
- Tipografías Inter y Space Grotesk.
- Feedback háptico para acciones importantes.
- Contexto de autenticación preparado para el token Bearer del backend.
- Inicio de sesión OAuth 2.0 con Auth0 y Google mediante PKCE.

## Ejecutar en desarrollo

```bash
npm start
```

Para ejecutar con development build y limpiar la caché de Metro:

```bash
npx expo start --dev-client --clear
```

Para ejecutar en Android conectado a un emulador o dispositivo:

```bash
npm run android
```

Para ejecutar en iOS:

```bash
npm run ios
```

También se puede abrir el proyecto web con:

```bash
npm run web
```

El endpoint público de catálogo se valida con `GET /api/books`. Las operaciones de adquisiciones y reservas requieren autenticación y devuelven `401 AUTH_REQUIRED` cuando no existe un token válido.

## Regenerar y compilar los proyectos nativos

Después de cambiar el icono, splash screen o instalar un módulo nativo:

```bash
npx expo prebuild
```

Compilar e instalar una versión debug en Android:

```bash
npx expo run:android
```

Compilar e instalar una versión debug en iOS:

```bash
npx expo run:ios
```

Exportar el bundle Android para validar la compilación JavaScript:

```bash
npx expo export --platform android
```

En Android, si Gradle no encuentra el SDK, configura `ANDROID_HOME` o crea `android/local.properties` localmente:

```text
sdk.dir=/ruta/absoluta/al/Android/sdk
```

`android/local.properties` no debe subirse al repositorio.

## Funcionalidades principales

- Inicio de sesión OAuth 2.0 con Auth0 y Google mediante PKCE.
- Navegación con Stack y Tabs mediante Expo Router.
- Catálogo, detalle, adquisición y descarga de publicaciones.
- Reservas y cancelaciones de espacios de coworking.
- Retroalimentación háptica en acciones relevantes.
- NativeWind, Safe Area y tipografías Inter y Space Grotesk.
