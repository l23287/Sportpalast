import { useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  Clock,
  Dumbbell,
  ListChecks,
  Play,
  Target,
  Timer,
  Users,
} from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { OnboardingIllustration } from '../components/OnboardingIllustration';
import { markOnboardingSeen } from '../lib/onboarding';

interface Slide {
  title: string;
  body: string;
  hero: ReactNode;
  accents: [ReactNode, ReactNode, ReactNode];
}

const SLIDES: Slide[] = [
  {
    title: 'Baue deine Übungsdatenbank',
    body: 'Lege Vorhand-, Rückhand- und Aufschlagübungen mit Ziel, Dauer und Schwierigkeitsgrad an – dein Pool für jede Einheit am Tisch.',
    hero: <Dumbbell size={30} />,
    accents: [<Target key="target" size={17} />, <Clock key="clock" size={17} />, <BarChart3 key="bar" size={17} />],
  },
  {
    title: 'Deine Pläne, immer griffbereit',
    body: 'Stelle Trainingspläne aus deinem Übungspool zusammen und behalte Zielgruppe, Dauer und Termin auf einen Blick.',
    hero: <ClipboardList size={30} />,
    accents: [
      <Calendar key="calendar" size={17} />,
      <Users key="users" size={17} />,
      <Clock key="clock" size={17} />,
    ],
  },
  {
    title: 'Training, Schritt für Schritt',
    body: 'TrainerPro führt dich live durchs Training – mit Timer für jede Übung, genau nach Plan.',
    hero: <Play size={30} />,
    accents: [
      <Timer key="timer" size={17} />,
      <CheckCircle2 key="check" size={17} />,
      <ListChecks key="list" size={17} />,
    ],
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

  function handleBack() {
    setStep((current) => Math.max(current - 1, 0));
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
    <div
      className="relative flex min-h-dvh flex-col overflow-hidden px-6 py-6"
      style={{ background: 'linear-gradient(165deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}
    >
      <div
        className="pointer-events-none absolute -top-20 -right-16 h-72 w-72 rounded-full bg-accent opacity-30 blur-[80px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-sun opacity-20 blur-[80px]"
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-2.5">
        {step > 0 && (
          <button
            type="button"
            aria-label="Zurück"
            title="Zurück"
            onClick={handleBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
          <Target size={18} />
        </div>
        <span className="font-display text-lg font-extrabold text-white">TrainerPro</span>
      </div>

      <div className="relative mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-6">
        <h1 className="font-display text-3xl font-extrabold leading-tight text-white">{slide.title}</h1>
        <p className="mt-3 max-w-xs text-sm text-white/70">{slide.body}</p>

        <div className="mt-10">
          <OnboardingIllustration hero={slide.hero} accents={slide.accents} />
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-sm flex-col gap-6 pb-4">
        <div className="flex items-center gap-2">
          {SLIDES.map((s, index) => (
            <span
              key={s.title}
              className={`h-2 rounded-full transition-all ${
                index === step ? 'w-6 bg-white' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={isLast ? goLogin : handleSkip}
            className="shrink-0 px-2 text-sm font-medium whitespace-nowrap text-white/70 transition hover:text-white"
          >
            {isLast ? 'Anmelden' : 'Überspringen'}
          </button>
          <PrimaryButton
            pill
            variant="light"
            className="shrink-0 whitespace-nowrap"
            onClick={isLast ? goRegister : handleNext}
          >
            {isLast ? 'Registrieren' : 'Weiter'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
