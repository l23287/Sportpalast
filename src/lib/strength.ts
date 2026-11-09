// IFCM FS-017 / C11 Sportart „Gym“ verbessern: Kraftübungen mit Sätzen × Wiederholungen, Gewicht und Satzpause,
// Muskelgruppen sowie Hilfen für Anzeige und Schätzung der Dauer.
//
// Grundidee: Eine Übung hat jetzt eine ART („format“):
//   - 'duration' (wie bisher): feste Dauer, Timer zählt herunter
//   - 'sets' (neu): Sätze × Wiederholungen, optional Gewicht, Satzpause; Timer zählt Sätze und Pausen
// Alte Übungen haben kein `format` und gelten als 'duration' – es ist keine Datenumwandlung nötig.
//
// Damit alle Summen (Plandauer, Bereich „Heute“, Statistik) ohne Umbau weiter stimmen, wird für Satz-Übungen beim
// Speichern eine GESCHÄTZTE Dauer in `durationSeconds` abgelegt (siehe estimateSetsSeconds).
import type { Exercise, ExerciseFormat, MuscleGroup, Sport } from '../types';
import { formatDuration } from './time';
import { formatStopwatch } from './stopwatch'; // IFCM FS-019 / C13

/** Muskelgruppen in der Reihenfolge, in der sie im Übungsbereich gruppiert werden. */
export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Beine',
  'Gesäß',
  'Brust',
  'Rücken',
  'Schultern',
  'Arme',
  'Bauch & Rumpf',
  'Ganzkörper',
  'Ausdauer',
];

// Grenzen für die Eingabe (Schutz vor Tippfehlern)
export const MAX_SETS = 20;
export const MAX_REPS = 100;
export const MAX_WEIGHT_KG = 500;
export const MAX_REST_SECONDS = 600;
export const DEFAULT_REST_SECONDS = 90;

/** Schrittweite für das schnelle Anpassen des Gewichts (+/−), übliche kleinste Hantelscheibenstufe. */
export const WEIGHT_STEP_KG = 2.5;

/** Annahme für die Schätzung: durchschnittliche Zeit pro Wiederholung in Sekunden. */
const SECONDS_PER_REP = 3;

/** In welchen Sportarten neue Übungen standardmäßig als Satz-Übung angelegt werden. */
const STRENGTH_DEFAULT_SPORTS: Sport[] = ['Gym/Fitness'];

export function defaultFormatFor(sport: Sport): ExerciseFormat {
  return STRENGTH_DEFAULT_SPORTS.includes(sport) ? 'sets' : 'duration';
}

/** Art einer (auch alten) Übung – fehlendes Feld = 'duration'. */
export function formatOf(exercise: Pick<Exercise, 'format'>): ExerciseFormat {
  return exercise.format ?? 'duration';
}

/**
 * Geschätzte Dauer einer Satz-Übung in Sekunden:
 *   Sätze × Wiederholungen × 3 Sek. (Ausführung) + (Sätze − 1) × Satzpause
 * Beispiel 3 × 12 mit 90 Sek. Pause: 3·12·3 + 2·90 = 108 + 180 = 288 Sek. ≈ 4 Min. 48 Sek.
 * Die Pause nach dem letzten Satz zählt nicht mit (dann beginnt die nächste Übung).
 */
export function estimateSetsSeconds(sets: number, reps: number, restSeconds: number): number {
  return sets * reps * SECONDS_PER_REP + Math.max(0, sets - 1) * restSeconds;
}

/** Gewicht schön formatieren: 40 → „40 kg“, 42.5 → „42,5 kg“. */
export function formatWeight(kg: number): string {
  return `${kg.toLocaleString('de-DE', { maximumFractionDigits: 2 })} kg`;
}

/**
 * Kurzbeschreibung für Listen und Karten:
 *   Satz-Übung:  „3 × 12 · 40 kg“ (ohne Gewicht: „3 × 12“)
 *   Dauer-Übung: „15 Min.“ (wie bisher)
 */
export function exerciseSummary(exercise: Exercise): string {
  // IFCM FS-019 / C13: „Zeit messen“ – mit Bestzeit, sobald eine Zeit übernommen wurde
  if (formatOf(exercise) === 'stopwatch') {
    return exercise.bestTimeMs ? `Zeit messen · Bestzeit ${formatStopwatch(exercise.bestTimeMs)}` : 'Zeit messen';
  }
  if (formatOf(exercise) === 'sets') {
    const base = `${exercise.sets ?? 1} × ${exercise.reps ?? 1}`;
    return exercise.weightKg ? `${base} · ${formatWeight(exercise.weightKg)}` : base;
  }
  return formatDuration(exercise.durationSeconds);
}

/** Gewicht um einen Schritt ändern, nie unter 0 oder über das Maximum, auf 0,5 kg gerundet. */
export function stepWeight(current: number | null | undefined, direction: 1 | -1): number {
  const next = (current ?? 0) + direction * WEIGHT_STEP_KG;
  return Math.min(MAX_WEIGHT_KG, Math.max(0, Math.round(next * 2) / 2));
}
