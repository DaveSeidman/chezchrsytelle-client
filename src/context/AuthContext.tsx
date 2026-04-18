import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import type { User } from '../types/api';
import { apiRequest, getApiUrl, getStoredToken, setStoredToken } from '../services/api';

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  setToken: (token: string | null) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshUser() {
    setIsLoading(true);

    try {
      const response = await apiRequest<{ user: User | null }>('/api/auth/me');
      setUser(response.user);
    } catch (_error) {
      setStoredToken(null);
      setTokenState(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  function setToken(nextToken: string | null) {
    setStoredToken(nextToken);
    setTokenState(nextToken);
  }

  function login() {
    window.location.assign(`${getApiUrl()}/auth/google`);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    void refreshUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        login,
        logout,
        setToken,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
