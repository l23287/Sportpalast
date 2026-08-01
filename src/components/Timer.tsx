import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw, X } from 'lucide-react';
import { formatCountdown } from '../lib/time';
import type { Exercise } from '../types';

interface TimerProps {
  exercise: Exercise;
  onClose: () => void;
}

export function Timer({ exercise, onClose }: TimerProps) {
  const totalSeconds = exercise.durationMinutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(true);

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
        className="relative w-full max-w-sm rounded-3xl border border-border bg-surface p-8 text-center"
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
          <span className="font-display text-4xl font-extrabold tabular-nums text-ink">
            {formatCountdown(remaining)}
          </span>
        </div>

        {isDone ? (
          <p className="mb-6 font-semibold text-accent">Übung abgeschlossen! 🎉</p>
        ) : (
          <p className="mb-6 text-sm text-muted">Gesamtdauer: {exercise.durationMinutes} Min.</p>
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
