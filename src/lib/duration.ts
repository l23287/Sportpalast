// IFCM FS-009 / C07 Dauer in Sekunden: Hilfsfunktionen rund um die Übungsdauer.
// Seit C07 wird die Dauer intern in SEKUNDEN gespeicherten (`durationSeconds`), damit auch kurze Übungen
// wie „10 Sek.“ möglich sind (Feedback B3). Ältere Daten speichern Minuten (`durationMinutes`).
import type { Exercise } from '../types';

/** Gespeicherte Übung, wie sie vor C07 aussehen konnte (Dauer in Minuten). */
type StoredExercise = Omit<Exercise, 'durationSeconds'> & { durationSeconds?: number; durationMinutes?: number };

/**
 * Migration beim Laden: Übungen mit alter Minuten-Angabe bekommen `durationSeconds = Minuten × 60`.
 * Das alte Feld wird entfernt, damit es keine zwei widersprüchlichen Angaben gibt. Übungen, die bereits
 * Sekunden haben, bleiben unverändert – die Migration kann also gefahrlos bei jedem Start laufen.
 */
export function migrateExerciseDurations<T extends StoredExercise>(items: T[]): (Omit<T, 'durationMinutes'> & { durationSeconds: number })[] {
  return items.map((item) => {
    if (typeof item.durationSeconds === 'number') return item as Omit<T, 'durationMinutes'> & { durationSeconds: number };
    const { durationMinutes, ...rest } = item;
    return { ...rest, durationSeconds: Math.max(0, Math.round((durationMinutes ?? 0) * 60)) };
  });
}

/** Zerlegt Sekunden in Minuten + Restsekunden (für die zwei Eingabefelder im Formular). */
export function splitSeconds(totalSeconds: number): { minutes: number; seconds: number } {
  return { minutes: Math.floor(totalSeconds / 60), seconds: totalSeconds % 60 };
}

/** Obergrenze für eine einzelne Übung: 24 Stunden (schützt vor Tippfehlern wie 99999 Minuten). */
export const MAX_EXERCISE_SECONDS = 24 * 60 * 60;
