// IFCM FS-019 / C13 Stoppuhr: Zustand und Logik einer hochzählenden Stoppuhr mit Runden.
//
// Wichtig für die Genauigkeit (Prüfpunkt 1): Die Zeit wird NICHT durch Hochzählen in einem Intervall ermittelt
// (Browser drosseln Intervalle im Hintergrund-Tab oder bei gesperrtem Bildschirm – die Stoppuhr ginge dann nach).
// Stattdessen merkt sich die Stoppuhr den Startzeitpunkt und berechnet die Zeit immer aus der Systemuhr:
//   verstrichen = bereits gemessene Zeit + (jetzt − letzter Start)
// Das Intervall (alle 100 ms) sorgt nur dafür, dass die Anzeige neu gezeichnet wird.
import { useCallback, useEffect, useState } from 'react';

export interface Stopwatch {
  elapsedMs: number;
  running: boolean;
  splits: number[]; // Zwischenzeiten (Gesamtzeit beim Drücken von „Runde“)
  start: () => void;
  stop: () => void;
  lap: () => void;
  reset: () => void;
}

export function useStopwatch(): Stopwatch {
  const [startedAt, setStartedAt] = useState<number | null>(null); // null = angehalten
  const [accumulatedMs, setAccumulatedMs] = useState(0); // Zeit aus früheren Start/Stopp-Abschnitten
  const [splits, setSplits] = useState<number[]>([]);
  const [now, setNow] = useState(() => Date.now());

  const running = startedAt !== null;

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [running]);

  const elapsedMs = accumulatedMs + (running ? Math.max(0, now - startedAt) : 0);

  const start = useCallback(() => {
    const t = Date.now();
    setNow(t);
    setStartedAt(t);
  }, []);

  const stop = useCallback(() => {
    if (startedAt === null) return;
    const t = Date.now();
    setAccumulatedMs((prev) => prev + (t - startedAt));
    setStartedAt(null);
    setNow(t);
  }, [startedAt]);

  const lap = useCallback(() => {
    if (startedAt === null) return;
    const t = Date.now();
    setSplits((prev) => [...prev, accumulatedMs + (t - startedAt)]);
  }, [startedAt, accumulatedMs]);

  const reset = useCallback(() => {
    setStartedAt(null);
    setAccumulatedMs(0);
    setSplits([]);
    setNow(Date.now());
  }, []);

  return { elapsedMs, running, splits, start, stop, lap, reset };
}
