// IFCM FS-023 / C14 Erweiterung der Statistik: reine Rechenfunktionen (ohne React), damit sie einzeln testbar sind.
// Alle Datumswerte sind Schlüssel „JJJJ-MM-TT“; gerechnet wird in UTC (keine Sommerzeit-Fehler), Woche beginnt Montag.
import type { ActivityEntry } from '../context/StreakContext';

const DAY_MS = 24 * 60 * 60 * 1000;

function keyToUtc(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}
function utcToKey(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}
export function addDays(key: string, days: number): string {
  return utcToKey(keyToUtc(key) + days * DAY_MS);
}

/** Montag der Woche, in der `key` liegt. */
export function weekStartKey(key: string): string {
  const weekday = (new Date(keyToUtc(key)).getUTCDay() + 6) % 7; // 0 = Montag
  return addDays(key, -weekday);
}

/** Kalenderwoche nach ISO 8601 (für Achsenbeschriftung „KW 46“): Woche mit dem Donnerstag zählt zum Jahr. */
export function isoWeek(key: string): number {
  const ms = keyToUtc(key);
  const weekday = (new Date(ms).getUTCDay() + 6) % 7; // 0 = Montag
  const thursday = ms + (3 - weekday) * DAY_MS; // Donnerstag derselben Woche
  const year = new Date(thursday).getUTCFullYear();
  const jan4 = Date.UTC(year, 0, 4); // liegt immer in KW 1
  const week1Monday = jan4 - ((new Date(jan4).getUTCDay() + 6) % 7) * DAY_MS;
  return 1 + Math.floor((thursday - week1Monday) / (7 * DAY_MS));
}

export interface WeekTotal {
  weekStart: string;
  seconds: number;
  count: number; // absolvierte Übungen
}

/**
 * Trainingszeit je Woche für eine Sportart, die letzten `weeks` Wochen bis einschließlich der aktuellen
 * (älteste zuerst). Wochen ohne Einträge erscheinen mit 0 – eine Lücke bleibt sichtbar.
 */
export function weeklyTraining(log: ActivityEntry[], sport: string, todayKey: string, weeks: number): WeekTotal[] {
  const current = weekStartKey(todayKey);
  const result: WeekTotal[] = Array.from({ length: weeks }, (_, i) => ({
    weekStart: addDays(current, -7 * (weeks - 1 - i)),
    seconds: 0,
    count: 0,
  }));
  const index = new Map(result.map((w, i) => [w.weekStart, i]));
  for (const entry of log) {
    if (entry.sport !== sport) continue;
    const i = index.get(weekStartKey(entry.date));
    if (i === undefined) continue;
    result[i].seconds += entry.seconds;
    result[i].count += 1;
  }
  return result;
}

export interface GridDay {
  key: string;
  active: boolean;
  future: boolean;
}

/**
 * Aktivitäts-Raster der letzten `weeks` Wochen (Spalten = Wochen, je 7 Tage Mo–So), über alle Sportarten.
 * Tage nach heute werden als „future“ markiert und leer dargestellt.
 */
export function activityGrid(activeDays: string[], todayKey: string, weeks: number): GridDay[][] {
  const active = new Set(activeDays);
  const firstMonday = addDays(weekStartKey(todayKey), -7 * (weeks - 1));
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const key = addDays(firstMonday, w * 7 + d);
      return { key, active: active.has(key), future: key > todayKey };
    }),
  );
}

/** Zählt Elemente je Gruppe; `order` legt die Reihenfolge fest, Gruppen mit 0 entfallen. */
export function countBy<T, K extends string>(items: T[], keyOf: (item: T) => K, order: K[]): { key: K; count: number }[] {
  const counts = new Map<K, number>();
  for (const item of items) counts.set(keyOf(item), (counts.get(keyOf(item)) ?? 0) + 1);
  return order.map((key) => ({ key, count: counts.get(key) ?? 0 })).filter((entry) => entry.count > 0);
}
