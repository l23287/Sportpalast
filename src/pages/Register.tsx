import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { IconButton } from '../components/IconButton';
import { BlobBackground } from '../components/BlobBackground';
import { TrainerProLockup } from '../components/Logo';
import { inputClass, labelClass } from '../lib/formStyles';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError('Bitte alle Felder ausfüllen.');
      return;
    }
    register(username.trim());
    navigate('/plaene');
  }

  return (
    <div className="relative flex min-h-dvh flex-col px-6 py-6">
      <BlobBackground />

      <IconButton
        icon={<ChevronLeft size={18} />}
        label="Zurück"
        onClick={() => navigate('/onboarding', { state: { initialStep: 2 } })}
      />

      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
        <div className="mb-8">
          <TrainerProLockup />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-ink">Account erstellen</h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className={labelClass} htmlFor="register-username">
              Benutzername
            </label>
            <input
              id="register-username"
              className={inputClass}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="dein.benutzername"
              autoComplete="username"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="register-password">
              Passwort
            </label>
            <input
              id="register-password"
              type="password"
              className={inputClass}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-sm font-medium text-danger">{error}</p>}

          <PrimaryButton type="submit" variant="accent" fullWidth className="mt-2">
            Konto erstellen
          </PrimaryButton>
        </form>

        <button
          type="button"
          onClick={() => navigate('/anmelden')}
          className="mt-6 text-center text-sm font-medium text-muted transition hover:text-ink"
        >
          Bereits registriert? <span className="text-accent">Anmelden</span>
        </button>
      </div>
    </div>
  );
}
