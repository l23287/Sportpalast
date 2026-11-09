// IFCM FS-022 / C12 Streak: speichert die aktiven Tage (gemeinsam für alle Sportarten) und den Schalter
// „Streak anzeigen“. recordActivity() kann beliebig oft am Tag aufgerufen werden – jeder Tag zählt nur einmal.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadJSON, saveJSON } from '../lib/storage';
import { toDateKey } from '../lib/calendar';
import { MAX_STORED_DAYS, computeStreak, type StreakInfo } from '../lib/streak';

interface StreakContextValue extends StreakInfo {
  enabled: boolean; // nur die ANZEIGE – gezählt wird immer, damit beim Einschalten alles stimmt
  setEnabled: (enabled: boolean) => void;
  recordActivity: () => void; // heutigen Tag als aktiv merken
}

const StreakContext = createContext<StreakContextValue | null>(null);

export function StreakProvider({ children }: { children: ReactNode }) {
  const [days, setDays] = useState<string[]>(() => loadJSON<string[]>('streakDays', []));
  const [enabled, setEnabled] = useState<boolean>(() => loadJSON<boolean>('streakEnabled', true)); // Standard: an
  useEffect(() => saveJSON('streakDays', days), [days]);
  useEffect(() => saveJSON('streakEnabled', enabled), [enabled]);

  const value = useMemo<StreakContextValue>(() => {
    const todayKey = toDateKey(new Date());
    return {
      ...computeStreak(days, todayKey),
      enabled,
      setEnabled,
      recordActivity: () => {
        const key = toDateKey(new Date());
        setDays((prev) => (prev.includes(key) ? prev : [...prev, key].sort().slice(-MAX_STORED_DAYS)));
      },
    };
  }, [days, enabled]);

  return <StreakContext.Provider value={value}>{children}</StreakContext.Provider>;
}

export function useStreak(): StreakContextValue {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error('useStreak must be used within StreakProvider');
  return ctx;
}
