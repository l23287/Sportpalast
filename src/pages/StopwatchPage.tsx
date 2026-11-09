// IFCM FS-019 / C13 Stoppuhr: freie Stoppuhr für alle Sportarten.
// IFCM FS-020 / C13a: eigener Menüpunkt (/stoppuhr); Titel und Erklärtext passen sich der Sportart an
// (z. B. „Zeitmessung – Miss Bahnzeiten …“ bei Schwimmen); eigene Sportarten nutzen die Voreinstellung.
// IFCM FS-021 / C13b: gestoppte Zeiten lassen sich mit eigenem Namen speichern – bis zu 10 je Sportart, direkt unter
// der Stoppuhr aufgelistet. Bei 10 Zeiten ist Speichern gesperrt (Variante a), bis eine Zeit gelöscht wird.
import { useState } from 'react';
import { Save } from 'lucide-react';
import { StopwatchPanel } from '../components/StopwatchPanel';
import { SavedTimesList } from '../components/SavedTimesList';
import { useSport } from '../context/SportContext';
import { stopwatchLabelsFor } from '../lib/stopwatch';
import { examplesFor } from '../lib/sportExamples';
import { MAX_SAVED_TIMES, MAX_TIME_NAME, useSavedTimes } from '../hooks/useSavedTimes';
import { inputClass } from '../lib/formStyles';

export function StopwatchPage() {
  const { sport, emoji } = useSport();
  const labels = stopwatchLabelsFor(sport);
  const { times, isFull, saveTime, renameTime, deleteTime } = useSavedTimes();
  const [name, setName] = useState('');

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-2">
          {emoji} {sport}
        </p>
        <h1 className="font-display text-3xl font-extrabold text-ink">{labels.menu}</h1>
        <p className="text-sm text-muted">
          {labels.intro} Gestoppte Zeiten kannst du benennen und speichern (bis zu {MAX_SAVED_TIMES} je Sportart).
        </p>
      </header>

      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <div className="rounded-3xl border border-border bg-surface p-6">
          <StopwatchPanel
            renderSave={({ elapsedMs, splits, running, reset }) =>
              !running && elapsedMs > 0 ? (
                isFull ? (
                  // Variante a: nichts wird überschrieben
                  <p role="status" className="w-full rounded-2xl bg-bg-soft p-3 text-center text-sm text-muted">
                    {MAX_SAVED_TIMES} Zeiten gespeichert – lösche zuerst eine Zeit, um diese zu speichern.
                  </p>
                ) : (
                  <form
                    className="flex w-full flex-col gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (saveTime(name, elapsedMs, splits)) {
                        setName('');
                        reset();
                      }
                    }}
                  >
                    <label htmlFor="saved-time-name" className="text-xs font-semibold text-muted">
                      Name der Zeit
                    </label>
                    <input
                      id="saved-time-name"
                      maxLength={MAX_TIME_NAME}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={`z. B. ${examplesFor(sport).exerciseName} – Gruppe A`}
                      className={`${inputClass} h-12`}
                    />
                    <button
                      type="submit"
                      className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-primary bg-primary-soft font-semibold text-ink transition hover:brightness-110"
                    >
                      <Save size={18} /> Zeit speichern
                    </button>
                    <p className="text-[11px] text-muted-2">
                      Ohne Namen speichert die App „Zeit vom …“. Tipp: Bitte keine Namen von Sportler:innen eintragen.
                    </p>
                  </form>
                )
              ) : null
            }
          />
        </div>

        {/* IFCM FS-021 / C13b: gespeicherte Zeiten direkt unter der Stoppuhr */}
        <SavedTimesList times={times} labels={labels} onRename={renameTime} onDelete={deleteTime} />
      </div>
    </div>
  );
}
