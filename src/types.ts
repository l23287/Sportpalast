export type Difficulty = 'Anfänger' | 'Fortgeschritten';

export const DIFFICULTIES: Difficulty[] = ['Anfänger', 'Fortgeschritten'];

// IFCM FS-002 / C02 Mehr Sportarten: Die Sportart ist jetzt ein frei erweiterbarer Name statt einer festen
// Zweierliste. So können vordefinierte UND eigene Sportarten verwendet werden. Bestehende Werte
// ('Tischtennis', 'Beach Volleyball') bleiben gültig – gespeicherte Daten aus C01 funktionieren weiter.
export type Sport = string;

// IFCM FS-002 / C02: Vordefinierte Sportarten (Tischtennis und Beach Volleyball wie bisher zuerst,
// danach alphabetisch). Eigene Sportarten werden zusätzlich im SportContext gespeichert.
export const SPORTS: Sport[] = [
  'Tischtennis',
  'Beach Volleyball',
  'Badminton',
  'Basketball',
  'Fußball',
  'Gym/Fitness',
  'Handball',
  'Leichtathletik',
  'Schwimmen',
  'Tennis',
  'Turnen',
  'Volleyball',
];

// IFCM FS-017 / C11: Art einer Übung – feste Dauer (bisher) oder Sätze × Wiederholungen (Krafttraining)
export type ExerciseFormat = 'duration' | 'sets';

// IFCM FS-017 / C11: Muskelgruppen zum Ordnen der Übungen
export type MuscleGroup =
  | 'Beine'
  | 'Gesäß'
  | 'Brust'
  | 'Rücken'
  | 'Schultern'
  | 'Arme'
  | 'Bauch & Rumpf'
  | 'Ganzkörper'
  | 'Ausdauer';

export interface Exercise {
  id: string;
  // IFCM FS-001 / C01 Sportart-Trennung: Jede Übung gehört zu genau einer Sportart.
  sport: Sport;
  name: string;
  description: string;
  goal: string;
  // IFCM FS-009 / C07: Dauer in SEKUNDEN (vorher `durationMinutes`); alte Daten werden beim Laden umgerechnet
  durationSeconds: number;
  // IFCM FS-017 / C11 Gym: Art der Übung und Kraft-Angaben (alle optional → alte Übungen bleiben gültig)
  format?: ExerciseFormat; // fehlt = 'duration'
  sets?: number; // Anzahl Sätze (nur bei 'sets')
  reps?: number; // Wiederholungen pro Satz (nur bei 'sets')
  weightKg?: number | null; // Vorgabe-Gewicht der Trainer:in, schnell anpassbar (+/−), kein Personen-Tagebuch
  restSeconds?: number; // Satzpause in Sekunden (nur bei 'sets')
  muscleGroup?: MuscleGroup | null; // zum Ordnen im Übungsbereich, in jeder Sportart möglich
  // IFCM FS-010 / C08 Notizzettel: Notiz zur Übung als Erinnerung fürs nächste Mal (reiner Text, optional).
  // Gehört zur ÜBUNG, nicht zum Plan – sie erscheint daher in jedem Plan und bei jedem Start wieder.
  note?: string;
  difficulty: Difficulty;
  createdAt: string;
}

// IFCM FS-001 / C01: `sport` ist nicht Teil der Formulareingabe – die Sportart wird beim Anlegen
// automatisch aus der aktuell gewählten Sportart gesetzt (siehe AppDataContext).
export type ExerciseInput = Omit<Exercise, 'id' | 'createdAt' | 'sport'>;

// IFCM FS-005 / C06 Wiederkehrende Pläne: Rhythmus, in dem sich ein Plan wiederholt.
// 'none' = einmalig (Standard, entspricht allen Plänen von vor C06).
export type Recurrence = 'none' | 'weekly' | 'biweekly' | 'monthly';

export const RECURRENCES: Recurrence[] = ['none', 'weekly', 'biweekly', 'monthly'];

export interface TrainingPlan {
  id: string;
  // IFCM FS-001 / C01 Sportart-Trennung: Jeder Trainingsplan gehört zu genau einer Sportart.
  sport: Sport;
  name: string;
  description: string;
  targetGroup: string;
  date: string | null;
  exerciseIds: string[];
  // IFCM FS-005 / C06: Wiederholung als REGEL am Plan (keine Kopien). `date` ist der erste Termin.
  // Beide Felder sind optional, damit alte gespeicherte Pläne ohne Umwandlung gültig bleiben (= einmalig).
  recurrence?: Recurrence;
  // IFCM FS-005 / C06: letzter möglicher Termin („JJJJ-MM-TT“), null/fehlend = ohne Ende
  recurrenceEnd?: string | null;
  // IFCM FS-006 / C06a: fester Wochentag der Wiederholung (0 = Montag … 6 = Sonntag), nur bei
  // wöchentlich / alle 2 Wochen. Fehlt er (Pläne aus C06), gilt wie bisher der Wochentag des Startdatums.
  recurrenceWeekday?: number | null;
  // IFCM FS-006 / C06a: Uhrzeit des Trainings „HH:MM“ (gilt für jeden Termin der Wiederholung), optional
  time?: string | null;
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

// IFCM FS-013 / C09 Zielsetzungstool: ein Kernziel der Trainer:in (max. 3 offene je Sportart).
export interface Goal {
  id: string;
  sport: Sport; // je Sportart getrennt (wie Pläne und Übungen, C01)
  text: string; // das Ziel selbst – spezifisch und positiv formuliert (S, A)
  measure: string; // woran der Erfolg gemessen wird (M), optional
  realistic: boolean; // Selbsteinschätzung „mit meinen Mitteln machbar“ (R)
  dueDate: string | null; // Zieldatum „JJJJ-MM-TT“ (T), optional
  achievedAt: string | null; // Zeitpunkt, an dem das Ziel als erreicht abgehakt wurde
  createdAt: string;
}

export type GoalInput = Pick<Goal, 'text' | 'measure' | 'realistic' | 'dueDate'>;
