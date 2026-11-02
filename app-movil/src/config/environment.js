export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'https://nexus-library-neon-seven.vercel.app';

export const AUTH0_DOMAIN =
  process.env.EXPO_PUBLIC_AUTH0_DOMAIN || 'dev-cnnst26t748qwnqg.us.auth0.com';

export const AUTH0_CLIENT_ID =
  process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || 'l3iTHavKSORr2lQQGQ0c4Ec4TryWG8PQ';

export const AUTH0_AUDIENCE =
  process.env.EXPO_PUBLIC_AUTH0_AUDIENCE || 'https://nexus-api';

export const AUTH0_CONNECTION =
  process.env.EXPO_PUBLIC_AUTH0_CONNECTION || 'google-oauth2';

export const APP_CONFIG = {
  apiBaseUrl: API_BASE_URL,
  auth0: {
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID,
    audience: AUTH0_AUDIENCE,
    connection: AUTH0_CONNECTION,
  },
};
