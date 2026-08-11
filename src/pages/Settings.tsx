import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const { account, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-ink">Einstellungen</h1>
        <p className="text-sm text-muted">Verwalte dein Konto.</p>
      </header>

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
    </div>
  );
}
