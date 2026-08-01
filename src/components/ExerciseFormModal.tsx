import { useEffect, useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { Modal } from './Modal';
import { PrimaryButton } from './PrimaryButton';
import { inputClass, labelClass, selectClass, textareaClass } from '../lib/formStyles';
import { DIFFICULTIES } from '../types';
import type { Difficulty, Exercise, ExerciseInput } from '../types';

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
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [difficulty, setDifficulty] = useState<Difficulty>('Anfänger');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(exercise?.name ?? '');
    setDescription(exercise?.description ?? '');
    setGoal(exercise?.goal ?? '');
    setDurationMinutes(exercise?.durationMinutes ?? 15);
    setDifficulty(exercise?.difficulty ?? 'Anfänger');
    setError('');
  }, [open, exercise]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError('Bitte gib einen Namen für die Übung ein.');
      return;
    }
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      setError('Die Dauer muss größer als 0 Minuten sein.');
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      goal: goal.trim(),
      durationMinutes,
      difficulty,
    });
  }

  return (
    <Modal open={open} title={exercise ? 'Übung bearbeiten' : 'Neue Übung'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="exercise-duration">
              Dauer (Minuten)
            </label>
            <input
              id="exercise-duration"
              type="number"
              min={1}
              className={inputClass}
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(Number(event.target.value))}
            />
          </div>
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

        <div className="mt-2 flex gap-3">
          <PrimaryButton type="submit" icon={<Check size={18} />}>
            {exercise ? 'Änderungen speichern' : 'Übung erstellen'}
          </PrimaryButton>
          <PrimaryButton type="button" variant="ghost" className="border border-border" onClick={onClose}>
            Abbrechen
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
