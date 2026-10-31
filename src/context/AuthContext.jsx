import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  AuthRequest,
  ResponseType,
  makeRedirectUri,
  useAutoDiscovery,
} from 'expo-auth-session';
import { APP_CONFIG } from '../config/environment';
import { clearAccessToken, restoreAccessToken, saveAccessToken } from '../services/auth';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const discovery = useAutoDiscovery(`https://${APP_CONFIG.auth0.domain}`);
  const redirectUri = makeRedirectUri({ scheme: 'nexus', path: 'auth/callback' });

  useEffect(() => {
    restoreAccessToken()
      .then(setToken)
      .finally(() => setIsLoading(false));
  }, []);

  async function signIn() {
    if (!discovery) {
      throw new Error('Auth0 todavía no está disponible. Inténtalo de nuevo.');
    }

    const request = new AuthRequest({
      clientId: APP_CONFIG.auth0.clientId,
      responseType: ResponseType.Code,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      redirectUri,
      usePKCE: true,
      extraParams: {
        audience: APP_CONFIG.auth0.audience,
        connection: APP_CONFIG.auth0.connection,
        prompt: 'login',
      },
    });

    const result = await request.promptAsync(discovery);

    if (result.type !== 'success' || !result.params?.code) {
      if (result.type === 'cancel' || result.type === 'dismiss') {
        throw new Error('Inicio de sesión cancelado.');
      }

      throw new Error('Auth0 no devolvió un código de autorización válido.');
    }

    const tokenResponse = await request.exchangeCodeAsync(
      {
        clientId: APP_CONFIG.auth0.clientId,
        code: result.params.code,
        redirectUri,
        extraParams: {
          code_verifier: request.codeVerifier,
        },
      },
      discovery,
    );

    if (!tokenResponse.accessToken) {
      throw new Error('Auth0 no devolvió un access token.');
    }

    await saveAccessToken(tokenResponse.accessToken);
    setToken(tokenResponse.accessToken);
  }

  const value = useMemo(
    () => ({
      token,
      isLoading,
      isAuthenticated: Boolean(token),
      isAuth0Ready: Boolean(discovery),
      redirectUri,
      signIn,
      async signOut() {
        await clearAccessToken();
        setToken(null);
      },
    }),
    [discovery, isLoading, redirectUri, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  }

  return context;
}
