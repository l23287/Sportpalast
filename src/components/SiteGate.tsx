import { useState, type FormEvent, type ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';
import { BlobBackground } from './BlobBackground';
import { TrainerProLockup } from './Logo';
import { ImpressumDialog } from './ImpressumDialog';
import { DatenschutzDialog } from './DatenschutzDialog';
import { inputClass, labelClass } from '../lib/formStyles';
import { hashPassword } from '../lib/password';
import { SITE_PASSWORD_HASH } from '../lib/siteGate';

export function SiteGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [impressumOpen, setImpressumOpen] = useState(false);
  const [datenschutzOpen, setDatenschutzOpen] = useState(false);

  if (unlocked) return <>{children}</>;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!password) {
      setError('Bitte Passwort eingeben.');
      return;
    }
    setChecking(true);
    const hash = await hashPassword(password);
    setChecking(false);
    if (hash !== SITE_PASSWORD_HASH) {
      setError('Falsches Passwort.');
      return;
    }
    setUnlocked(true);
  }

  return (
    <div className="relative flex min-h-dvh flex-col px-6 py-6">
      <BlobBackground />

      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
        <div className="mb-8">
          <TrainerProLockup />
        </div>
        <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Lock size={20} />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-ink">Zugang geschützt</h1>
        <p className="mt-2 text-sm text-muted">
          Dies ist eine private Website. Bitte gib das Zugangspasswort ein.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className={labelClass} htmlFor="site-gate-password">
              Zugangspasswort
            </label>
            <input
              id="site-gate-password"
              type="password"
              className={inputClass}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="off"
              autoFocus
            />
          </div>

          {error && <p className="text-sm font-medium text-danger">{error}</p>}

          <PrimaryButton type="submit" fullWidth className="mt-2" disabled={checking}>
            {checking ? 'Prüfe…' : 'Weiter'}
          </PrimaryButton>
        </form>

        <div className="mt-6 flex items-center justify-center gap-3 text-[11px] text-muted-2">
          <button type="button" onClick={() => setDatenschutzOpen(true)} className="underline-offset-2 hover:underline">
            Datenschutz
          </button>
          <span aria-hidden="true">·</span>
          <button type="button" onClick={() => setImpressumOpen(true)} className="underline-offset-2 hover:underline">
            Impressum
          </button>
        </div>
      </div>

      <DatenschutzDialog open={datenschutzOpen} onClose={() => setDatenschutzOpen(false)} />
      <ImpressumDialog open={impressumOpen} onClose={() => setImpressumOpen(false)} />
    </div>
  );
}
