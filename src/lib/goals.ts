// IFCM FS-013 / C09 Zielsetzungstool: Regeln und Hilfsfunktionen für Ziele nach der SMART-Methode.
//
// Grundlage (gelesen am 06.11.2026): karrierebibel.de/smart-methode – SMART = Spezifisch, Messbar, Attraktiv,
// Realistisch, Terminiert; Empfehlung „auf maximal drei Kernziele fokussieren“; Praxistipps: Aufschreiben,
// Visualisieren, Kontrollieren, Anpassen, Feiern. Die Methode geht auf Peter Drucker („Management by Objectives“) zurück.
// Die Prüfung unten ist bewusst nur ein HINWEIS (Heuristik): Die Kriterien lassen sich laut Quelle unterschiedlich
// auslegen, deshalb blockiert die App kein Ziel, sondern zeigt, welche Kriterien schon erkennbar erfüllt sind.
import type { Goal } from '../types';

/** Höchstens 3 offene Kernziele je Sportart (Quelle: „maximal drei Kernziele“; Mindmap: „max. 3 Kernziele“). */
export const MAX_OPEN_GOALS = 3;
export const MAX_GOAL_TEXT = 140;
export const MAX_GOAL_MEASURE = 80;

/** Datenschutz-Hinweis wie bei den Notizen (C08): Ziele sind Ziele der Trainer:innen. */
export const GOAL_PRIVACY_HINT = 'Bitte keine Namen oder persönlichen Daten von Sportler:innen eintragen.';

/** Beispiele im Muster der Quelle („Ich werde … bis …, indem …“), auf Vereinstraining übertragen. */
export const GOAL_EXAMPLES = [
  'Bis zum 31.01. spielen 8 von 10 Kindern meiner U12 den Aufschlag sicher ins Feld, indem wir jede Einheit 10 Minuten Aufschläge üben.',
  'Ich plane bis Ende Dezember jede Woche beide Trainingseinheiten spätestens zwei Tage vorher vollständig in TrainerPro.',
];

// Wörter, die auf eine Vermeidungs-Formulierung hindeuten („Ich will nicht mehr …“). Die Quelle empfiehlt positive
// Formulierungen, weil sie stärker motivieren (Kriterium „Attraktiv“).
const NEGATIVE_WORDS = /\b(nicht|kein|keine|keinen|keiner|nie|niemals|aufhören|vermeiden)\b/i;

export interface SmartCheck {
  S: boolean; // Spezifisch: konkret ausgeschrieben (mind. 5 Wörter)
  M: boolean; // Messbar: Messgröße angegeben oder Zahl im Ziel
  A: boolean; // Attraktiv: positiv formuliert (keine Verneinung)
  R: boolean; // Realistisch: Selbsteinschätzung „mit meinen Mitteln machbar“
  T: boolean; // Terminiert: Zieldatum gesetzt
}

export const SMART_LABELS: Record<keyof SmartCheck, { name: string; hint: string }> = {
  S: { name: 'Spezifisch', hint: 'Was genau soll bis wann von wem erreicht werden? Konkret statt vage.' },
  M: { name: 'Messbar', hint: 'Woran erkennst du den Erfolg? Zahl, Anzahl, Zeit oder Ersatzgröße angeben.' },
  A: { name: 'Attraktiv', hint: 'Positiv formulieren („Ich möchte …“ statt „Ich will nicht mehr …“).' },
  R: { name: 'Realistisch', hint: 'Herausfordernd, aber mit Zeit, Know-how und Mitteln machbar? Ehrlich prüfen.' },
  T: { name: 'Terminiert', hint: 'Ein Zieldatum setzen – die Deadline spornt an und ist Kontrollpunkt.' },
};

type GoalDraft = Pick<Goal, 'text' | 'measure' | 'realistic' | 'dueDate'>;

/** Welche SMART-Kriterien sind an der Formulierung erkennbar erfüllt? (Hinweis, keine Pflicht) */
export function smartCheck(goal: GoalDraft): SmartCheck {
  const text = goal.text.trim();
  return {
    S: text.split(/\s+/).filter(Boolean).length >= 5,
    M: goal.measure.trim().length > 0 || /\d/.test(text),
    A: text.length > 0 && !NEGATIVE_WORDS.test(`${text} ${goal.measure}`),
    R: goal.realistic,
    T: Boolean(goal.dueDate),
  };
}

function keyToUtc(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Tage von heute bis zum Zieldatum (negativ = überschritten). */
export function daysUntil(dueKey: string, todayKey: string): number {
  return Math.round((keyToUtc(dueKey) - keyToUtc(todayKey)) / 86_400_000);
}

/** Text zur Restzeit, z. B. „noch 12 Tage“, „heute fällig“, „seit 3 Tagen überschritten“. */
export function formatRemaining(dueKey: string, todayKey: string): string {
  const days = daysUntil(dueKey, todayKey);
  if (days > 1) return `noch ${days} Tage`;
  if (days === 1) return 'noch 1 Tag';
  if (days === 0) return 'heute fällig';
  return days === -1 ? 'seit 1 Tag überschritten' : `seit ${-days} Tagen überschritten`;
}

/**
 * Anteil der verstrichenen Zeit zwischen Anlegen und Zieldatum (0–1) für die Fortschrittsleiste.
 * Idee aus der Quelle (Goal-Gradient-Effekt): Je sichtbarer die nahende Deadline, desto stärker der Ansporn.
 */
export function timeProgress(createdAtIso: string, dueKey: string, todayKey: string): number {
  const createdKey = createdAtIso.slice(0, 10);
  const total = keyToUtc(dueKey) - keyToUtc(createdKey);
  if (total <= 0) return 1;
  return Math.min(1, Math.max(0, (keyToUtc(todayKey) - keyToUtc(createdKey)) / total));
}
