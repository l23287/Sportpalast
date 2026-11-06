import { useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Plus, Trash2 } from 'lucide-react';
import { useGoals } from '../context/GoalsContext'; // IFCM FS-013 / C09
import { GoalForm } from '../components/GoalForm'; // IFCM FS-013 / C09
import { GoalsBoard } from '../components/GoalsBoard'; // IFCM FS-013 / C09
import { useSport } from '../context/SportContext';
import { useAppData } from '../context/AppDataContext'; // IFCM FS-002 / C02
import { PillSelect } from '../components/PillSelect';
import { PrimaryButton } from '../components/PrimaryButton'; // IFCM FS-002 / C02
import { IconButton } from '../components/IconButton'; // IFCM FS-002 / C02
import { ConfirmDialog } from '../components/ConfirmDialog'; // IFCM FS-002 / C02
import { ImpressumDialog } from '../components/ImpressumDialog';
import { DatenschutzDialog } from '../components/DatenschutzDialog';
import { inputClass, labelClass } from '../lib/formStyles'; // IFCM FS-002 / C02
import { CUSTOM_SPORT_EMOJIS, MAX_SPORT_NAME_LENGTH } from '../lib/sport'; // IFCM FS-002 / C02, FS-012 / C03
import type { Sport } from '../types';

export function Settings() {
  // IFCM FS-002 / C02: Liste aller Sportarten (vordefiniert + eigene) statt fester SPORTS-Liste
  // IFCM FS-012 / C03: emojiFor/colorFor für Symbole und Farbpunkte in der Auswahl
  const { sport, setSport, sports, customSports, addCustomSport, removeCustomSport, emojiFor, colorFor, moveSport } =
    useSport();
  // IFCM FS-013 / C09: Kernziele der aktuellen Sportart und Modus „Reihenfolge ändern“
  const { addGoal, canAddGoal, deleteGoalsForSport } = useGoals();
  const [reorderMode, setReorderMode] = useState(false);
  const { countForSport, deleteAllForSport } = useAppData();
  const [impressumOpen, setImpressumOpen] = useState(false);
  const [datenschutzOpen, setDatenschutzOpen] = useState(false);
  // IFCM FS-002 / C02: Formularzustand für eigene Sportart und Lösch-Bestätigung
  const [newSport, setNewSport] = useState('');
  const [sportError, setSportError] = useState('');
  const [sportToDelete, setSportToDelete] = useState<Sport | null>(null);
  // IFCM FS-012 / C03: gewähltes Symbol für die neue eigene Sportart
  const [newSportEmoji, setNewSportEmoji] = useState(CUSTOM_SPORT_EMOJIS[0]);

  // IFCM FS-002 / C02: eigene Sportart anlegen (Prüfung auf leer, Länge und Dubletten im SportContext)
  function handleAddSport(event: FormEvent) {
    event.preventDefault();
    const error = addCustomSport(newSport, newSportEmoji); // IFCM FS-012 / C03: mit Symbol
    if (error) {
      setSportError(error);
      return;
    }
    setNewSport('');
    setSportError('');
    setNewSportEmoji(CUSTOM_SPORT_EMOJIS[0]);
  }

  // IFCM FS-002 / C02: Löschen einer eigenen Sportart inkl. ihrer Pläne und Übungen (nach Bestätigung)
  function confirmDeleteSport() {
    if (!sportToDelete) return;
    deleteAllForSport(sportToDelete);
    deleteGoalsForSport(sportToDelete); // IFCM FS-013 / C09: Ziele der Sportart ebenfalls entfernen
    removeCustomSport(sportToDelete);
    setSportToDelete(null);
  }

  const deleteCounts = sportToDelete ? countForSport(sportToDelete) : null;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-ink">Einstellungen</h1>
        <p className="text-sm text-muted">Passe TrainerPro an deine Bedürfnisse an.</p>
      </header>

      {/* IFCM FS-013 / C09: „Deine Ziele“ oben im Einstellungsbereich (Mindmap-Skizze) – je Sportart */}
      <div id="ziele" className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
        <GoalsBoard mode="manage" />
        {canAddGoal ? (
          <GoalForm onSubmit={addGoal} />
        ) : (
          <p className="text-sm text-muted">
            Du hast 3 offene Kernziele – konzentriere dich auf diese. Hake ein Ziel ab oder lösche es, um ein neues
            anzulegen.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-ink">Sportart</h2>
          {/* IFCM FS-013 / C09: Kacheln in der Reihenfolge verschieben (Skizze) */}
          <button
            type="button"
            onClick={() => setReorderMode((prev) => !prev)}
            aria-pressed={reorderMode}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowUpDown size={15} /> {reorderMode ? 'Fertig' : 'Reihenfolge ändern'}
          </button>
        </div>
        {/* IFCM FS-013 / C09: Reihenfolge mit ↑/↓ statt Ziehen – funktioniert auf dem Handy, mit Tastatur und Screenreader */}
        {reorderMode && (
          <ol className="flex flex-col gap-1.5" aria-label="Reihenfolge der Sportarten">
            {sports.map((option, index) => (
              <li
                key={option}
                className="flex items-center gap-3 rounded-2xl border border-border bg-bg-soft px-3 py-1.5 text-sm text-ink"
              >
                <span className="w-5 text-right text-xs text-muted-2">{index + 1}</span>
                <span aria-hidden="true">{emojiFor(option)}</span>
                <span className="min-w-0 flex-1 truncate">{option}</span>
                <IconButton
                  icon={<ArrowUp size={15} />}
                  label={`${option} nach oben`}
                  onClick={() => moveSport(option, -1)}
                  disabled={index === 0}
                  className="disabled:opacity-30"
                />
                <IconButton
                  icon={<ArrowDown size={15} />}
                  label={`${option} nach unten`}
                  onClick={() => moveSport(option, 1)}
                  disabled={index === sports.length - 1}
                  className="disabled:opacity-30"
                />
              </li>
            ))}
          </ol>
        )}
        {/* IFCM FS-012 / C03: jede Option mit Symbol und Farbpunkt der Sportart */}
        <PillSelect
          label="Aktuelle Sportart"
          options={sports}
          value={sport}
          onChange={setSport}
          renderOption={(option) => (
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true">{emojiFor(option)}</span>
              {option}
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colorFor(option) }}
              />
            </span>
          )}
        />
        {/* IFCM FS-001 / C01: Hinweis, dass Inhalte jetzt je Sportart getrennt sind */}
        <p className="text-sm text-muted">
          Übungen und Trainingspläne werden je Sportart getrennt gespeichert. Beim Wechsel siehst du nur die
          Inhalte der gewählten Sportart – die anderen bleiben erhalten.
        </p>

        {/* IFCM FS-002 / C02: eigene Sportart anlegen */}
        <form onSubmit={handleAddSport} className="flex flex-col gap-2 border-t border-border pt-4" noValidate>
          <label className={labelClass} htmlFor="custom-sport">
            Eigene Sportart hinzufügen
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="custom-sport"
              className={inputClass}
              value={newSport}
              maxLength={MAX_SPORT_NAME_LENGTH}
              onChange={(event) => {
                setNewSport(event.target.value);
                setSportError('');
              }}
              placeholder="z. B. Hockey"
              aria-invalid={Boolean(sportError)}
              aria-describedby={sportError ? 'custom-sport-error' : undefined}
            />
            <PrimaryButton type="submit" icon={<Plus size={18} />} className="shrink-0">
              Hinzufügen
            </PrimaryButton>
          </div>
          {/* IFCM FS-012 / C03: Symbol für die eigene Sportart wählen */}
          <div role="radiogroup" aria-label="Symbol für die eigene Sportart" className="flex flex-wrap gap-1.5">
            {CUSTOM_SPORT_EMOJIS.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={newSportEmoji === option}
                aria-label={`Symbol ${option}`}
                onClick={() => setNewSportEmoji(option)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition ${
                  newSportEmoji === option
                    ? 'border-primary bg-primary-soft'
                    : 'border-border bg-bg-soft hover:border-primary/60'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {sportError && (
            <p id="custom-sport-error" className="text-sm font-medium text-danger">
              {sportError}
            </p>
          )}
        </form>

        {/* IFCM FS-002 / C02: Liste der eigenen Sportarten mit Löschen-Funktion */}
        {customSports.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className={labelClass}>Deine eigenen Sportarten</p>
            <ul className="flex flex-col gap-2">
              {customSports.map((custom) => (
                <li
                  key={custom}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-bg-soft px-4 py-2"
                >
                  <span className="min-w-0 truncate text-sm font-semibold text-ink">
                    {emojiFor(custom)} {custom} {/* IFCM FS-012 / C03: mit Symbol */}
                  </span>
                  <IconButton
                    icon={<Trash2 size={16} />}
                    label={`Sportart ${custom} löschen`}
                    onClick={() => setSportToDelete(custom)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* IFCM FS-002 / C02: Sicherheitsabfrage – nennt, wie viele Pläne/Übungen mitgelöscht werden */}
      <ConfirmDialog
        open={sportToDelete !== null}
        title={`Sportart „${sportToDelete ?? ''}“ löschen?`}
        description={
          deleteCounts &&
          `Dabei werden auch ${deleteCounts.plans} ${deleteCounts.plans === 1 ? 'Trainingsplan' : 'Trainingspläne'} und ${deleteCounts.exercises} ${deleteCounts.exercises === 1 ? 'Übung' : 'Übungen'} dieser Sportart endgültig gelöscht.`
        }
        onConfirm={confirmDeleteSport}
        onCancel={() => setSportToDelete(null)}
      />

      <div className="flex items-center gap-3 text-sm font-medium text-muted">
        <button
          type="button"
          onClick={() => setDatenschutzOpen(true)}
          className="underline-offset-2 transition hover:text-ink hover:underline"
        >
          Datenschutz
        </button>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          onClick={() => setImpressumOpen(true)}
          className="underline-offset-2 transition hover:text-ink hover:underline"
        >
          Impressum
        </button>
      </div>

      <DatenschutzDialog open={datenschutzOpen} onClose={() => setDatenschutzOpen(false)} />
      <ImpressumDialog open={impressumOpen} onClose={() => setImpressumOpen(false)} />
    </div>
  );
}
