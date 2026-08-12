import { useState } from 'react';
import { useSport } from '../context/SportContext';
import { PillSelect } from '../components/PillSelect';
import { ImpressumDialog } from '../components/ImpressumDialog';
import { SPORTS } from '../types';

export function Settings() {
  const { sport, setSport } = useSport();
  const [impressumOpen, setImpressumOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-ink">Einstellungen</h1>
        <p className="text-sm text-muted">Passe TrainerPro an deine Bedürfnisse an.</p>
      </header>

      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-bold text-ink">Sportart</h2>
        <PillSelect label="Aktuelle Sportart" options={SPORTS} value={sport} onChange={setSport} />
      </div>

      <button
        type="button"
        onClick={() => setImpressumOpen(true)}
        className="self-start text-sm font-medium text-muted underline-offset-2 transition hover:text-ink hover:underline"
      >
        Impressum
      </button>

      <ImpressumDialog open={impressumOpen} onClose={() => setImpressumOpen(false)} />
    </div>
  );
}
