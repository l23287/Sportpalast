import { useEffect, useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { Modal } from './Modal';
import { PrimaryButton } from './PrimaryButton';
import { inputClass, labelClass, selectClass, textareaClass } from '../lib/formStyles';
import { DIFFICULTIES } from '../types';
import type { Difficulty, Exercise, ExerciseInput } from '../types';
import { MAX_EXERCISE_SECONDS, splitSeconds } from '../lib/duration'; // IFCM FS-009 / C07

interface ExerciseFormModalProps {
  open: boolean;
  exercise: Exercise | null;
  onClose: () => void;
  onSubmit: (input: ExerciseInput) => void;
}

export function ExerciseFormModal({ open, exercise, onClose, onSubmit }: ExerciseFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  // IFCM FS-009 / C07: Dauer als zwei Felder – Minuten und Sekunden (Standard: 15 Min. 0 Sek.)
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [durationSecondsPart, setDurationSecondsPart] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('Anfänger');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(exercise?.name ?? '');
    setDescription(exercise?.description ?? '');
    setGoal(exercise?.goal ?? '');
    // IFCM FS-009 / C07: gespeicherte Sekunden auf die zwei Felder aufteilen (z. B. 90 → 1 Min. 30 Sek.)
    const split = splitSeconds(exercise?.durationSeconds ?? 15 * 60);
    setDurationMinutes(split.minutes);
    setDurationSecondsPart(split.seconds);
    setDifficulty(exercise?.difficulty ?? 'Anfänger');
    setError('');
  }, [open, exercise]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError('Bitte gib einen Namen für die Übung ein.');
      return;
    }
    // IFCM FS-009 / C07: Prüfung beider Felder; die Gesamtdauer muss größer als 0 sein
    if (
      !Number.isInteger(durationMinutes) ||
      !Number.isInteger(durationSecondsPart) ||
      durationMinutes < 0 ||
      durationSecondsPart < 0 ||
      durationSecondsPart > 59
    ) {
      setError('Bitte gib ganze Minuten und Sekunden zwischen 0 und 59 an.');
      return;
    }
    const durationSeconds = durationMinutes * 60 + durationSecondsPart;
    if (durationSeconds <= 0) {
      setError('Die Dauer muss größer als 0 sein – z. B. 0 Min. 10 Sek.');
      return;
    }
    if (durationSeconds > MAX_EXERCISE_SECONDS) {
      setError('Eine Übung darf höchstens 24 Stunden dauern.');
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      goal: goal.trim(),
      durationSeconds, // IFCM FS-009 / C07
      difficulty,
    });
  }

  return (
    <Modal open={open} title={exercise ? 'Übung bearbeiten' : 'Neue Übung'} onClose={onClose}>
      {/* IFCM FS-009 / C07: noValidate – eigene deutsche Fehlermeldungen statt Browser-Sprechblasen */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <label className={labelClass} htmlFor="exercise-name">
            Name
          </label>
          <input
            id="exercise-name"
            className={inputClass}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="z. B. Vorhand-Rückhand-Wechsel"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="exercise-description">
            Beschreibung
          </label>
          <textarea
            id="exercise-description"
            className={textareaClass}
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Wie läuft die Übung ab?"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="exercise-goal">
            Ziel
          </label>
          <input
            id="exercise-goal"
            className={inputClass}
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            placeholder="z. B. Schlagpräzision"
          />
        </div>
        {/* IFCM FS-009 / C07: Dauer mit Minuten UND Sekunden (vorher nur ganze Minuten, mindestens 1) */}
        <fieldset>
          <legend className={labelClass}>Dauer</legend>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input
                id="exercise-duration"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                aria-label="Dauer in Minuten"
                className={`${inputClass} pr-14`}
                value={durationMinutes}
                onChange={(event) => {
                  setDurationMinutes(Number(event.target.value));
                  setError(''); // alte Meldung entfernen, sobald korrigiert wird
                }}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-2">Min.</span>
            </div>
            <div className="relative">
              <input
                id="exercise-duration-seconds"
                type="number"
                inputMode="numeric"
                min={0}
                max={59}
                step={1}
                aria-label="Dauer in Sekunden"
                className={`${inputClass} pr-14`}
                value={durationSecondsPart}
                onChange={(event) => {
                  setDurationSecondsPart(Number(event.target.value));
                  setError('');
                }}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-2">Sek.</span>
            </div>
          </div>
        </fieldset>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass} htmlFor="exercise-difficulty">
              Schwierigkeitsgrad
            </label>
            <select
              id="exercise-difficulty"
              className={selectClass}
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as Difficulty)}
            >
              {DIFFICULTIES.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-sm font-medium text-danger">{error}</p>}

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <PrimaryButton type="submit" icon={<Check size={18} />} className="w-full sm:w-auto">
            {exercise ? 'Änderungen speichern' : 'Übung erstellen'}
          </PrimaryButton>
          <PrimaryButton
            type="button"
            variant="ghost"
            className="w-full border border-border sm:w-auto"
            onClick={onClose}
          >
            Abbrechen
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
