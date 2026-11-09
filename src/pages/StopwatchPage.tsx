// IFCM FS-019 / C13 Stoppuhr: freie Stoppuhr für alle Sportarten. Zeiten werden hier NICHT gespeichert.
// IFCM FS-020 / C13a: eigener Menüpunkt (/stoppuhr); Titel und Erklärtext passen sich der Sportart an
// (z. B. „Zeitmessung – Miss Bahnzeiten …“ bei Schwimmen); eigene Sportarten nutzen die Voreinstellung.
import { StopwatchPanel } from '../components/StopwatchPanel';
import { useSport } from '../context/SportContext';
import { stopwatchLabelsFor } from '../lib/stopwatch';

export function StopwatchPage() {
  const { sport, emoji } = useSport();
  const labels = stopwatchLabelsFor(sport);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-2">
          {emoji} {sport}
        </p>
        <h1 className="font-display text-3xl font-extrabold text-ink">{labels.menu}</h1>
        <p className="text-sm text-muted">
          {labels.intro} Diese Uhr speichert nichts – feste Messübungen legst du als Übung der Art „Zeit messen“ an, dann
          merkt sich die App Bestzeit und letzte Zeit.
        </p>
      </header>
      <div className="mx-auto w-full max-w-sm rounded-3xl border border-border bg-surface p-6">
        <StopwatchPanel />
      </div>
    </div>
  );
}
