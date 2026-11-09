import { useEffect, useState } from 'react';
import { Check, Pause, Pencil, Play, RotateCcw, SkipForward, StickyNote, X } from 'lucide-react';
import { useAppData } from '../context/AppDataContext'; // IFCM FS-010 / C08
import { MAX_NOTE_LENGTH, NOTE_PRIVACY_HINT } from '../lib/note'; // IFCM FS-010 / C08
import { formatCountdown, formatDuration } from '../lib/time'; // IFCM FS-009 / C07: formatDuration
import type { Exercise } from '../types';
import { formatOf } from '../lib/strength'; // IFCM FS-017 / C11
import { WeightStepper } from './WeightStepper'; // IFCM FS-017 / C11
import { useSport } from '../context/SportContext'; // IFCM FS-018 / C16
import { examplesFor } from '../lib/sportExamples'; // IFCM FS-018 / C16
import { StopwatchPanel } from './StopwatchPanel'; // IFCM FS-019 / C13
import { useStreak } from '../context/StreakContext'; // IFCM FS-022 / C12
import { formatStopwatch, isNewBest } from '../lib/stopwatch'; // IFCM FS-019 / C13

interface TimerProps {
  exercise: Exercise;
  onClose: () => void;
}

export function Timer({ exercise, onClose }: TimerProps) {
  // IFCM FS-009 / C07: Dauer liegt direkt in Sekunden vor (vorher Minuten × 60)
  const totalSeconds = exercise.durationSeconds;
  // IFCM FS-009 / C07: Übungen unter einer Minute zeigen im Kreis „10 sek“ statt „00:10“ (Mindmap-Skizze)
  const shortExercise = totalSeconds < 60;
  // IFCM FS-017 / C11 Satz- und Pausen-Timer: Bei Satz-Übungen läuft KEIN Gesamt-Countdown. Stattdessen:
  //   Phase „work“: „Satz x von n“ – die Person trainiert und tippt „Satz geschafft“
  //   Phase „rest“: Satzpause zählt herunter (remaining); bei 0 oder „Pause überspringen“ → nächster Satz
  //   Phase „done“: alle Sätze geschafft
  // Die Hooks stehen immer (React-Regel), die Darstellung unterscheidet sich je nach Art der Übung.
  const isSets = formatOf(exercise) === 'sets';
  const totalSets = exercise.sets ?? 1;
  const restSeconds = exercise.restSeconds ?? 0;
  const [phase, setPhase] = useState<'work' | 'rest' | 'done'>('work');
  const [currentSet, setCurrentSet] = useState(1);
  const { getExercise, recordExerciseTime } = useAppData(); // IFCM FS-019 / C13: + recordExerciseTime
  // IFCM FS-019 / C13: „Zeit messen“ – Stoppuhr statt Countdown; Rückmeldung nach dem Übernehmen einer Zeit
  const isStopwatch = formatOf(exercise) === 'stopwatch';
  const [savedMessage, setSavedMessage] = useState('');
  // IFCM FS-022 / C12: vollständig abgelaufene Übungszeit zählt für den Streak (jeder Tag nur einmal)
  // IFCM FS-023 / C14: statt nur den Tag zu merken wird die absolvierte Übung protokolliert (zählt auch für den Streak)
  const { logCompletedExercise } = useStreak();
  const logDone = (seconds: number) =>
    logCompletedExercise({
      sport: exercise.sport,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      seconds: Math.max(0, Math.round(seconds)),
      kind: formatOf(exercise),
    });
  const { sport } = useSport(); // IFCM FS-018 / C16: Notiz-Vorschlag passend zur Sportart
  // live aus dem Speicher lesen, damit das per +/− geänderte Gewicht sofort im Timer erscheint
  const liveExercise = getExercise(exercise.id) ?? exercise;

  const [remaining, setRemaining] = useState(isSets ? 0 : totalSeconds);
  const [running, setRunning] = useState(!isSets && formatOf(exercise) !== 'stopwatch'); // Satz-/Stoppuhr-Übung: kein Countdown

  // IFCM FS-010 / C08 Notizzettel: Entwurf der Notiz (Start: gespeicherte Notiz vom letzten Mal).
  // Jede Änderung wird sofort gespeichert. Der Countdown hängt nur an exercise.id/totalSeconds – das Speichern
  // der Notiz setzt den Timer daher NICHT zurück und unterbricht ihn nicht.
  const { updateExerciseNote } = useAppData();
  const [noteDraft, setNoteDraft] = useState(exercise.note ?? '');
  const [noteOpen, setNoteOpen] = useState(false);

  function handleNoteChange(value: string) {
    setNoteDraft(value);
    updateExerciseNote(exercise.id, value);
  }

  useEffect(() => {
    // IFCM FS-017 / C11: Satz-Übung beginnt bei Satz 1 ohne Countdown
    setRemaining(isSets ? 0 : totalSeconds);
    setRunning(!isSets && !isStopwatch); // IFCM FS-019 / C13: bei „Zeit messen“ läuft kein Countdown
    setPhase('work');
    setCurrentSet(1);
  }, [exercise.id, totalSeconds, isSets, isStopwatch]);

  // IFCM FS-022 / C12: Dauer-Übung bis 0 heruntergezählt → Tag zählt für den Streak.
  // (Satz-Übung: in completeSet beim letzten Satz; „Zeit messen“: beim Übernehmen einer Zeit.)
  useEffect(() => {
    if (!isSets && !isStopwatch && totalSeconds > 0 && remaining === 0) logDone(totalSeconds); // IFCM FS-023 / C14
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nur beim Erreichen von 0 auslösen, nicht bei neuem logDone
  }, [isSets, isStopwatch, totalSeconds, remaining]);

  // IFCM FS-017 / C11: Satzpause abgelaufen → automatisch zum nächsten Satz
  useEffect(() => {
    if (isSets && phase === 'rest' && remaining === 0) {
      setPhase('work');
      setCurrentSet((prev) => prev + 1);
    }
  }, [isSets, phase, remaining]);

  // IFCM FS-017 / C11: „Satz geschafft“ – nach dem letzten Satz fertig, sonst Satzpause starten (oder ohne Pause weiter)
  function completeSet() {
    if (currentSet >= totalSets) {
      setPhase('done');
      setRunning(false);
      logDone(exercise.durationSeconds); // IFCM FS-022 / C12 + FS-023 / C14: alle Sätze geschafft → protokolliert (geschätzte Dauer)
      return;
    }
    if (restSeconds > 0) {
      setPhase('rest');
      setRemaining(restSeconds);
      setRunning(true);
    } else {
      setCurrentSet((prev) => prev + 1);
    }
  }

  function skipRest() {
    setRunning(false);
    setRemaining(0); // löst den Effekt oben aus → nächster Satz
  }

  function restartSets() {
    setPhase('work');
    setCurrentSet(1);
    setRemaining(0);
    setRunning(false);
  }

  useEffect(() => {
    if (!running) return undefined;
    const intervalId = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [running]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // IFCM FS-017 / C11: „fertig“ und Fortschrittsring je nach Art – bei Sätzen = Anteil geschaffter Sätze
  const isDone = isSets ? phase === 'done' : remaining === 0;
  const progress = isSets
    ? (phase === 'done' ? totalSets : currentSet - 1) / totalSets
    : totalSeconds === 0
      ? 1
      : 1 - remaining / totalSeconds;
  const circumference = 2 * Math.PI * 45;

  // IFCM FS-019 / C13: Übung der Art „Zeit messen“ → eigener Dialog mit Stoppuhr (alle Hooks stehen oben)
  if (isStopwatch) {
    return (
      <div
        className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      >
        <div
          className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-3xl border border-border bg-surface p-8 text-center"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`Stoppuhr für ${exercise.name}`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-soft text-muted transition hover:text-ink"
          >
            <X size={16} />
          </button>
          <p className="text-sm font-medium text-muted-2">Zeit messen</p>
          <h3 className="mt-1 mb-6 px-6 font-display text-xl font-bold text-ink">{exercise.name}</h3>

          <StopwatchPanel
            onSave={(timeMs) => {
              // Bestzeit-Vergleich mit dem Stand VOR dem Speichern (live aus dem Speicher)
              const best = isNewBest(timeMs, liveExercise.bestTimeMs);
              recordExerciseTime(exercise.id, timeMs);
              logDone(timeMs / 1000); // IFCM FS-022 / C12 + FS-023 / C14: Messung übernommen → protokolliert (gemessene Zeit)
              setSavedMessage(
                best ? `Neue Bestzeit: ${formatStopwatch(timeMs)} 🎉` : `Zeit gespeichert: ${formatStopwatch(timeMs)}`,
              );
            }}
          />

          {savedMessage && (
            <p role="status" className="mt-4 font-semibold text-accent">
              {savedMessage}
            </p>
          )}
          <p className="mt-4 text-sm text-muted">
            {liveExercise.bestTimeMs ? `Bestzeit ${formatStopwatch(liveExercise.bestTimeMs)}` : 'Noch keine Bestzeit'}
            {liveExercise.lastTimeMs ? ` · zuletzt ${formatStopwatch(liveExercise.lastTimeMs)}` : ''}
          </p>
          <p className="mt-1 text-[11px] text-muted-2">Gespeichert wird nur die Zeit an der Übung – ohne Namen.</p>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 h-14 w-full rounded-2xl border border-border font-semibold text-muted transition hover:bg-surface-2 hover:text-ink"
          >
            Schließen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        // IFCM FS-010 / C08: max-h + overflow, damit der Dialog mit offener Notiz und Handy-Tastatur scrollbar bleibt
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-3xl border border-border bg-surface p-8 text-center"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Timer für ${exercise.name}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-soft text-muted transition hover:text-ink"
        >
          <X size={16} />
        </button>

        <p className="text-sm font-medium text-muted-2">Übung</p>
        <h3 className="mt-1 px-6 font-display text-xl font-bold text-ink">{exercise.name}</h3>

        <div className="relative mx-auto my-8 flex h-56 w-56 items-center justify-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-surface-2)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isDone ? 'var(--color-accent)' : 'url(#timer-gradient)'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
            <defs>
              <linearGradient id="timer-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-primary-dark)" />
              </linearGradient>
            </defs>
          </svg>
          {/* IFCM FS-010 / C08: Stift-Icon im Kreis unter der Zeit (Mindmap-Skizze) öffnet/schließt den Notizzettel */}
          <div className="relative flex flex-col items-center gap-2">
            {isSets ? (
              // IFCM FS-017 / C11: „Satz 2 von 3“ bzw. Pausen-Countdown im Kreis
              phase === 'rest' ? (
                <span className="flex flex-col items-center">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted">Pause</span>
                  <span className="font-display text-4xl font-extrabold tabular-nums text-ink">
                    {remaining < 60 ? `${remaining} sek` : formatCountdown(remaining)}
                  </span>
                </span>
              ) : (
                <span className="flex flex-col items-center">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted">Satz</span>
                  <span className="font-display text-4xl font-extrabold tabular-nums text-ink">
                    {Math.min(currentSet, totalSets)} von {totalSets}
                  </span>
                  <span className="text-sm text-muted">{liveExercise.reps} Wdh.</span>
                </span>
              )
            ) : (
              <span className="font-display text-4xl font-extrabold tabular-nums text-ink">
                {shortExercise ? `${remaining} sek` : formatCountdown(remaining)}
              </span>
            )}
            <button
              type="button"
              onClick={() => setNoteOpen((prev) => !prev)}
              aria-label={noteOpen ? 'Notiz schließen' : 'Notiz öffnen'}
              aria-expanded={noteOpen}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                noteOpen || noteDraft
                  ? 'border-transparent bg-primary text-white'
                  : 'border-border bg-bg-soft text-muted hover:text-ink'
              }`}
            >
              <Pencil size={15} />
            </button>
          </div>
        </div>

        {/* IFCM FS-010 / C08: Notizzettel – geschlossen als Erinnerung „vom letzten Mal“, geöffnet als Eingabefeld */}
        {noteOpen ? (
          <div className="mb-6 flex flex-col gap-1.5 text-left">
            <label htmlFor="exercise-note" className="text-xs font-semibold text-muted">
              Notiz fürs nächste Mal
            </label>
            <textarea
              id="exercise-note"
              rows={3}
              autoFocus
              maxLength={MAX_NOTE_LENGTH}
              value={noteDraft}
              onChange={(event) => handleNoteChange(event.target.value)}
              placeholder={`z. B. ${examplesFor(sport).note}`} // IFCM FS-018 / C16
              className="w-full resize-none rounded-2xl border border-border bg-bg-soft px-4 py-3 text-sm text-ink outline-none placeholder:text-muted-2 focus:border-primary"
            />
            <div className="flex justify-between gap-3 text-[11px] text-muted-2">
              <span>{NOTE_PRIVACY_HINT} Wird automatisch gespeichert.</span>
              <span className="shrink-0 tabular-nums">
                {noteDraft.length}/{MAX_NOTE_LENGTH}
              </span>
            </div>
          </div>
        ) : (
          noteDraft && (
            <button
              type="button"
              onClick={() => setNoteOpen(true)}
              className="mb-6 flex w-full items-start gap-2 rounded-2xl border border-primary/40 bg-primary-soft px-4 py-3 text-left text-sm text-ink"
            >
              <StickyNote size={16} className="mt-0.5 shrink-0 text-primary" />
              <span className="min-w-0 whitespace-pre-line break-words">{noteDraft}</span>
            </button>
          )
        )}

        {/* IFCM FS-017 / C11: Gewicht direkt am Gerät anpassen (gespeichert für das nächste Mal) */}
        {isSets && (
          <div className="mb-4 flex flex-col items-center gap-1">
            <span className="text-xs font-semibold text-muted">Gewicht</span>
            <WeightStepper exercise={liveExercise} size="lg" />
          </div>
        )}

        {isDone ? (
          <p className="mb-6 font-semibold text-accent">Übung abgeschlossen! 🎉</p>
        ) : isSets ? (
          <p className="mb-6 text-sm text-muted">
            {totalSets} × {liveExercise.reps} · {restSeconds} Sek. Satzpause
          </p>
        ) : (
          <p className="mb-6 text-sm text-muted">Gesamtdauer: {formatDuration(exercise.durationSeconds)}</p>
        )}

        <div className="flex gap-3">
          {/* IFCM FS-017 / C11: eigene Buttons für Satz-Übungen */}
          {isSets && !isDone ? (
            phase === 'rest' ? (
              <button
                type="button"
                onClick={skipRest}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-primary-dark font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.35)] transition hover:brightness-110"
              >
                <SkipForward size={18} />
                {/* kurzer Text, damit der Button auf dem Handy einzeilig bleibt */}
                Nächster Satz
              </button>
            ) : (
              <button
                type="button"
                onClick={completeSet}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-primary-dark font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.35)] transition hover:brightness-110"
              >
                <Check size={18} />
                Satz geschafft
              </button>
            )
          ) : isDone ? (
            <button
              type="button"
              onClick={() => {
                if (isSets) {
                  restartSets(); // IFCM FS-017 / C11
                  return;
                }
                setRemaining(totalSeconds);
                setRunning(true);
              }}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-primary-dark font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.35)] transition hover:brightness-110"
            >
              <RotateCcw size={18} />
              Neu starten
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setRunning((prev) => !prev)}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-primary-dark font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.35)] transition hover:brightness-110"
            >
              {running ? <Pause size={18} /> : <Play size={18} />}
              {running ? 'Pause' : 'Fortsetzen'}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="h-14 flex-1 rounded-2xl border border-border font-semibold text-muted transition hover:bg-surface-2 hover:text-ink"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
