# Nexus Campus Digital Mobile

Aplicación móvil nativa Expo/React Native para el proyecto Nexus.

## Inicio

```bash
npm install
npm start
```

La aplicación nativa consume el backend configurado en `EXPO_PUBLIC_API_BASE_URL`. Si no se define, se utiliza la URL pública de Nexus configurada en `src/config/environment.js`.

## Arquitectura inicial

- Expo Router con Stack y Tabs.
- Catálogo y detalle de libros consumidos desde `/api/books`.
- Cliente HTTP común en `src/services/api.js`.
- NativeWind con una paleta Nexus.
- Tipografías Inter y Space Grotesk.
- Feedback háptico para acciones importantes.
- Contexto de autenticación preparado para el token Bearer del backend.

## Desarrollo

```bash
npm install
npm start
```

El endpoint público de catálogo se valida con `GET /api/books`. Las operaciones de adquisiciones y reservas requieren autenticación y devuelven `401 AUTH_REQUIRED` cuando no existe un token válido.
