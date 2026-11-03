export type Difficulty = 'Anfänger' | 'Fortgeschritten';

export const DIFFICULTIES: Difficulty[] = ['Anfänger', 'Fortgeschritten'];

export type Sport = 'Tischtennis' | 'Beach Volleyball';

export const SPORTS: Sport[] = ['Tischtennis', 'Beach Volleyball'];

export interface Exercise {
  id: string;
  // IFCM FS-001 / C01 Sportart-Trennung: Jede Übung gehört zu genau einer Sportart.
  sport: Sport;
  name: string;
  description: string;
  goal: string;
  durationMinutes: number;
  difficulty: Difficulty;
  createdAt: string;
}

// IFCM FS-001 / C01: `sport` ist nicht Teil der Formulareingabe – die Sportart wird beim Anlegen
// automatisch aus der aktuell gewählten Sportart gesetzt (siehe AppDataContext).
export type ExerciseInput = Omit<Exercise, 'id' | 'createdAt' | 'sport'>;

export interface TrainingPlan {
  id: string;
  // IFCM FS-001 / C01 Sportart-Trennung: Jeder Trainingsplan gehört zu genau einer Sportart.
  sport: Sport;
  name: string;
  description: string;
  targetGroup: string;
  date: string | null;
  exerciseIds: string[];
  createdAt: string;
}

// IFCM FS-001 / C01: Sportart wird automatisch gesetzt, nicht im Formular gewählt.
export type PlanInput = Omit<TrainingPlan, 'id' | 'createdAt' | 'sport'>;

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
