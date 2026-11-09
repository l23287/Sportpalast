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
