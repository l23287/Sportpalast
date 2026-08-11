import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Sport } from '../types';
import { DEFAULT_SPORT } from '../lib/sport';
import { loadJSON, saveJSON } from '../lib/storage';

interface SportContextValue {
  sport: Sport;
  setSport: (sport: Sport) => void;
}

const SportContext = createContext<SportContextValue | null>(null);

export function SportProvider({ children }: { children: ReactNode }) {
  const [sport, setSport] = useState<Sport>(() => loadJSON<Sport>('sport', DEFAULT_SPORT));

  useEffect(() => saveJSON('sport', sport), [sport]);

  const value = useMemo<SportContextValue>(() => ({ sport, setSport }), [sport]);

  return <SportContext.Provider value={value}>{children}</SportContext.Provider>;
}

export function useSport(): SportContextValue {
  const ctx = useContext(SportContext);
  if (!ctx) throw new Error('useSport must be used within SportProvider');
  return ctx;
}
