import { useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClipboardList, Dumbbell, Play, Target } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { OnboardingBlob } from '../components/OnboardingBlob';
import { BlobBackground } from '../components/BlobBackground';
import { markOnboardingSeen } from '../lib/onboarding';

interface Slide {
  eyebrow: string;
  headlineWhite: string;
  headlineAccent: string;
  body: string;
  icon: ReactNode;
}

const SLIDES: Slide[] = [
  {
    eyebrow: 'Geführter Einstieg',
    headlineWhite: 'Baue deine',
    headlineAccent: 'Übungsdatenbank.',
    body: 'Lege Übungen mit Ziel, Dauer und Schwierigkeitsgrad an – dein persönlicher Pool für jede Trainingseinheit.',
    icon: <Dumbbell size={28} />,
  },
  {
    eyebrow: 'Alles im Blick',
    headlineWhite: 'Deine Pläne,',
    headlineAccent: 'immer griffbereit.',
    body: 'Stelle Trainingspläne aus deinem Übungspool zusammen und behalte Zielgruppe, Dauer und Termin auf einen Blick.',
    icon: <ClipboardList size={28} />,
  },
  {
    eyebrow: 'Willkommen bei',
    headlineWhite: 'Dein Training,',
    headlineAccent: 'Schritt für Schritt.',
    body: 'TrainerPro führt dich live durchs Training – mit Timer für jede Übung, genau nach Plan.',
    icon: <Play size={28} />,
  },
];

export function Onboarding() {
  const location = useLocation();
  const initialStep = (location.state as { initialStep?: number } | null)?.initialStep;
  const [step, setStep] = useState(
    typeof initialStep === 'number' && initialStep >= 0 && initialStep < SLIDES.length ? initialStep : 0,
  );
  const navigate = useNavigate();
  const isLast = step === SLIDES.length - 1;
  const slide = SLIDES[step];

  function handleSkip() {
    setStep(SLIDES.length - 1);
  }

  function handleNext() {
    setStep((current) => Math.min(current + 1, SLIDES.length - 1));
  }

  function goRegister() {
    markOnboardingSeen();
    navigate('/registrieren');
  }

  function goLogin() {
    markOnboardingSeen();
    navigate('/anmelden');
  }

  return (
    <div className="relative flex min-h-dvh flex-col px-6 py-6">
      <BlobBackground />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white">
            <Target size={18} />
          </div>
          <span className="font-display text-lg font-extrabold text-ink">TrainerPro</span>
        </div>
        {!isLast && (
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm font-medium text-muted transition hover:text-ink"
          >
            Überspringen
          </button>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center py-10 text-center">
        <OnboardingBlob icon={slide.icon} />

        <p className="mt-10 text-sm font-semibold text-accent">{slide.eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-ink">
          {slide.headlineWhite}
          <br />
          <span className="text-primary">{slide.headlineAccent}</span>
        </h1>
        <p className="mt-4 max-w-xs text-sm text-muted">{slide.body}</p>
      </div>

      <div className="mx-auto flex w-full max-w-sm flex-col gap-6 pb-4">
        <div className="flex items-center justify-center gap-2">
          {SLIDES.map((s, index) => (
            <span
              key={s.headlineAccent}
              className={`h-2 rounded-full transition-all ${
                index === step ? 'w-6 bg-gradient-to-r from-primary to-primary-dark' : 'w-2 bg-surface-2'
              }`}
            />
          ))}
        </div>

        {isLast ? (
          <div className="flex flex-col gap-3">
            <PrimaryButton variant="accent" fullWidth onClick={goRegister}>
              Account erstellen
            </PrimaryButton>
            <button
              type="button"
              onClick={goLogin}
              className="text-center text-sm font-medium text-muted transition hover:text-ink"
            >
              Ich habe schon einen Account
            </button>
          </div>
        ) : (
          <PrimaryButton fullWidth onClick={handleNext}>
            Weiter
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}
