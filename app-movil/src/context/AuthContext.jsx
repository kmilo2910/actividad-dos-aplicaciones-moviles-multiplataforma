import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import {
  AuthRequest,
  ResponseType,
  exchangeCodeAsync,
  makeRedirectUri,
  useAutoDiscovery,
} from 'expo-auth-session';
import { APP_CONFIG } from '../config/environment';
import { clearAccessToken, restoreAccessToken, saveAccessToken } from '../services/auth';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext(null);
const PENDING_AUTH_KEY = 'nexus.pendingAuthRequest';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const discovery = useAutoDiscovery(`https://${APP_CONFIG.auth0.domain}`);
  const redirectUri = makeRedirectUri({
    scheme: 'nexus',
    path: 'auth/callback',
    isTripleSlashed: true,
  });

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (__DEV__ && url?.includes('/auth/callback')) {
        console.log('[Auth] Initial auth callback detected.');
      }
    });

    restoreAccessToken()
      .then((restoredToken) => {
        console.log('[Auth] Restored session:', Boolean(restoredToken));
        setToken(restoredToken);
      })
      .finally(() => setIsLoading(false));

  }, []);

  useEffect(() => {
    if (!discovery || token) return undefined;

    let cancelled = false;

    async function completeInitialCallback() {
      const url = await Linking.getInitialURL();

      if (!url?.includes('/auth/callback')) return;

      const parsed = Linking.parse(url);
      const code = parsed.queryParams?.code;
      const state = parsed.queryParams?.state;
      const pendingRequest = await AsyncStorage.getItem(PENDING_AUTH_KEY);

      console.log('[Auth] Processing initial callback:', {
        hasCode: Boolean(code),
        hasState: Boolean(state),
        hasPendingRequest: Boolean(pendingRequest),
      });

      if (!code || !state || !pendingRequest) return;

      const pending = JSON.parse(pendingRequest);

      if (state !== pending.state) {
        console.error('[Auth] OAuth state mismatch.');
        await AsyncStorage.removeItem(PENDING_AUTH_KEY);
        return;
      }

      const tokenResponse = await exchangeCodeAsync(
        {
          clientId: APP_CONFIG.auth0.clientId,
          code,
          redirectUri: pending.redirectUri,
          extraParams: {
            code_verifier: pending.codeVerifier,
          },
        },
        discovery,
      );

      console.log('[Auth] Initial callback token exchange completed:', {
        hasAccessToken: Boolean(tokenResponse.accessToken),
        error: tokenResponse.error ?? null,
        errorDescription: tokenResponse.errorDescription ?? null,
      });

      await AsyncStorage.removeItem(PENDING_AUTH_KEY);

      if (!cancelled && tokenResponse.accessToken) {
        await saveAccessToken(tokenResponse.accessToken);
        setToken(tokenResponse.accessToken);
      }
    }

    completeInitialCallback().catch((error) => {
      console.error('[Auth] Initial callback processing failed:', error);
    });

    return () => {
      cancelled = true;
    };
  }, [discovery, redirectUri, token]);

  async function signIn() {
    if (!discovery) {
      throw new Error('Auth0 todavía no está disponible. Inténtalo de nuevo.');
    }

    console.log('[Auth] Redirect URI:', redirectUri);

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

    const authUrl = await request.makeAuthUrlAsync(discovery);

    await AsyncStorage.setItem(
      PENDING_AUTH_KEY,
      JSON.stringify({
        state: request.state,
        codeVerifier: request.codeVerifier,
        redirectUri,
      }),
    );

    const result = await request.promptAsync(discovery, { url: authUrl });

    console.log('[Auth] Auth0 result:', {
      type: result.type,
      hasCode: Boolean(result.params?.code),
      error: result.error ?? null,
      errorDescription: result.params?.error_description ?? null,
      params: Object.keys(result.params ?? {}),
    });

    if (result.type !== 'success' || !result.params?.code) {
      await AsyncStorage.removeItem(PENDING_AUTH_KEY);

      if (result.type === 'cancel' || result.type === 'dismiss') {
        throw new Error('Inicio de sesión cancelado.');
      }

      throw new Error('Auth0 no devolvió un código de autorización válido.');
    }

    console.log('[Auth] Starting token exchange:', {
      hasCodeVerifier: Boolean(request.codeVerifier),
      tokenEndpoint: discovery.tokenEndpoint,
    });

    let tokenResponse;

    try {
      tokenResponse = await exchangeCodeAsync(
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
    } catch (error) {
      console.error('[Auth] Token exchange failed:', error);
      throw error;
    }

    console.log('[Auth] Token exchange completed:', {
      hasAccessToken: Boolean(tokenResponse.accessToken),
      tokenType: tokenResponse.tokenType ?? null,
      error: tokenResponse.error ?? null,
      errorDescription: tokenResponse.errorDescription ?? null,
    });

    await AsyncStorage.removeItem(PENDING_AUTH_KEY);

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
