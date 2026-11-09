// IFCM FS-021 / C13b: gespeicherte Zeiten direkt unter der Stoppuhr – benennen, umbenennen, löschen,
// Zwischenzeiten aufklappen. Bis zu 10 je Sportart (Variante a: danach ist Speichern gesperrt).
import { useState } from 'react';
import { Check, ChevronDown, Pencil, Trash2, X } from 'lucide-react';
import type { SavedTime } from '../hooks/useSavedTimes';
import { MAX_SAVED_TIMES, MAX_TIME_NAME } from '../hooks/useSavedTimes';
import { formatStopwatch, lapDurations } from '../lib/stopwatch';
import type { StopwatchLabels } from '../lib/stopwatch';
import { IconButton } from './IconButton';
import { ConfirmDialog } from './ConfirmDialog';
import { inputClass } from '../lib/formStyles';

interface SavedTimesListProps {
  times: SavedTime[];
  labels: StopwatchLabels;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function SavedTimesList({ times, labels, onRename, onDelete }: SavedTimesListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [openId, setOpenId] = useState<string | null>(null); // Zeit mit aufgeklappten Zwischenzeiten
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toDelete = times.find((t) => t.id === deleteId);

  return (
    <section aria-labelledby="saved-times-heading" className="flex flex-col gap-3">
      <h2 id="saved-times-heading" className="font-display text-lg font-bold text-ink">
        Gespeicherte Zeiten{' '}
        <span className="text-sm font-medium text-muted-2">
          ({times.length}/{MAX_SAVED_TIMES})
        </span>
      </h2>

      {times.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted">
          Noch keine Zeiten gespeichert. Stoppe eine Messung und speichere sie mit einem Namen.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {times.map((time) => {
            const laps = lapDurations(time.splits);
            const open = openId === time.id;
            return (
              <li key={time.id} className="rounded-2xl border border-border bg-surface p-3">
                {editingId === time.id ? (
                  // Umbenennen direkt in der Zeile
                  <form
                    className="flex items-center gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      onRename(time.id, draft);
                      setEditingId(null);
                    }}
                  >
                    <input
                      aria-label="Neuer Name der Zeit"
                      autoFocus
                      maxLength={MAX_TIME_NAME}
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      className={`${inputClass} h-11`}
                    />
                    <IconButton type="submit" icon={<Check size={16} />} label="Namen speichern" />
                    <IconButton icon={<X size={16} />} label="Abbrechen" onClick={() => setEditingId(null)} />
                  </form>
                ) : (
                  // zwei Zeilen: oben Name + Zeit (Name darf umbrechen), unten Datum/Anzahl + Knöpfe – passt aufs Handy
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <p className="min-w-0 flex-1 break-words font-semibold text-ink">{time.name}</p>
                      <span className="shrink-0 font-display text-xl font-extrabold tabular-nums text-sport">
                        {formatStopwatch(time.timeMs)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="min-w-0 flex-1 text-xs text-muted-2">
                        {new Date(time.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        {laps.length > 0 && ` · ${laps.length} ${laps.length === 1 ? labels.lap : labels.laps}`}
                      </p>
                      {laps.length > 0 && (
                        <IconButton
                          icon={<ChevronDown size={16} className={open ? 'rotate-180 transition' : 'transition'} />}
                          label={open ? `${labels.laps} ausblenden` : `${labels.laps} anzeigen`}
                          aria-expanded={open}
                          onClick={() => setOpenId(open ? null : time.id)}
                        />
                      )}
                      <IconButton
                        icon={<Pencil size={15} />}
                        label={`${time.name} umbenennen`}
                        onClick={() => {
                          setDraft(time.name);
                          setEditingId(time.id);
                        }}
                      />
                      <IconButton icon={<Trash2 size={15} />} label={`${time.name} löschen`} onClick={() => setDeleteId(time.id)} />
                    </div>
                  </div>
                )}
                {open && (
                  <ol className="mt-2 flex flex-col gap-1 border-t border-border pt-2 text-sm tabular-nums">
                    {laps.map((lapMs, index) => (
                      <li key={index} className="flex justify-between text-muted">
                        <span>
                          {labels.lap} {index + 1}
                        </span>
                        <span className="text-ink">{formatStopwatch(lapMs)}</span>
                        <span className="text-xs">{formatStopwatch(time.splits[index])}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Zeit löschen?"
        description={toDelete ? `„${toDelete.name}“ (${formatStopwatch(toDelete.timeMs)}) wird gelöscht.` : undefined}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
          setDeleteId(null);
        }}
      />
    </section>
  );
}
