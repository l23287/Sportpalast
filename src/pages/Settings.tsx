import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ScrollText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSport } from '../context/SportContext';
import { PillSelect } from '../components/PillSelect';
import { SPORTS } from '../types';

export function Settings() {
  const { account, logout } = useAuth();
  const { sport, setSport } = useSport();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-ink">Einstellungen</h1>
        <p className="text-sm text-muted">Verwalte dein Konto.</p>
      </header>

      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-bold text-ink">Sportart</h2>
        <PillSelect label="Aktuelle Sportart" options={SPORTS} value={sport} onChange={setSport} />
      </div>

      {account && (
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-bold text-ink">Konto</h2>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark font-display font-bold text-white">
              {account.username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink">{account.username}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/anmelden');
            }}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border text-sm font-semibold text-danger transition hover:bg-danger/10"
          >
            <LogOut size={16} />
            Abmelden
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-bold text-ink">Rechtliches</h2>
        <div className="flex flex-col gap-1">
          <Link
            to="/impressum"
            className="flex h-12 items-center gap-3 rounded-2xl px-2 text-sm font-semibold text-muted transition hover:bg-surface-2 hover:text-ink"
          >
            <ScrollText size={16} />
            Impressum
          </Link>
          <Link
            to="/datenschutz"
            className="flex h-12 items-center gap-3 rounded-2xl px-2 text-sm font-semibold text-muted transition hover:bg-surface-2 hover:text-ink"
          >
            <ScrollText size={16} />
            Datenschutzerklärung
          </Link>
        </div>
      </div>
    </div>
  );
}
