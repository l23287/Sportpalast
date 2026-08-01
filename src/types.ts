export type Difficulty = 'Anfänger' | 'Fortgeschritten';

export const DIFFICULTIES: Difficulty[] = ['Anfänger', 'Fortgeschritten'];

export interface Exercise {
  id: string;
  name: string;
  description: string;
  goal: string;
  durationMinutes: number;
  difficulty: Difficulty;
  sport: string;
  createdAt: string;
}

export type ExerciseInput = Omit<Exercise, 'id' | 'createdAt' | 'sport'>;

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  targetGroup: string;
  date: string | null;
  exerciseIds: string[];
  createdAt: string;
}

export type PlanInput = Omit<TrainingPlan, 'id' | 'createdAt'>;

export interface AppSettings {
  sport: string;
}

export interface Account {
  name: string;
  email: string;
}
