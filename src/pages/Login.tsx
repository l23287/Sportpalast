import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { IconButton } from '../components/IconButton';
import { BlobBackground } from '../components/BlobBackground';
import { TrainerProLockup } from '../components/Logo';
import { inputClass, labelClass } from '../lib/formStyles';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError('Bitte Benutzername und Passwort eingeben.');
      return;
    }
    login(username.trim());
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
        <h1 className="font-display text-3xl font-extrabold text-ink">Willkommen zurück!</h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className={labelClass} htmlFor="login-username">
              Benutzername
            </label>
            <input
              id="login-username"
              className={inputClass}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="dein.benutzername"
              autoComplete="username"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="login-password">
              Passwort
            </label>
            <input
              id="login-password"
              type="password"
              className={inputClass}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm font-medium text-danger">{error}</p>}

          <PrimaryButton type="submit" fullWidth className="mt-2">
            Anmelden
          </PrimaryButton>
        </form>

        <button
          type="button"
          onClick={() => navigate('/registrieren')}
          className="mt-6 text-center text-sm font-medium text-muted transition hover:text-ink"
        >
          Noch keinen Account? <span className="text-accent">Jetzt registrieren</span>
        </button>
      </div>
    </div>
  );
}
