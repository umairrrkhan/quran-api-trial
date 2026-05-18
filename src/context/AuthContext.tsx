import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { buildLoginUrl, exchangeCodeForTokens, refreshAccessToken } from '../services/qfOAuth';
import type { AuthSession, TokenSet, QfUser } from '../services/qfOAuth';

const SESSION_KEY = 'qf_auth_session';
const TOKEN_KEY = 'qf_tokens';
const USER_KEY = 'qf_user';
const ISSUED_KEY = 'qf_tokens_issued_at';

interface AuthContextType {
  user: QfUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function decodeIdToken(token: string): QfUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return {
      sub: payload.sub,
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
    };
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<QfUser | null>(() => {
    try {
      const raw = sessionStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [tokens, setTokens] = useState<TokenSet | null>(() => {
    try {
      const raw = sessionStorage.getItem(TOKEN_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAuthenticated = !!user;

  const clearAuth = useCallback(() => {
    setUser(null);
    setTokens(null);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(ISSUED_KEY);
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    window.location.href = '/';
  }, [clearAuth]);

  const refresh = useCallback(async (rt: string): Promise<TokenSet | null> => {
    const result = await refreshAccessToken(rt);
    if (!result) {
      clearAuth();
      return null;
    }
    setTokens(result);
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(result));
    sessionStorage.setItem(ISSUED_KEY, String(Date.now()));
    return result;
  }, [clearAuth]);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!tokens) return null;
    const issuedAt = sessionStorage.getItem(ISSUED_KEY);
    if (issuedAt) {
      const elapsed = (Date.now() - parseInt(issuedAt, 10)) / 1000;
      if (elapsed < tokens.expiresIn - 60) {
        return tokens.accessToken;
      }
    }
    if (tokens.refreshToken) {
      const refreshed = await refresh(tokens.refreshToken);
      return refreshed?.accessToken || null;
    }
    return null;
  }, [tokens, refresh]);

  const login = useCallback(() => {
    buildLoginUrl().then(({ url, session }) => {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      window.location.href = url;
    });
  }, []);

  useEffect(() => {
    if (tokens?.refreshToken) {
      const issueTime = sessionStorage.getItem(ISSUED_KEY);
      if (issueTime) {
        const elapsed = (Date.now() - parseInt(issueTime, 10)) / 1000;
        if (elapsed >= tokens.expiresIn - 60) {
          refresh(tokens.refreshToken);
        }
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (tokens?.expiresIn && tokens?.refreshToken) {
      const ms = (tokens.expiresIn - 60) * 1000;
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => {
        if (tokens.refreshToken) refresh(tokens.refreshToken);
      }, Math.max(ms, 10000));
    }
    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, [tokens, refresh]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export function exchangeAndStore(code: string, codeVerifier: string, redirectUri: string): Promise<QfUser | null> {
  return exchangeCodeForTokens(code, codeVerifier, redirectUri).then((tokens) => {
    if (!tokens) return null;
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    sessionStorage.setItem(ISSUED_KEY, String(Date.now()));
    sessionStorage.removeItem(SESSION_KEY);
    if (tokens.idToken) {
      const user = decodeIdToken(tokens.idToken);
      if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      return user || null;
    }
    return null;
  });
}

export { getStoredSession, getStoredTokens };

function getStoredSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function getStoredTokens(): TokenSet | null {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
