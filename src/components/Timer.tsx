import { useEffect, useState } from 'react';
import { Pause, Pencil, Play, RotateCcw, StickyNote, X } from 'lucide-react';
import { useAppData } from '../context/AppDataContext'; // IFCM FS-010 / C08
import { MAX_NOTE_LENGTH, NOTE_PRIVACY_HINT } from '../lib/note'; // IFCM FS-010 / C08
import { formatCountdown, formatDuration } from '../lib/time'; // IFCM FS-009 / C07: formatDuration
import type { Exercise } from '../types';

interface TimerProps {
  exercise: Exercise;
  onClose: () => void;
}

export function Timer({ exercise, onClose }: TimerProps) {
  // IFCM FS-009 / C07: Dauer liegt direkt in Sekunden vor (vorher Minuten × 60)
  const totalSeconds = exercise.durationSeconds;
  // IFCM FS-009 / C07: Übungen unter einer Minute zeigen im Kreis „10 sek“ statt „00:10“ (Mindmap-Skizze)
  const shortExercise = totalSeconds < 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(true);

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
    setRemaining(totalSeconds);
    setRunning(true);
  }, [exercise.id, totalSeconds]);

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

  const isDone = remaining === 0;
  const progress = totalSeconds === 0 ? 1 : 1 - remaining / totalSeconds;
  const circumference = 2 * Math.PI * 45;

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
            <span className="font-display text-4xl font-extrabold tabular-nums text-ink">
              {shortExercise ? `${remaining} sek` : formatCountdown(remaining)}
            </span>
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
              placeholder="z. B. Abstand verkürzen, lieber 2 Durchgänge …"
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

        {isDone ? (
          <p className="mb-6 font-semibold text-accent">Übung abgeschlossen! 🎉</p>
        ) : (
          <p className="mb-6 text-sm text-muted">Gesamtdauer: {formatDuration(exercise.durationSeconds)}</p>
        )}

        <div className="flex gap-3">
          {isDone ? (
            <button
              type="button"
              onClick={() => {
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
