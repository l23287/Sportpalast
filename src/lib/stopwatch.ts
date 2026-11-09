// IFCM FS-019 / C13 Stoppuhr: Formatierung und Hilfen für gemessene Zeiten (in Millisekunden).

/**
 * Zeit als Stoppuhr-Text mit Zehntelsekunden:
 *   38 400 ms → „0:38,4“ · 75 250 ms → „1:15,2“ · 3 725 000 ms → „1:02:05,0“
 * Zehntel werden abgeschnitten (nicht gerundet), wie bei echten Stoppuhren.
 */
export function formatStopwatch(ms: number): string {
  const safe = Math.max(0, Math.floor(ms));
  const tenths = Math.floor(safe / 100) % 10;
  const totalSeconds = Math.floor(safe / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  const ss = String(seconds).padStart(2, '0');
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${ss},${tenths}`
    : `${minutes}:${ss},${tenths}`;
}

/** Rundenzeiten aus Zwischenzeiten: [30 s, 65 s, 98 s] → [30 s, 35 s, 33 s]. */
export function lapDurations(splits: number[]): number[] {
  return splits.map((split, index) => split - (index > 0 ? splits[index - 1] : 0));
}

/** Neue Bestzeit? Bei der Stoppuhr ist die KLEINERE Zeit besser. */
export function isNewBest(timeMs: number, bestMs: number | null | undefined): boolean {
  return timeMs > 0 && (bestMs === null || bestMs === undefined || timeMs < bestMs);
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
// IFCM FS-020 / C13a: Beschriftungen der Stoppuhr je Sportart (Menüname, Taste „Runde“, Listenname, Erklärtext).
// Eigene (neu erstellte) Sportarten bekommen automatisch die Voreinstellung DEFAULT_STOPWATCH_LABELS.
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
export interface StopwatchLabels {
  menu: string; // Name in der Menüzeile und Seitentitel
  lap: string; // Taste „Runde“ (Einzahl)
  laps: string; // Überschrift der Liste (Mehrzahl)
  intro: string; // kurzer Erklärtext auf der Stoppuhr-Seite
}

/** Voreinstellung für alle Sportarten ohne eigene Beschriftung – insbesondere neu erstellte eigene Sportarten. */
export const DEFAULT_STOPWATCH_LABELS: StopwatchLabels = {
  menu: 'Stoppuhr',
  lap: 'Runde',
  laps: 'Runden',
  intro: 'Miss Zeiten und Zwischenzeiten deiner Übungen.',
};

const BALL_RALLY: StopwatchLabels = {
  menu: 'Stoppuhr',
  lap: 'Ballwechsel',
  laps: 'Ballwechsel',
  intro: 'Miss die Dauer von Ballwechseln und Spielphasen.',
};

const TEAM_SPORT: StopwatchLabels = {
  menu: 'Stoppuhr',
  lap: 'Abschnitt',
  laps: 'Abschnitte',
  intro: 'Miss Spielabschnitte, Übungsphasen und Zwischenzeiten.',
};

const STOPWATCH_LABELS: Record<string, StopwatchLabels> = {
  Schwimmen: { menu: 'Zeitmessung', lap: 'Bahn', laps: 'Bahnen', intro: 'Miss Bahnzeiten und Zwischenzeiten.' },
  Leichtathletik: { menu: 'Zeitmessung', lap: 'Runde', laps: 'Runden', intro: 'Miss Lauf-, Runden- und Zwischenzeiten.' },
  'Gym/Fitness': { menu: 'Stoppuhr', lap: 'Satz', laps: 'Sätze', intro: 'Miss die Zeit pro Satz, Zirkel oder Intervall.' },
  Turnen: { menu: 'Stoppuhr', lap: 'Durchgang', laps: 'Durchgänge', intro: 'Miss Durchgänge und Haltezeiten.' },
  Fußball: TEAM_SPORT,
  Handball: TEAM_SPORT,
  Basketball: TEAM_SPORT,
  Tischtennis: BALL_RALLY,
  Tennis: BALL_RALLY,
  Badminton: BALL_RALLY,
  Volleyball: BALL_RALLY,
  'Beach Volleyball': BALL_RALLY,
};

/** Beschriftungen für eine Sportart; unbekannte (eigene) Sportarten → Voreinstellung. */
export function stopwatchLabelsFor(sport: string): StopwatchLabels {
  return STOPWATCH_LABELS[sport] ?? DEFAULT_STOPWATCH_LABELS;
}
