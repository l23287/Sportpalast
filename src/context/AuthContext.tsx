import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Account } from '../types';
import { loadJSON, saveJSON } from '../lib/storage';
import { hashPassword } from '../lib/password';

interface AuthContextValue {
  account: Account | null;
  isAuthenticated: boolean;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
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
      register: async (username, password) => {
        const passwordHash = await hashPassword(password);
        setAccount({ username, passwordHash });
        setIsAuthenticated(true);
      },
      login: async (username, password) => {
        const passwordHash = await hashPassword(password);
        if (!account || account.username !== username || account.passwordHash !== passwordHash) {
          return false;
        }
        setIsAuthenticated(true);
        return true;
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
