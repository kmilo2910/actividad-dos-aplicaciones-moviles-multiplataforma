import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'Nexus Campus Digital API',
    version: '1.0.0',
    description: 'Contratos de la API full-stack de Nexus Campus Digital.',
  },
  servers: [{ url: '/api', description: 'API del despliegue actual' }],
  tags: [
    { name: 'Books', description: 'Catálogo y portadas' },
    { name: 'Spaces', description: 'Espacios de coworking' },
    { name: 'Purchases', description: 'Adquisiciones del usuario' },
    { name: 'Reservations', description: 'Reservas del usuario' },
    { name: 'System', description: 'Estado y documentación' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Comprueba la salud de la aplicación y PostgreSQL',
        responses: {
          200: { description: 'Servicios disponibles' },
          503: { description: 'Base de datos no disponible' },
        },
      },
    },
    '/openapi': {
      get: {
        tags: ['System'],
        summary: 'Obtiene este contrato OpenAPI',
        responses: { 200: { description: 'Especificación OpenAPI en JSON' } },
      },
    },
    '/books': {
      get: {
        tags: ['Books'],
        summary: 'Lista libros y revistas',
        parameters: [{ $ref: '#/components/parameters/Language' }],
        responses: { 200: { description: 'Catálogo de publicaciones' } },
      },
    },
    '/books/{id}': {
      get: {
        tags: ['Books'],
        summary: 'Obtiene una publicación',
        parameters: [
          { $ref: '#/components/parameters/Id' },
          { $ref: '#/components/parameters/Language' },
        ],
        responses: { 200: { description: 'Publicación' }, 404: { description: 'No encontrada' } },
      },
    },
    '/books/{id}/cover': {
      get: {
        tags: ['Books'],
        summary: 'Obtiene la portada de una publicación',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          302: { description: 'Redirección a la portada' },
          404: { description: 'Portada no disponible' },
        },
      },
    },
    '/books/bestsellers/top': {
      get: {
        tags: ['Books'],
        summary: 'Lista las 10 publicaciones más vendidas',
        parameters: [{ $ref: '#/components/parameters/Language' }],
        responses: { 200: { description: 'Más vendidos' } },
      },
    },
    '/spaces': {
      get: {
        tags: ['Spaces'],
        summary: 'Lista los espacios de coworking',
        parameters: [{ $ref: '#/components/parameters/Language' }],
        responses: { 200: { description: 'Espacios' } },
      },
    },
    '/spaces/{id}': {
      get: {
        tags: ['Spaces'],
        summary: 'Obtiene un espacio',
        parameters: [
          { $ref: '#/components/parameters/Id' },
          { $ref: '#/components/parameters/Language' },
        ],
        responses: { 200: { description: 'Espacio' }, 404: { description: 'No encontrado' } },
      },
    },
    '/purchases': {
      get: {
        tags: ['Purchases'],
        summary: 'Lista las adquisiciones del usuario autenticado',
        security: [{ session: [] }],
        responses: {
          200: { description: 'Adquisiciones' },
          401: { description: 'No autenticado' },
        },
      },
      post: {
        tags: ['Purchases'],
        summary: 'Adquiere una publicación',
        security: [{ session: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['bookId'],
                properties: { bookId: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          201: { description: 'Adquisición creada' },
          400: { description: 'Solicitud inválida' },
          401: { description: 'No autenticado' },
        },
      },
    },
    '/reservations': {
      get: {
        tags: ['Reservations'],
        summary: 'Lista las reservas del usuario autenticado',
        security: [{ session: [] }],
        responses: { 200: { description: 'Reservas' }, 401: { description: 'No autenticado' } },
      },
      post: {
        tags: ['Reservations'],
        summary: 'Crea una reserva',
        security: [{ session: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ReservationInput' } },
          },
        },
        responses: {
          201: { description: 'Reserva creada' },
          400: { description: 'Solicitud inválida' },
          401: { description: 'No autenticado' },
        },
      },
    },
    '/reservations/{id}/cancel': {
      patch: {
        tags: ['Reservations'],
        summary: 'Cancela una reserva',
        security: [{ session: [] }],
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: { description: 'Reserva cancelada' },
          400: { description: 'No se puede cancelar' },
          401: { description: 'No autenticado' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      session: {
        type: 'apiKey',
        in: 'cookie',
        name: 'appSession',
        description: 'Sesión Auth0 de la aplicación',
      },
    },
    parameters: {
      Id: { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      Language: {
        name: 'lang',
        in: 'query',
        required: false,
        schema: { type: 'string', enum: ['es', 'en', 'fr', 'it', 'de'], default: 'es' },
      },
    },
    schemas: {
      ReservationInput: {
        type: 'object',
        required: ['spaceId', 'reservationDate', 'reservationTime', 'durationMinutes'],
        properties: {
          spaceId: { type: 'string' },
          reservationDate: { type: 'string', format: 'date' },
          reservationTime: { type: 'string', example: '08:00' },
          durationMinutes: { type: 'integer', enum: [15, 30, 45, 60] },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(openapi);
}
