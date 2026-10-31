export const WEB_APP_URL =
  process.env.EXPO_PUBLIC_WEB_APP_URL || 'https://nexus-library-neon.vercel.app';

export const APP_CONFIG = {
  webAppUrl: WEB_APP_URL,
  navigationTimeoutMs: 15000,
};
