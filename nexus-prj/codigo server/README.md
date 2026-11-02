# Nexus Frontend

Frontend Next.js con App Router, React, Firebase Authentication y arquitectura hexagonal.

## Arquitectura

- `core`: puertos y contratos.
- `application`: casos de uso.
- `infrastructure`: adaptadores de Firebase y HTTP.
- `app`: interfaz Next.js y composición de páginas.

## Ejecutar

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Abre `http://localhost:3000/login`, inicia sesión con Google y la aplicación enviará el ID Token al backend en `/api/auth/me`.
