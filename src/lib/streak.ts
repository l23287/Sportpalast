// IFCM FS-022 / C12 Streak: Berechnung der Serie aus „aktiven Tagen“.
//
// Ein Tag ist AKTIV (Vorgabe der Entwickler:in), wenn an ihm
//   - eine Übungszeit vollständig abgelaufen ist: Dauer-Übung bis 0, Satz-Übung alle Sätze geschafft,
//     „Zeit messen“-Übung eine Zeit übernommen (die freie Stoppuhr zählt nicht – keiner Übung zugeordnet), ODER
//   - eine neue Übung erstellt wurde.
// Gezählt wird EIN Streak über alle Sportarten. Gespeichert werden nur Datums-Schlüssel „JJJJ-MM-TT“ – keine Uhrzeit,
// keine Übung, keine Person.

const DAY_MS = 24 * 60 * 60 * 1000;

function keyToUtc(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Abstand in Tagen zwischen zwei Datums-Schlüsseln (UTC-Rechnung → keine Sommerzeit-Fehler). */
function dayDiff(laterKey: string, earlierKey: string): number {
  return Math.round((keyToUtc(laterKey) - keyToUtc(earlierKey)) / DAY_MS);
}

export interface StreakInfo {
  current: number; // aktuelle Serie in Tagen
  longest: number; // Rekord
  activeToday: boolean; // heute schon gezählt?
}

/**
 * Serie berechnen:
 * - „current“ zählt die Tage in Folge, die HEUTE enden – oder GESTERN, wenn heute noch nichts passiert ist
 *   (ein heute noch offener Tag unterbricht die Serie nicht; erst wenn ein ganzer Tag fehlt, beginnt sie neu).
 * - „longest“ ist die längste Folge aufeinanderfolgender aktiver Tage überhaupt.
 */
export function computeStreak(days: string[], todayKey: string): StreakInfo {
  const sorted = [...new Set(days)].sort(); // eindeutig + chronologisch (Schlüssel sind sortierbar)
  let longest = 0;
  let run = 0;
  for (let i = 0; i < sorted.length; i++) {
    run = i > 0 && dayDiff(sorted[i], sorted[i - 1]) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  const activeToday = sorted.includes(todayKey);
  const last = sorted[sorted.length - 1];
  // Serie lebt nur, wenn der letzte aktive Tag heute oder gestern war
  const current = last && dayDiff(todayKey, last) <= 1 ? run : 0;
  return { current, longest, activeToday };
}

/** Wie viele Tage höchstens gespeichert werden (reicht für Rekorde, hält den Speicher klein). */
export const MAX_STORED_DAYS = 800;
