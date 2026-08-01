import type { Exercise, TrainingPlan } from '../types';

export interface ExerciseUsage {
  exercise: Exercise;
  count: number;
}

export function computeExerciseUsage(plans: TrainingPlan[], exercises: Exercise[]): ExerciseUsage[] {
  const counts = new Map<string, number>();
  for (const plan of plans) {
    for (const exerciseId of plan.exerciseIds) {
      counts.set(exerciseId, (counts.get(exerciseId) ?? 0) + 1);
    }
  }
  return exercises
    .map((exercise) => ({ exercise, count: counts.get(exercise.id) ?? 0 }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count || a.exercise.name.localeCompare(b.exercise.name));
}

export function computeAverageDuration(plans: TrainingPlan[], exercises: Exercise[]): number {
  if (plans.length === 0) return 0;
  const total = plans.reduce((sum, plan) => {
    const planMinutes = plan.exerciseIds.reduce((planSum, exerciseId) => {
      const exercise = exercises.find((e) => e.id === exerciseId);
      return planSum + (exercise?.durationMinutes ?? 0);
    }, 0);
    return sum + planMinutes;
  }, 0);
  return Math.round(total / plans.length);
}
