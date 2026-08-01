import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, LogOut } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { SearchInput } from '../components/SearchInput';
import { SPORTS } from '../lib/sports';

export function Settings() {
  const { settings, setSport } = useAppData();
  const { account, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  const filteredSports = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SPORTS;
    return SPORTS.filter((sport) => sport.name.toLowerCase().includes(q));
  }, [query]);

  function handleSelect(sportName: string) {
    setSport(sportName);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 1500);
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-ink">Einstellungen</h1>
        <p className="text-sm text-muted">
          Wähle deine Sportart – sie erscheint app-weit und neue Übungen werden ihr automatisch
          zugeordnet.
        </p>
      </header>

      {account && (
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-bold text-ink">Konto</h2>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark font-display font-bold text-white">
              {account.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink">{account.name}</p>
              <p className="truncate text-sm text-muted-2">{account.email}</p>
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-ink">Sportart</h2>
          <span
            aria-live="polite"
            className={`inline-flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-semibold text-accent transition-opacity duration-300 ${
              justSaved ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Check size={14} /> Gespeichert
          </span>
        </div>

        <SearchInput value={query} onChange={setQuery} placeholder="Sportart suchen…" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filteredSports.map((sport) => {
            const isSelected = sport.name === settings.sport;
            return (
              <button
                type="button"
                key={sport.name}
                onClick={() => handleSelect(sport.name)}
                aria-pressed={isSelected}
                className={`relative flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                  isSelected ? 'border-primary bg-primary-soft' : 'border-border bg-bg-soft hover:border-primary/50'
                }`}
              >
                {isSelected && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-white">
                    <Check size={12} />
                  </span>
                )}
                <span className="text-3xl">{sport.emoji}</span>
                <span className={`text-sm font-medium ${isSelected ? 'text-ink' : 'text-muted'}`}>
                  {sport.name}
                </span>
              </button>
            );
          })}
          {filteredSports.length === 0 && (
            <p className="col-span-full py-6 text-center text-sm text-muted-2">Keine Sportart gefunden.</p>
          )}
        </div>
      </div>
    </div>
  );
}
