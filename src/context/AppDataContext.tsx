import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type {
  Exercise,
  ExerciseInput,
  PlanInput,
  ServeResult,
  Sport,
  ServeSession,
  ServeSessionGoal,
  TrainingPlan,
} from '../types';
import { generateId } from '../lib/id';
import { loadJSON, saveJSON } from '../lib/storage';
// IFCM FS-001 / C01: aktuelle Sportart und Migration alter Daten
import { useSport } from './SportContext';
import { withSport } from '../lib/sport';
import { migrateExerciseDurations } from '../lib/duration'; // IFCM FS-009 / C07
import { cleanNote } from '../lib/note'; // IFCM FS-010 / C08
import { isNewBest } from '../lib/stopwatch'; // IFCM FS-019 / C13

interface AppDataContextValue {
  // IFCM FS-001 / C01: `plans` und `exercises` enthalten nur noch die Einträge der aktuell gewählten Sportart.
  // Alle Seiten (Pläne, Übungen, Statistiken, Plan-Formular) zeigen dadurch automatisch nur passende Inhalte.
  plans: TrainingPlan[];
  exercises: Exercise[];
  addPlan: (input: PlanInput) => TrainingPlan;
  updatePlan: (id: string, input: PlanInput) => void;
  deletePlan: (id: string) => void;
  getPlan: (id: string) => TrainingPlan | undefined;
  addExercise: (input: ExerciseInput) => Exercise;
  updateExercise: (id: string, input: ExerciseInput) => void;
  // IFCM FS-010 / C08: nur die Notiz einer Übung ändern (aus dem Timer, ohne das ganze Formular)
  updateExerciseNote: (id: string, note: string) => void;
  // IFCM FS-017 / C11: nur das Vorgabe-Gewicht einer Übung ändern (schnelles +/− ohne Formular)
  updateExerciseWeight: (id: string, weightKg: number) => void;
  // IFCM FS-019 / C13: gemessene Zeit übernehmen → letzte Zeit, ggf. neue Bestzeit (kleiner = besser)
  recordExerciseTime: (id: string, timeMs: number) => void;
  deleteExercise: (id: string) => void;
  getExercise: (id: string) => Exercise | undefined;
  // IFCM FS-002 / C02: Anzahl und Löschen aller Pläne/Übungen einer Sportart (für das Löschen eigener Sportarten)
  countForSport: (sport: Sport) => { plans: number; exercises: number };
  deleteAllForSport: (sport: Sport) => void;
  serveSessions: ServeSession[];
  startServeSession: (goal: ServeSessionGoal) => ServeSession;
  addServeAttempt: (sessionId: string, result: ServeResult) => void;
  endServeSession: (sessionId: string) => void;
  deleteServeSession: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  // IFCM FS-001 / C01: Der State hält weiterhin ALLE Pläne/Übungen aller Sportarten (es geht nichts verloren).
  // Beim Laden werden alte Einträge ohne Sportart per `withSport` Tischtennis zugeordnet (Migration).
  const [plans, setPlans] = useState<TrainingPlan[]>(() => withSport(loadJSON<TrainingPlan[]>('plans', [])));
  const [exercises, setExercises] = useState<Exercise[]>(() =>
    // IFCM FS-009 / C07: zusätzlich Minuten → Sekunden umrechnen (alte Übungen)
    withSport(migrateExerciseDurations(loadJSON<Exercise[]>('exercises', []))),
  );
  const { sport } = useSport();
  const [serveSessions, setServeSessions] = useState<ServeSession[]>(() => loadJSON('serveSessions', []));

  useEffect(() => saveJSON('plans', plans), [plans]);
  useEffect(() => saveJSON('exercises', exercises), [exercises]);
  useEffect(() => saveJSON('serveSessions', serveSessions), [serveSessions]);

  // IFCM FS-001 / C01: Gefilterte Sicht auf die Daten der aktuell gewählten Sportart.
  const sportPlans = useMemo(() => plans.filter((p) => p.sport === sport), [plans, sport]);
  const sportExercises = useMemo(() => exercises.filter((e) => e.sport === sport), [exercises, sport]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      plans: sportPlans, // IFCM FS-001 / C01: nur aktuelle Sportart
      exercises: sportExercises, // IFCM FS-001 / C01: nur aktuelle Sportart
      addPlan: (input) => {
        // IFCM FS-001 / C01: neuer Plan bekommt automatisch die aktuell gewählte Sportart
        const plan: TrainingPlan = { ...input, sport, id: generateId(), createdAt: new Date().toISOString() };
        setPlans((prev) => [plan, ...prev]);
        return plan;
      },
      updatePlan: (id, input) => {
        setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...input } : p)));
      },
      deletePlan: (id) => {
        setPlans((prev) => prev.filter((p) => p.id !== id));
      },
      // IFCM FS-001 / C01: Pläne anderer Sportarten werden nicht gefunden (Detailseite zeigt „nicht gefunden“)
      getPlan: (id) => sportPlans.find((p) => p.id === id),
      addExercise: (input) => {
        const exercise: Exercise = {
          ...input,
          sport, // IFCM FS-001 / C01: neue Übung bekommt automatisch die aktuell gewählte Sportart
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        setExercises((prev) => [exercise, ...prev]);
        return exercise;
      },
      // IFCM FS-010 / C08: Notiz bereinigt speichern; leere Notiz entfernt das Feld wieder
      // IFCM FS-017 / C11: 0 kg = kein Gewicht (null); die geschätzte Dauer bleibt gleich (Gewicht ändert sie nicht)
      updateExerciseWeight: (id, weightKg) => {
        setExercises((prev) => prev.map((e) => (e.id === id ? { ...e, weightKg: weightKg > 0 ? weightKg : null } : e)));
      },
      recordExerciseTime: (id, timeMs) => {
        setExercises((prev) =>
          prev.map((e) =>
            e.id === id
              ? { ...e, lastTimeMs: timeMs, bestTimeMs: isNewBest(timeMs, e.bestTimeMs) ? timeMs : e.bestTimeMs }
              : e,
          ),
        );
      },
      updateExerciseNote: (id, note) => {
        const cleaned = cleanNote(note);
        setExercises((prev) =>
          prev.map((e) => {
            if (e.id !== id) return e;
            if (cleaned) return { ...e, note: cleaned };
            const { note: _removed, ...rest } = e; // Feld „note“ weglassen
            return rest;
          }),
        );
      },
      updateExercise: (id, input) => {
        setExercises((prev) => prev.map((e) => (e.id === id ? { ...e, ...input } : e)));
      },
      deleteExercise: (id) => {
        setExercises((prev) => prev.filter((e) => e.id !== id));
        setPlans((prev) =>
          prev.map((p) => ({ ...p, exerciseIds: p.exerciseIds.filter((eid) => eid !== id) })),
        );
      },
      getExercise: (id) => sportExercises.find((e) => e.id === id), // IFCM FS-001 / C01: nur aktuelle Sportart
      // IFCM FS-002 / C02: zählt über ALLE gespeicherten Daten, nicht nur die aktuelle Sportart
      countForSport: (target) => ({
        plans: plans.filter((p) => p.sport === target).length,
        exercises: exercises.filter((e) => e.sport === target).length,
      }),
      deleteAllForSport: (target) => {
        setPlans((prev) => prev.filter((p) => p.sport !== target));
        setExercises((prev) => prev.filter((e) => e.sport !== target));
      },
      serveSessions,
      startServeSession: (goal) => {
        const session: ServeSession = {
          ...goal,
          id: generateId(),
          attempts: [],
          startedAt: new Date().toISOString(),
          endedAt: null,
        };
        setServeSessions((prev) => [session, ...prev]);
        return session;
      },
      addServeAttempt: (sessionId, result) => {
        setServeSessions((prev) =>
          prev.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  attempts: [...session.attempts, { id: generateId(), result, createdAt: new Date().toISOString() }],
                }
              : session,
          ),
        );
      },
      endServeSession: (sessionId) => {
        setServeSessions((prev) =>
          prev.map((session) => (session.id === sessionId ? { ...session, endedAt: new Date().toISOString() } : session)),
        );
      },
      deleteServeSession: (id) => {
        setServeSessions((prev) => prev.filter((session) => session.id !== id));
      },
    }),
    // IFCM FS-001 / C01: `sport` und die gefilterten Listen als Abhängigkeiten ergänzt
    // IFCM FS-002 / C02: `plans`/`exercises` ergänzt (für countForSport)
    [sport, plans, exercises, sportPlans, sportExercises, serveSessions],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
