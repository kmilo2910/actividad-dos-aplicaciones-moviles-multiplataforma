# Nexus Campus Digital Mobile

Aplicación móvil Expo basada en WebView para el proyecto Nexus.

## Inicio

```bash
npm install
npm start
```

La URL cargada por el WebView se configura con `EXPO_PUBLIC_WEB_APP_URL`. Si no se define, se utiliza la URL pública de Nexus configurada en `src/config/environment.js`.

## Alcance de esta base

- Contenedor WebView.
- Indicador de carga.
- Pantalla de error y reintento.
- Navegación hacia atrás mediante el botón físico.
- Soporte inicial para cookies compartidas y almacenamiento web, necesario para la sesión de Auth0.
