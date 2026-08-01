import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppSettings, Exercise, ExerciseInput, PlanInput, TrainingPlan } from '../types';
import { generateId } from '../lib/id';
import { loadJSON, saveJSON } from '../lib/storage';
import { SEED_EXERCISES, SEED_PLANS, SEED_SPORT } from '../lib/seed';

interface AppDataContextValue {
  plans: TrainingPlan[];
  exercises: Exercise[];
  settings: AppSettings;
  addPlan: (input: PlanInput) => TrainingPlan;
  updatePlan: (id: string, input: PlanInput) => void;
  deletePlan: (id: string) => void;
  getPlan: (id: string) => TrainingPlan | undefined;
  addExercise: (input: ExerciseInput) => Exercise;
  updateExercise: (id: string, input: ExerciseInput) => void;
  deleteExercise: (id: string) => void;
  getExercise: (id: string) => Exercise | undefined;
  setSport: (sport: string) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<TrainingPlan[]>(() => loadJSON('plans', SEED_PLANS));
  const [exercises, setExercises] = useState<Exercise[]>(() => loadJSON('exercises', SEED_EXERCISES));
  const [settings, setSettings] = useState<AppSettings>(() => loadJSON('settings', { sport: SEED_SPORT }));

  useEffect(() => saveJSON('plans', plans), [plans]);
  useEffect(() => saveJSON('exercises', exercises), [exercises]);
  useEffect(() => saveJSON('settings', settings), [settings]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      plans,
      exercises,
      settings,
      addPlan: (input) => {
        const plan: TrainingPlan = { ...input, id: generateId(), createdAt: new Date().toISOString() };
        setPlans((prev) => [plan, ...prev]);
        return plan;
      },
      updatePlan: (id, input) => {
        setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...input } : p)));
      },
      deletePlan: (id) => {
        setPlans((prev) => prev.filter((p) => p.id !== id));
      },
      getPlan: (id) => plans.find((p) => p.id === id),
      addExercise: (input) => {
        const exercise: Exercise = {
          ...input,
          id: generateId(),
          sport: settings.sport,
          createdAt: new Date().toISOString(),
        };
        setExercises((prev) => [exercise, ...prev]);
        return exercise;
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
      getExercise: (id) => exercises.find((e) => e.id === id),
      setSport: (sport) => setSettings((prev) => ({ ...prev, sport })),
    }),
    [plans, exercises, settings],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
