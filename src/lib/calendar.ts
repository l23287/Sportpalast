// IFCM FS-004 / C05 Kalendertool: Hilfsfunktionen für die Monatsansicht.
// Bewusst ohne externe Bibliothek (kein Budget, keine fremde Abhängigkeit – Wert „Verantwortung“/Guards).
//
// Wichtig zu Zeitzonen: Pläne speichern ihr Datum als Text „JJJJ-MM-TT“ (aus <input type="date">).
// `new Date('2026-11-04')` würde das als UTC-Mitternacht lesen und kann in manchen Zeitzonen auf den Vortag
// rutschen. Deshalb rechnet der Kalender nur mit solchen Datums-Schlüsseln und lokalen Datumswerten.
import type { TrainingPlan } from '../types';
import { occurrencesBetween } from './recurrence'; // IFCM FS-005 / C06

/** Datums-Schlüssel „JJJJ-MM-TT“ eines lokalen Datums (gleiches Format wie TrainingPlan.date). */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Wandelt „JJJJ-MM-TT“ in ein lokales Datum um (ohne UTC-Verschiebung). */
export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Wochentage, Woche beginnt am Montag (deutsche Konvention). */
export const WEEKDAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

/** Monatsname + Jahr auf Deutsch, z. B. „November 2026“. */
export function formatMonthTitle(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
}

/** Ausgeschriebenes Datum für die Tagesliste, z. B. „Mittwoch, 4. November 2026“. */
export function formatLongDate(key: string): string {
  return parseDateKey(key).toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export interface CalendarDay {
  key: string; // „JJJJ-MM-TT“
  day: number; // Tag im Monat (1–31)
  inMonth: boolean; // false = Tag aus dem Vor-/Folgemonat (zum Auffüllen des Rasters)
}

/**
 * Baut das Raster eines Monats: immer volle Wochen von Montag bis Sonntag (5 oder 6 Zeilen).
 * `month` ist 0-basiert (0 = Januar) wie bei JavaScript-Datumswerten.
 */
export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const first = new Date(year, month, 1);
  // getDay(): 0 = Sonntag … 6 = Samstag → umrechnen auf 0 = Montag … 6 = Sonntag
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Math.ceil((offset + daysInMonth) / 7) * 7;

  const days: CalendarDay[] = [];
  for (let i = 0; i < cells; i++) {
    // new Date(year, month, n) rechnet Über-/Unterläufe automatisch in den Nachbarmonat um
    const date = new Date(year, month, 1 - offset + i);
    days.push({ key: toDateKey(date), day: date.getDate(), inMonth: date.getMonth() === month });
  }
  return days;
}

/**
 * Ordnet Pläne ihren Tagen zu (Schlüssel „JJJJ-MM-TT“ → Pläne an diesem Tag).
 *
 * IFCM FS-005 / C06: Wiederkehrende Pläne erscheinen an JEDEM Termin im Zeitraum [fromKey, toKey].
 * Die Termine liefert `occurrencesBetween` – die Kalenderseite musste dafür nicht geändert werden
 * (Andockpunkt aus C05).
 */
export function plansByDay(plans: TrainingPlan[], fromKey: string, toKey: string): Map<string, TrainingPlan[]> {
  const map = new Map<string, TrainingPlan[]>();
  for (const plan of plans) {
    // Pläne ohne Datum liefern keine Termine und erscheinen daher nicht im Kalender
    for (const key of occurrencesBetween(plan, fromKey, toKey)) {
      const list = map.get(key) ?? [];
      list.push(plan);
      map.set(key, list);
    }
  }
  return map;
}
