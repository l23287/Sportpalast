// IFCM FS-013 / C09 Zielsetzungstool: Speicherung und Verwaltung der Kernziele.
// Eigener Context (statt AppDataContext), damit das Zieltool klar abgegrenzt bleibt. Gespeichert wird wie alle
// Daten nur lokal im Browser (Schlüssel „goals“).
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Goal, GoalInput, Sport } from '../types';
import { generateId } from '../lib/id';
import { loadJSON, saveJSON } from '../lib/storage';
import { MAX_GOAL_MEASURE, MAX_GOAL_TEXT, MAX_OPEN_GOALS } from '../lib/goals';
import { useSport } from './SportContext';

interface GoalsContextValue {
  goals: Goal[]; // nur Ziele der aktuellen Sportart (C01-Prinzip)
  openGoals: Goal[]; // noch nicht erreicht
  achievedGoals: Goal[]; // erreicht (zum „Feiern“)
  canAddGoal: boolean; // weniger als 3 offene Ziele
  addGoal: (input: GoalInput) => string | null; // Fehlermeldung oder null
  updateGoal: (id: string, input: GoalInput) => string | null;
  toggleAchieved: (id: string) => void;
  deleteGoal: (id: string) => void;
  deleteGoalsForSport: (sport: Sport) => void; // beim Löschen einer eigenen Sportart
  // IFCM FS-016 / C15: Ziel-Funktion ist freiwillig – global ein- und ausschaltbar (für alle Sportarten)
  goalsEnabled: boolean;
  setGoalsEnabled: (enabled: boolean) => void;
}

const GoalsContext = createContext<GoalsContextValue | null>(null);

/** Gemeinsame Prüfung für Anlegen und Bearbeiten. */
function validate(input: GoalInput): string | null {
  if (!input.text.trim()) return 'Bitte formuliere dein Ziel.';
  if (input.text.length > MAX_GOAL_TEXT) return `Das Ziel darf höchstens ${MAX_GOAL_TEXT} Zeichen lang sein.`;
  if (input.measure.length > MAX_GOAL_MEASURE) return `Die Messgröße darf höchstens ${MAX_GOAL_MEASURE} Zeichen lang sein.`;
  if (input.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate)) return 'Bitte gib ein gültiges Zieldatum an.';
  return null;
}

function clean(input: GoalInput): GoalInput {
  return { text: input.text.trim(), measure: input.measure.trim(), realistic: input.realistic, dueDate: input.dueDate || null };
}

export function GoalsProvider({ children }: { children: ReactNode }) {
  const { sport } = useSport();
  const [allGoals, setAllGoals] = useState<Goal[]>(() => loadJSON<Goal[]>('goals', []));
  useEffect(() => saveJSON('goals', allGoals), [allGoals]);

  // IFCM FS-016 / C15: Schalter „Ziele verwenden“.
  // Standard, solange nichts gespeichert ist: AN, wenn schon Ziele existieren (niemand verliert Gewohntes),
  // sonst AUS (neue Nutzer:innen werden nicht zu Zielen gedrängt). Ausschalten löscht KEINE Ziele –
  // sie werden nur ausgeblendet und sind beim Wiedereinschalten sofort zurück.
  const [goalsEnabled, setGoalsEnabled] = useState<boolean>(() =>
    loadJSON<boolean>('goalsEnabled', loadJSON<Goal[]>('goals', []).length > 0),
  );
  useEffect(() => saveJSON('goalsEnabled', goalsEnabled), [goalsEnabled]);

  const value = useMemo<GoalsContextValue>(() => {
    const goals = allGoals.filter((goal) => goal.sport === sport);
    const openGoals = goals.filter((goal) => !goal.achievedAt);
    const achievedGoals = goals
      .filter((goal) => goal.achievedAt)
      .sort((a, b) => (b.achievedAt ?? '').localeCompare(a.achievedAt ?? ''));
    return {
      goals,
      openGoals,
      achievedGoals,
      canAddGoal: openGoals.length < MAX_OPEN_GOALS,
      addGoal: (input) => {
        const error = validate(input);
        if (error) return error;
        // Fokus auf maximal drei Kernziele (siehe lib/goals.ts)
        if (openGoals.length >= MAX_OPEN_GOALS) {
          return `Du hast bereits ${MAX_OPEN_GOALS} offene Ziele. Hake eines ab oder lösche es, um ein neues anzulegen.`;
        }
        const goal: Goal = {
          ...clean(input),
          id: generateId(),
          sport,
          achievedAt: null,
          createdAt: new Date().toISOString(),
        };
        setAllGoals((prev) => [...prev, goal]);
        return null;
      },
      updateGoal: (id, input) => {
        const error = validate(input);
        if (error) return error;
        setAllGoals((prev) => prev.map((goal) => (goal.id === id ? { ...goal, ...clean(input) } : goal)));
        return null;
      },
      toggleAchieved: (id) => {
        setAllGoals((prev) =>
          prev.map((goal) => {
            if (goal.id !== id) return goal;
            // Zurück auf „offen“ nur, wenn dadurch nicht mehr als 3 offene Ziele entstehen
            if (goal.achievedAt) {
              const open = prev.filter((g) => g.sport === goal.sport && !g.achievedAt).length;
              return open >= MAX_OPEN_GOALS ? goal : { ...goal, achievedAt: null };
            }
            return { ...goal, achievedAt: new Date().toISOString() };
          }),
        );
      },
      deleteGoal: (id) => setAllGoals((prev) => prev.filter((goal) => goal.id !== id)),
      deleteGoalsForSport: (target) => setAllGoals((prev) => prev.filter((goal) => goal.sport !== target)),
      goalsEnabled, // IFCM FS-016 / C15
      setGoalsEnabled,
    };
  }, [allGoals, sport, goalsEnabled]);

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoals(): GoalsContextValue {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error('useGoals must be used within GoalsProvider');
  return ctx;
}
