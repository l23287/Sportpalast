// IFCM FS-019 / C13 Stoppuhr: Anzeige und Bedienung – genutzt als freie Stoppuhr (Reiter im Übungsbereich) und im
// Timer bei Übungen der Art „Zeit messen“. Große Tasten (h-14) für die Bedienung in Halle oder Schwimmbad.
import type { ReactNode } from 'react';
import { Flag, Pause, Play, RotateCcw, Save } from 'lucide-react';
import { useStopwatch } from '../hooks/useStopwatch';
import { formatStopwatch, lapDurations, stopwatchLabelsFor } from '../lib/stopwatch';
import { useSport } from '../context/SportContext'; // IFCM FS-020 / C13a

interface StopwatchPanelProps {
  // optional: „Zeit übernehmen“ – nur im Timer einer Übung (speichert letzte Zeit/Bestzeit an der Übung)
  onSave?: (timeMs: number) => void;
  // IFCM FS-021 / C13b: optionaler Bereich zum Speichern mit Namen (freie Stoppuhr). Bekommt die gestoppte Zeit,
  // die Zwischenzeiten und reset(), damit die Stoppuhr nach dem Speichern wieder bei 0 steht.
  renderSave?: (args: { elapsedMs: number; splits: number[]; running: boolean; reset: () => void }) => ReactNode;
}

export function StopwatchPanel({ onSave, renderSave }: StopwatchPanelProps) {
  const { elapsedMs, running, splits, start, stop, lap, reset } = useStopwatch();
  // IFCM FS-020 / C13a: „Runde“ heißt je Sportart z. B. „Bahn“ (Schwimmen) oder „Satz“ (Gym/Fitness)
  const { sport } = useSport();
  const labels = stopwatchLabelsFor(sport);
  const laps = lapDurations(splits);
  const fastest = laps.length > 1 ? Math.min(...laps) : null;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Zeitanzeige; role="timer" + aria-live „off“: Screenreader lesen sie auf Nachfrage, nicht 10× pro Sekunde */}
      <div
        role="timer"
        aria-live="off"
        aria-label={`Gemessene Zeit ${formatStopwatch(elapsedMs)}`}
        className="font-display text-6xl font-extrabold tabular-nums text-ink"
      >
        {formatStopwatch(elapsedMs)}
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        {running ? (
          <button
            type="button"
            onClick={stop}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-primary-dark font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.35)] transition hover:brightness-110"
          >
            <Pause size={18} /> Stopp
          </button>
        ) : (
          <button
            type="button"
            onClick={start}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-primary-dark font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.35)] transition hover:brightness-110"
          >
            <Play size={18} /> {elapsedMs > 0 ? 'Weiter' : 'Start'}
          </button>
        )}
        {/* Läuft: „Runde“ – angehalten: „Zurücksetzen“ (wie bei üblichen Stoppuhren) */}
        {running ? (
          <button
            type="button"
            onClick={lap}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-border font-semibold text-ink transition hover:bg-surface-2"
          >
            <Flag size={18} /> {labels.lap}
          </button>
        ) : (
          <button
            type="button"
            onClick={reset}
            disabled={elapsedMs === 0}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-border font-semibold text-ink transition hover:bg-surface-2 disabled:opacity-40"
          >
            <RotateCcw size={18} /> Zurücksetzen
          </button>
        )}
      </div>

      {onSave && !running && elapsedMs > 0 && (
        <button
          type="button"
          onClick={() => {
            onSave(elapsedMs);
            reset();
          }}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-primary bg-primary-soft font-semibold text-ink transition hover:brightness-110"
        >
          <Save size={18} /> Zeit übernehmen
        </button>
      )}

      {/* IFCM FS-021 / C13b: Speichern mit Namen (nur freie Stoppuhr) */}
      {renderSave?.({ elapsedMs, splits, running, reset })}

      {/* Runden: neueste oben; schnellste Runde markiert */}
      {laps.length > 0 && (
        <ol className="flex w-full flex-col gap-1 text-sm" aria-label={labels.laps}>
          {laps
            .map((lapMs, index) => ({ lapMs, index, split: splits[index] }))
            .reverse()
            .map(({ lapMs, index, split }) => (
              <li
                key={index}
                className={`flex items-center justify-between rounded-xl px-3 py-2 tabular-nums ${
                  lapMs === fastest ? 'bg-sport/15 text-ink' : 'bg-bg-soft text-muted'
                }`}
              >
                <span>
                  {labels.lap} {index + 1}
                  {lapMs === fastest && <span className="ml-2 text-xs font-semibold text-sport">schnellste</span>}
                </span>
                <span className="font-semibold text-ink">{formatStopwatch(lapMs)}</span>
                <span className="text-xs">{formatStopwatch(split)}</span>
              </li>
            ))}
        </ol>
      )}
    </div>
  );
}
