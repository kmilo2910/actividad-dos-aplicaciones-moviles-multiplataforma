import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearAccessToken, restoreAccessToken, saveAccessToken } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreAccessToken()
      .then(setToken)
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      token,
      isLoading,
      isAuthenticated: Boolean(token),
      async signInWithToken(nextToken) {
        await saveAccessToken(nextToken);
        setToken(nextToken);
      },
      async signOut() {
        await clearAccessToken();
        setToken(null);
      },
    }),
    [isLoading, token],
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
