// IFCM FS-019 / C13 Stoppuhr: freie Stoppuhr als Reiter im Übungsbereich (für alle Sportarten).
// Zeiten werden hier NICHT gespeichert – zum Messen „zwischendurch“ (z. B. Staffel, Zirkel).
import { StopwatchPanel } from '../components/StopwatchPanel';

export function StopwatchPage() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-ink">Stoppuhr</h1>
        <p className="text-sm text-muted">
          Zeiten und Runden messen. Diese Stoppuhr speichert nichts – feste Messübungen legst du als Übung der Art
          „Zeit messen“ an, dann merkt sich die App Bestzeit und letzte Zeit.
        </p>
      </header>
      <div className="mx-auto w-full max-w-sm rounded-3xl border border-border bg-surface p-6">
        <StopwatchPanel />
      </div>
    </div>
  );
}
