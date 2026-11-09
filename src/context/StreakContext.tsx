// IFCM FS-022 / C12 Streak: speichert die aktiven Tage (gemeinsam für alle Sportarten) und den Schalter
// „Streak anzeigen“. recordActivity() kann beliebig oft am Tag aufgerufen werden – jeder Tag zählt nur einmal.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadJSON, saveJSON } from '../lib/storage';
import { generateId } from '../lib/id'; // IFCM FS-023 / C14
import { toDateKey } from '../lib/calendar';
import { MAX_STORED_DAYS, computeStreak, type StreakInfo } from '../lib/streak';

// IFCM FS-023 / C14: Protokoll absolvierter Übungen – Grundlage für „Trainingszeit pro Woche“ und „diese Woche
// absolviert“ in der Statistik. Gespeichert wird nur die Übung (Name zur Anzeige), Sportart, Datum und Dauer –
// keine Personen. Gilt ab jetzt; rückwirkend gibt es keine Einträge.
export interface ActivityEntry {
  id: string;
  date: string; // „JJJJ-MM-TT“
  sport: string;
  exerciseId: string;
  exerciseName: string;
  seconds: number; // Dauer (Countdown) · geschätzte Dauer (Sätze) · gemessene Zeit („Zeit messen“)
  kind: 'duration' | 'sets' | 'stopwatch';
}

/** Höchstens so viele Protokoll-Einträge (älteste fallen weg), damit der Browser-Speicher klein bleibt. */
export const MAX_LOG_ENTRIES = 1500;

interface StreakContextValue extends StreakInfo {
  enabled: boolean; // nur die ANZEIGE – gezählt wird immer, damit beim Einschalten alles stimmt
  setEnabled: (enabled: boolean) => void;
  recordActivity: () => void; // heutigen Tag als aktiv merken
  // IFCM FS-023 / C14: absolvierte Übung protokollieren (zählt automatisch auch für den Streak)
  log: ActivityEntry[];
  logCompletedExercise: (entry: Omit<ActivityEntry, 'id' | 'date'>) => void;
  activeDays: string[]; // für das Aktivitäts-Raster in der Statistik
}

const StreakContext = createContext<StreakContextValue | null>(null);

export function StreakProvider({ children }: { children: ReactNode }) {
  const [days, setDays] = useState<string[]>(() => loadJSON<string[]>('streakDays', []));
  const [enabled, setEnabled] = useState<boolean>(() => loadJSON<boolean>('streakEnabled', true)); // Standard: an
  useEffect(() => saveJSON('streakDays', days), [days]);
  useEffect(() => saveJSON('streakEnabled', enabled), [enabled]);
  const [log, setLog] = useState<ActivityEntry[]>(() => loadJSON<ActivityEntry[]>('activityLog', [])); // IFCM FS-023 / C14
  useEffect(() => saveJSON('activityLog', log), [log]);

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
      // IFCM FS-023 / C14
      log,
      activeDays: days,
      logCompletedExercise: (entry) => {
        const key = toDateKey(new Date());
        setLog((prev) => [...prev, { ...entry, id: generateId(), date: key }].slice(-MAX_LOG_ENTRIES));
        setDays((prev) => (prev.includes(key) ? prev : [...prev, key].sort().slice(-MAX_STORED_DAYS)));
      },
    };
  }, [days, enabled, log]);

  return <StreakContext.Provider value={value}>{children}</StreakContext.Provider>;
}

export function useStreak(): StreakContextValue {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error('useStreak must be used within StreakProvider');
  return ctx;
}
