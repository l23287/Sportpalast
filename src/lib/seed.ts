import type { Exercise, TrainingPlan } from '../types';

const now = new Date().toISOString();

export const SEED_SPORT = 'Fußball';

export const SEED_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Passübungen im Quadrat',
    description:
      'Vier Spieler:innen stehen an den Ecken eines Quadrats und spielen sich den Ball zu. Fokus auf präzise Anspiele und schnelle Ballmitnahme.',
    goal: 'Passgenauigkeit',
    durationMinutes: 15,
    difficulty: 'Anfänger',
    sport: SEED_SPORT,
    createdAt: now,
  },
  {
    id: 'ex-2',
    name: 'Torschusstraining',
    description: 'Abschlüsse aus verschiedenen Winkeln und Distanzen nach kurzem Zuspiel.',
    goal: 'Abschlussstärke',
    durationMinutes: 20,
    difficulty: 'Fortgeschritten',
    sport: SEED_SPORT,
    createdAt: now,
  },
  {
    id: 'ex-3',
    name: 'Dribbling-Parcours',
    description: 'Ballkontrolle im Slalom durch eine Reihe von Hütchen, anschließend Abschluss aufs Tor.',
    goal: 'Ballkontrolle',
    durationMinutes: 10,
    difficulty: 'Anfänger',
    sport: SEED_SPORT,
    createdAt: now,
  },
  {
    id: 'ex-4',
    name: '4 gegen 2 Positionsspiel',
    description: 'Ballbesitzspiel im engen Raum zur Schulung von Spielverständnis und schnellem Umschalten.',
    goal: 'Spielintelligenz',
    durationMinutes: 15,
    difficulty: 'Fortgeschritten',
    sport: SEED_SPORT,
    createdAt: now,
  },
  {
    id: 'ex-5',
    name: 'Sprintintervalle',
    description: 'Kurze, maximale Sprints mit aktiven Erholungspausen zum Aufbau der Schnelligkeitsausdauer.',
    goal: 'Schnelligkeit',
    durationMinutes: 12,
    difficulty: 'Fortgeschritten',
    sport: SEED_SPORT,
    createdAt: now,
  },
  {
    id: 'ex-6',
    name: 'Koordinationsleiter',
    description: 'Schnelle Fußarbeit durch die Koordinationsleiter zur Verbesserung von Lauftechnik und Koordination.',
    goal: 'Koordination',
    durationMinutes: 8,
    difficulty: 'Anfänger',
    sport: SEED_SPORT,
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
    name: 'Techniktraining U14',
    description: 'Fokus auf Ballkontrolle, Passspiel und Koordination für die U14.',
    targetGroup: 'U14 · Fortgeschrittene',
    date: isoDaysFromToday(7),
    exerciseIds: ['ex-1', 'ex-3', 'ex-6'],
    createdAt: now,
  },
  {
    id: 'plan-2',
    name: 'Spielvorbereitung Samstag',
    description: 'Letzte Einheit vor dem Ligaspiel – Abschluss, Passsicherheit und Tempo.',
    targetGroup: 'Herren 1. Mannschaft',
    date: isoDaysFromToday(-7),
    exerciseIds: ['ex-2', 'ex-1', 'ex-5'],
    createdAt: now,
  },
  {
    id: 'plan-3',
    name: 'Athletik & Spielformen',
    description: 'Athletik- und Spielformen-Einheit mit Fokus auf Spielintelligenz und Schnelligkeit.',
    targetGroup: 'A-Jugend',
    date: null,
    exerciseIds: ['ex-4', 'ex-5', 'ex-6', 'ex-1'],
    createdAt: now,
  },
];
