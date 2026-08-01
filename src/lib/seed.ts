import type { Exercise, TrainingPlan } from '../types';

const now = new Date().toISOString();

export const SEED_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Vorhand-Rückhand-Wechsel',
    description:
      'Grundlagenübung am Tisch: im gleichmäßigen Rhythmus abwechselnd Vorhand und Rückhand spielen. Fokus auf saubere Schlagtechnik.',
    goal: 'Schlagpräzision',
    durationMinutes: 15,
    difficulty: 'Anfänger',
    createdAt: now,
  },
  {
    id: 'ex-2',
    name: 'Aufschlagvariationen',
    description: 'Verschiedene Aufschlagtechniken mit Unterschnitt, Seitschnitt und kurzer Länge trainieren.',
    goal: 'Aufschlagvariation',
    durationMinutes: 12,
    difficulty: 'Fortgeschritten',
    createdAt: now,
  },
  {
    id: 'ex-3',
    name: 'Beinarbeit am Tisch',
    description: 'Seitliche Ausfallschritte und Nachsetzbewegungen zur Verbesserung der Fußarbeit am Tisch.',
    goal: 'Beinarbeit',
    durationMinutes: 10,
    difficulty: 'Anfänger',
    createdAt: now,
  },
  {
    id: 'ex-4',
    name: 'Topspin-Technik',
    description: 'Topspin gegen angeschnittene Bälle aufbauen, mit Fokus auf Anlaufwinkel und Ausholbewegung.',
    goal: 'Topspin-Präzision',
    durationMinutes: 15,
    difficulty: 'Fortgeschritten',
    createdAt: now,
  },
  {
    id: 'ex-5',
    name: 'Konter-Training',
    description: 'Schnelle Ballwechsel im Nahbereich am Tisch zur Schulung von Reaktion und Tempo.',
    goal: 'Reaktionsschnelligkeit',
    durationMinutes: 12,
    difficulty: 'Fortgeschritten',
    createdAt: now,
  },
  {
    id: 'ex-6',
    name: 'Ballkontrolle im Multiball',
    description: 'Trainer:in spielt Bälle systematisch zu – Fokus auf saubere Schlagtechnik und Ballkontrolle.',
    goal: 'Schlagkontrolle',
    durationMinutes: 10,
    difficulty: 'Anfänger',
    createdAt: now,
  },
];

function isoDaysFromToday(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export const SEED_PLANS: TrainingPlan[] = [
  {
    id: 'plan-1',
    name: 'Techniktraining Nachwuchs',
    description: 'Grundlagen der Schlagtechnik und Beinarbeit für den Nachwuchs.',
    targetGroup: 'Jugend · Anfänger',
    date: isoDaysFromToday(7),
    exerciseIds: ['ex-1', 'ex-3', 'ex-6'],
    createdAt: now,
  },
  {
    id: 'plan-2',
    name: 'Wettkampfvorbereitung',
    description: 'Letzte Einheit vor dem Punktspiel – Aufschlag, Konter und Ballwechsel.',
    targetGroup: 'Vereinsmannschaft',
    date: isoDaysFromToday(-7),
    exerciseIds: ['ex-2', 'ex-1', 'ex-5'],
    createdAt: now,
  },
  {
    id: 'plan-3',
    name: 'Athletik & Ballgefühl',
    description: 'Einheit mit Fokus auf Reaktionsschnelligkeit, Topspin und Schlagvariation.',
    targetGroup: 'Erwachsene',
    date: null,
    exerciseIds: ['ex-4', 'ex-5', 'ex-6', 'ex-1'],
    createdAt: now,
  },
];
