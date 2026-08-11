export type Difficulty = 'Anfänger' | 'Fortgeschritten';

export const DIFFICULTIES: Difficulty[] = ['Anfänger', 'Fortgeschritten'];

export type Sport = 'Tischtennis' | 'Beach Volleyball';

export const SPORTS: Sport[] = ['Tischtennis', 'Beach Volleyball'];

export interface Exercise {
  id: string;
  name: string;
  description: string;
  goal: string;
  durationMinutes: number;
  difficulty: Difficulty;
  createdAt: string;
}

export type ExerciseInput = Omit<Exercise, 'id' | 'createdAt'>;

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

export interface Account {
  username: string;
  passwordHash: string;
}

export type ServeLength = 'Kurz' | 'Halblang' | 'Lang';

export const SERVE_LENGTHS: ServeLength[] = ['Kurz', 'Halblang', 'Lang'];

export type ServePlacement = 'Vorhand' | 'Mitte' | 'Rückhand';

export const SERVE_PLACEMENTS: ServePlacement[] = ['Vorhand', 'Mitte', 'Rückhand'];

export type ServeResult = 'gut' | 'schlecht';

export interface ServeAttempt {
  id: string;
  result: ServeResult;
  createdAt: string;
}

export interface ServeSessionGoal {
  length: ServeLength;
  placement: ServePlacement;
  type: string;
}

export interface ServeSession extends ServeSessionGoal {
  id: string;
  attempts: ServeAttempt[];
  startedAt: string;
  endedAt: string | null;
}
