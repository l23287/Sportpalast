// IFCM FS-015 / C10 Einführung in die App: neue Einführung mit 5 Schritten (vorher 3, auf Tischtennis zugeschnitten).
// Gestaltung: Entwurf in Claude Design (Canvas „TrainerPro Einführung (C10)“, 06.11.2026) – Reihenfolge, Texte und
// die Sportart-Auswahl im ersten Schritt stammen aus dem Entwurf; Illustrationen, Buttons und Punkte-Navigation
// bleiben im bestehenden App-Design (Design-Lob A3). Bezug: Feedback B2 „Einleitung in die Funktionen der App“.
import { useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ClipboardList,
  Clock,
  Dumbbell,
  Flag,
  Repeat,
  StickyNote,
  Sun,
  Target,
  Timer,
  Trophy,
} from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { IconButton } from '../components/IconButton';
import { OnboardingIllustration } from '../components/OnboardingIllustration';
import { BlobBackground } from '../components/BlobBackground';
import { TrainerProMark } from '../components/Logo';
import { markOnboardingSeen } from '../lib/onboarding';
import { useSport } from '../context/SportContext'; // IFCM FS-015 / C10: Sportart direkt in der Einführung wählen

interface Slide {
  kicker?: string; // IFCM FS-015 / C10: kleine Überzeile (nur Schritt 1)
  title: string;
  body: string;
  extra?: string; // IFCM FS-015 / C10: zweiter Absatz für die neuen Funktionen
  hero: ReactNode;
  accents: [ReactNode, ReactNode, ReactNode];
  sportPicker?: boolean; // IFCM FS-015 / C10: Schritt mit Sportart-Auswahl statt Illustration
}

// IFCM FS-015 / C10: Texte sportartneutral und auf dem Stand der Weiterentwicklung (C01–C09)
const SLIDES: Slide[] = [
  {
    kicker: 'Willkommen bei TrainerPro',
    title: 'Dein Training. Jede Sportart.',
    body: 'Wähle deine Sportart. Jede Sportart ist ein eigener Bereich mit eigenen Plänen, Übungen und Zielen – du kannst jederzeit wechseln.',
    extra: '12 Sportarten zur Auswahl, eigene Sportarten mit eigenem Symbol jederzeit in den Einstellungen.',
    hero: <Flag size={30} />,
    accents: [<Dumbbell key="d" size={17} />, <ClipboardList key="c" size={17} />, <Target key="t" size={17} />],
    sportPicker: true,
  },
  {
    title: 'Deine Übungsdatenbank',
    body: 'Lege Übungen mit Ziel, Schwierigkeit und Dauer an – auf die Sekunde genau, von 10 Sek. bis zu langen Einheiten.',
    extra: 'Im Timer hältst du über den Stift eine Notiz fürs nächste Mal fest.',
    hero: <Dumbbell size={30} />,
    accents: [<Clock key="clock" size={17} />, <StickyNote key="note" size={17} />, <Target key="target" size={17} />],
  },
  {
    title: 'Einmal planen – jede Woche trainieren',
    body: 'Stelle Pläne aus deinen Übungen zusammen und lass sie wöchentlich, alle 2 Wochen oder monatlich wiederholen – mit Wochentag und Uhrzeit.',
    extra: 'Im Kalender siehst du alle Termine und legst mit einem Tipp einen Plan für einen Tag an.',
    hero: <CalendarDays size={30} />,
    accents: [<Repeat key="repeat" size={17} />, <ClipboardList key="plan" size={17} />, <Clock key="clock" size={17} />],
  },
  {
    title: 'Auf einen Blick: Heute',
    body: 'Oben in den Trainingsplänen steht, was heute ansteht – mit allen Übungen und deinen Notizen.',
    extra: 'Im Plan startest du für jede Übung den Timer und führst so Schritt für Schritt durchs Training.',
    hero: <Sun size={30} />,
    accents: [<Timer key="timer" size={17} />, <StickyNote key="note" size={17} />, <Check key="check" size={17} />],
  },
  {
    title: 'Bis zu 3 Kernziele',
    body: 'Formuliere deine Ziele nach der SMART-Methode – die App zeigt dir, welche Punkte schon erfüllt sind. Erreichte Ziele hakst du ab und feierst sie.',
    extra: 'Diese Einführung findest du jederzeit in den Einstellungen.',
    hero: <Flag size={30} />,
    accents: [<Target key="target" size={17} />, <Trophy key="trophy" size={17} />, <CalendarDays key="cal" size={17} />],
  },
];

// IFCM FS-015 / C10: so viele Sportarten zeigt die Auswahl zunächst (Rest über „Alle Sportarten“)
const PICKER_PREVIEW = 6;

export function Onboarding() {
  const location = useLocation();
  const initialStep = (location.state as { initialStep?: number } | null)?.initialStep;
  const [step, setStep] = useState(
    typeof initialStep === 'number' && initialStep >= 0 && initialStep < SLIDES.length ? initialStep : 0,
  );
  const navigate = useNavigate();
  const isLast = step === SLIDES.length - 1;
  const slide = SLIDES[step];
  // IFCM FS-015 / C10: Sportart-Auswahl im ersten Schritt nutzt die echte Einstellung (SportContext)
  const { sport, setSport, sports, emojiFor, colorFor } = useSport();
  const [showAllSports, setShowAllSports] = useState(false);
  const visibleSports = showAllSports ? sports : sports.slice(0, PICKER_PREVIEW);

  function handleSkip() {
    setStep(SLIDES.length - 1);
  }

  function handleNext() {
    setStep((current) => Math.min(current + 1, SLIDES.length - 1));
  }

  function handleBack() {
    setStep((current) => Math.max(current - 1, 0));
  }

  function goToApp() {
    markOnboardingSeen();
    navigate('/plaene');
  }

  return (
    <div className="relative flex min-h-dvh flex-col px-6 py-6">
      <BlobBackground />

      <div className="flex items-center gap-2.5">
        {step > 0 && <IconButton icon={<ChevronLeft size={18} />} label="Zurück" onClick={handleBack} />}
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white">
          <TrainerProMark mono className="h-5 w-auto" />
        </div>
        <span className="font-display text-lg font-extrabold text-ink">TrainerPro</span>
      </div>

      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-6">
        {/* IFCM FS-015 / C10: Überzeile, Titel, zwei Absätze (Texte aus dem Claude-Design-Entwurf) */}
        {slide.kicker && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-sun">{slide.kicker}</p>
        )}
        <h1 className="font-display text-3xl font-extrabold leading-tight text-ink">{slide.title}</h1>
        <p className="mt-3 text-sm text-muted">{slide.body}</p>
        {slide.extra && <p className="mt-2 text-sm text-muted-2">{slide.extra}</p>}

        {slide.sportPicker ? (
          // IFCM FS-015 / C10: Sportart wählen – Auswahl wird sofort gespeichert (gleiche Einstellung wie in den Einstellungen)
          <div className="mt-6 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Sportart wählen">
              {visibleSports.map((option) => {
                const selected = option === sport;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setSport(option)}
                    className={`flex h-12 items-center gap-2 rounded-2xl border px-3 text-left text-sm font-semibold text-ink transition ${
                      selected ? 'border-2 bg-primary-soft' : 'border-border bg-bg-soft hover:border-primary/60'
                    }`}
                    style={selected ? { borderColor: colorFor(option) } : undefined}
                  >
                    <span aria-hidden="true">{emojiFor(option)}</span>
                    <span className="min-w-0 flex-1 truncate">{option}</span>
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: colorFor(option) }}
                    />
                  </button>
                );
              })}
            </div>
            {sports.length > PICKER_PREVIEW && (
              <button
                type="button"
                onClick={() => setShowAllSports((prev) => !prev)}
                aria-expanded={showAllSports}
                className="self-start py-2 text-sm font-semibold text-primary hover:underline"
              >
                {showAllSports ? 'Weniger anzeigen' : `Alle ${sports.length} Sportarten`}
              </button>
            )}
          </div>
        ) : (
          <div className="mt-10">
            <OnboardingIllustration hero={slide.hero} accents={slide.accents} />
          </div>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-sm flex-col gap-6 pb-4">
        {/* IFCM FS-015 / C10: Fortschritt für Screenreader ansagen */}
        <div className="flex items-center gap-2" role="img" aria-label={`Schritt ${step + 1} von ${SLIDES.length}`}>
          {SLIDES.map((s, index) => (
            <span
              key={s.title}
              className={`h-2 rounded-full transition-all ${
                index === step ? 'w-6 bg-gradient-to-r from-primary to-primary-dark' : 'w-2 bg-surface-2'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          {!isLast && (
            <button
              type="button"
              onClick={handleSkip}
              className="shrink-0 px-2 text-sm font-medium whitespace-nowrap text-muted transition hover:text-ink"
            >
              Überspringen
            </button>
          )}
          <PrimaryButton
            pill
            className={`shrink-0 whitespace-nowrap ${isLast ? 'w-full' : ''}`}
            onClick={isLast ? goToApp : handleNext}
          >
            {isLast ? "Los geht's" : 'Weiter'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
