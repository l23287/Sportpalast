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

export interface Exercise {
  id: string;
  // IFCM FS-001 / C01 Sportart-Trennung: Jede Übung gehört zu genau einer Sportart.
  sport: Sport;
  name: string;
  description: string;
  goal: string;
  // IFCM FS-009 / C07: Dauer in SEKUNDEN (vorher `durationMinutes`); alte Daten werden beim Laden umgerechnet
  durationSeconds: number;
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
