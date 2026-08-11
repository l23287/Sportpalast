import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Account } from '../types';
import { loadJSON, saveJSON } from '../lib/storage';

interface AuthContextValue {
  account: Account | null;
  isAuthenticated: boolean;
  register: (username: string) => void;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(() => loadJSON<Account | null>('account', null));
  const [isAuthenticated, setIsAuthenticated] = useState(() => loadJSON('session', false));

  useEffect(() => saveJSON('account', account), [account]);
  useEffect(() => saveJSON('session', isAuthenticated), [isAuthenticated]);

  const value = useMemo<AuthContextValue>(
    () => ({
      account,
      isAuthenticated,
      register: (username) => {
        setAccount({ username });
        setIsAuthenticated(true);
      },
      login: (username) => {
        setAccount((prev) => prev ?? { username });
        setIsAuthenticated(true);
      },
      logout: () => setIsAuthenticated(false),
    }),
    [account, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
