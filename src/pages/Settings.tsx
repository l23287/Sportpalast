import { useState, type FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useSport } from '../context/SportContext';
import { useAppData } from '../context/AppDataContext'; // IFCM FS-002 / C02
import { PillSelect } from '../components/PillSelect';
import { PrimaryButton } from '../components/PrimaryButton'; // IFCM FS-002 / C02
import { IconButton } from '../components/IconButton'; // IFCM FS-002 / C02
import { ConfirmDialog } from '../components/ConfirmDialog'; // IFCM FS-002 / C02
import { ImpressumDialog } from '../components/ImpressumDialog';
import { DatenschutzDialog } from '../components/DatenschutzDialog';
import { inputClass, labelClass } from '../lib/formStyles'; // IFCM FS-002 / C02
import { MAX_SPORT_NAME_LENGTH } from '../lib/sport'; // IFCM FS-002 / C02
import type { Sport } from '../types';

export function Settings() {
  // IFCM FS-002 / C02: Liste aller Sportarten (vordefiniert + eigene) statt fester SPORTS-Liste
  const { sport, setSport, sports, customSports, addCustomSport, removeCustomSport } = useSport();
  const { countForSport, deleteAllForSport } = useAppData();
  const [impressumOpen, setImpressumOpen] = useState(false);
  const [datenschutzOpen, setDatenschutzOpen] = useState(false);
  // IFCM FS-002 / C02: Formularzustand für eigene Sportart und Lösch-Bestätigung
  const [newSport, setNewSport] = useState('');
  const [sportError, setSportError] = useState('');
  const [sportToDelete, setSportToDelete] = useState<Sport | null>(null);

  // IFCM FS-002 / C02: eigene Sportart anlegen (Prüfung auf leer, Länge und Dubletten im SportContext)
  function handleAddSport(event: FormEvent) {
    event.preventDefault();
    const error = addCustomSport(newSport);
    if (error) {
      setSportError(error);
      return;
    }
    setNewSport('');
    setSportError('');
  }

  // IFCM FS-002 / C02: Löschen einer eigenen Sportart inkl. ihrer Pläne und Übungen (nach Bestätigung)
  function confirmDeleteSport() {
    if (!sportToDelete) return;
    deleteAllForSport(sportToDelete);
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

      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-bold text-ink">Sportart</h2>
        <PillSelect label="Aktuelle Sportart" options={sports} value={sport} onChange={setSport} />
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
                  <span className="min-w-0 truncate text-sm font-semibold text-ink">{custom}</span>
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
