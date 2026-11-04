// IFCM FS-005 / C06 Wiederkehrende Pläne: Berechnung der Termine eines Plans.
//
// Grundidee: Ein Plan speichert nur eine Regel (Starttermin `date`, Rhythmus `recurrence`, optional
// `recurrenceEnd`). Die einzelnen Termine werden bei Bedarf berechnet – immer nur für einen begrenzten
// Zeitraum (z. B. den sichtbaren Kalendermonat), damit nichts endlos läuft.
//
// Alle Datumswerte sind Schlüssel „JJJJ-MM-TT“ (wie in C05), gerechnet wird mit Date.UTC, damit
// Sommer-/Winterzeit keine Tage verschiebt.
import type { Recurrence, TrainingPlan } from '../types';

// eigene Umrechnung statt Import aus calendar.ts – calendar.ts importiert diese Datei (keine Ring-Abhängigkeit)
function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Deutsche Bezeichnungen für Formular und Anzeige. */
export const RECURRENCE_LABELS: Record<Recurrence, string> = {
  none: 'Einmalig',
  weekly: 'Wöchentlich',
  biweekly: 'Alle 2 Wochen',
  monthly: 'Monatlich',
};

/** Ist der Plan ein wiederkehrender Plan (mit Starttermin)? */
export function isRecurring(plan: TrainingPlan): boolean {
  return Boolean(plan.date) && (plan.recurrence ?? 'none') !== 'none';
}

function keyToUtc(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

function utcToKey(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** Schlüssel für Jahr/Monat/Tag; ist der Tag im Monat zu groß, wird der letzte Tag des Monats genommen. */
function monthlyKey(year: number, month: number, day: number): string {
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return utcToKey(Date.UTC(year, month, Math.min(day, lastDay)));
}

/**
 * Alle Termine eines Plans im Zeitraum [fromKey, toKey] (beide einschließlich).
 * - einmaliger Plan: sein Datum, falls es im Zeitraum liegt
 * - wöchentlich / alle 2 Wochen: Startdatum + n × 7 bzw. 14 Tage
 * - monatlich: gleicher Tag im Monat; am 29./30./31. in kürzeren Monaten der letzte Tag des Monats
 * Termine vor dem Start und nach `recurrenceEnd` gibt es nicht.
 */
export function occurrencesBetween(plan: TrainingPlan, fromKey: string, toKey: string): string[] {
  if (!plan.date) return [];
  const start = plan.date;
  const end = plan.recurrenceEnd && plan.recurrenceEnd < toKey ? plan.recurrenceEnd : toKey;
  const from = fromKey > start ? fromKey : start;
  if (from > end) return [];

  const recurrence = plan.recurrence ?? 'none';
  if (recurrence === 'none') return start >= from && start <= end ? [start] : [];

  const result: string[] = [];
  if (recurrence === 'weekly' || recurrence === 'biweekly') {
    const stepDays = recurrence === 'weekly' ? 7 : 14;
    const startMs = keyToUtc(start);
    // erster Termin im Zeitraum direkt berechnen statt ab Start durchzuzählen
    const daysToFrom = Math.round((keyToUtc(from) - startMs) / DAY_MS);
    let n = Math.ceil(daysToFrom / stepDays);
    for (;;) {
      const key = utcToKey(startMs + n * stepDays * DAY_MS);
      if (key > end) break;
      result.push(key);
      n++;
    }
    return result;
  }

  // monatlich
  const startDate = parseDateKey(start);
  const startDay = startDate.getDate();
  const fromDate = parseDateKey(from);
  let year = fromDate.getFullYear();
  let month = fromDate.getMonth();
  for (;;) {
    const key = monthlyKey(year, month, startDay);
    if (key > end) break;
    if (key >= from) result.push(key);
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
  }
  return result;
}

/** Nächster Termin ab `fromKey` (einschließlich), oder null, wenn keiner mehr folgt. */
export function nextOccurrence(plan: TrainingPlan, fromKey: string): string | null {
  if (!plan.date) return null;
  // Suchfenster: bis zu 2 Monate reichen für alle Rhythmen (längster Abstand: 1 Monat)
  const limit = new Date(parseDateKey(fromKey));
  limit.setMonth(limit.getMonth() + 2);
  const limitKey = `${limit.getFullYear()}-${String(limit.getMonth() + 1).padStart(2, '0')}-${String(limit.getDate()).padStart(2, '0')}`;
  return occurrencesBetween(plan, fromKey, limitKey)[0] ?? null;
}

export type PlanSchedule =
  | { kind: 'none' } // kein Datum
  | { kind: 'once'; dateKey: string; overdue: boolean } // einmaliger Plan
  | { kind: 'recurring'; dateKey: string; recurrence: Recurrence } // nächster Termin einer laufenden Serie
  | { kind: 'ended'; recurrence: Recurrence }; // Serie ist vorbei (Enddatum erreicht)

/**
 * Zentrale Antwort auf „Wann findet der Plan statt – und ist er überfällig?“ (Prüfpunkt 2 aus C06):
 * Nur EINMALIGE Pläne können überfällig sein. Ein wiederkehrender Plan zeigt stattdessen seinen nächsten
 * Termin – er ist nicht überfällig, nur weil sein Startdatum in der Vergangenheit liegt.
 */
export function getPlanSchedule(plan: TrainingPlan, todayKey: string): PlanSchedule {
  if (!plan.date) return { kind: 'none' };
  if (!isRecurring(plan)) return { kind: 'once', dateKey: plan.date, overdue: plan.date < todayKey };
  const recurrence = plan.recurrence as Recurrence;
  const next = nextOccurrence(plan, todayKey);
  return next ? { kind: 'recurring', dateKey: next, recurrence } : { kind: 'ended', recurrence };
}

/** Kurzes Datum „TT.MM.JJJJ“ aus einem Schlüssel (ohne UTC-Verschiebung). */
export function formatDateKey(key: string): string {
  return parseDateKey(key).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
