import { useEffect, useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { Modal } from './Modal';
import { PrimaryButton } from './PrimaryButton';
import { inputClass, labelClass, selectClass, textareaClass } from '../lib/formStyles';
import { DIFFICULTIES } from '../types';
import type { Difficulty, Exercise, ExerciseInput } from '../types';
import { MAX_EXERCISE_SECONDS, splitSeconds } from '../lib/duration'; // IFCM FS-009 / C07
import type { ExerciseFormat, MuscleGroup } from '../types'; // IFCM FS-017 / C11
import { useSport } from '../context/SportContext'; // IFCM FS-017 / C11: Standard-Art je Sportart
import {
  DEFAULT_REST_SECONDS,
  MAX_REPS,
  MAX_REST_SECONDS,
  MAX_SETS,
  MAX_WEIGHT_KG,
  MUSCLE_GROUPS,
  defaultFormatFor,
  estimateSetsSeconds,
  formatOf,
} from '../lib/strength'; // IFCM FS-017 / C11
import { formatDuration } from '../lib/time'; // IFCM FS-017 / C11: geschätzte Dauer anzeigen
import { examplesFor } from '../lib/sportExamples'; // IFCM FS-018 / C16

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
  // IFCM FS-017 / C11: Art der Übung, Kraft-Angaben und Muskelgruppe
  const { sport } = useSport();
  const examples = examplesFor(sport); // IFCM FS-018 / C16: Vorschläge passend zur Sportart
  const [format, setFormat] = useState<ExerciseFormat>('duration');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(''); // Text, damit „42,5“ mit Komma eingegeben werden kann
  const [restSeconds, setRestSeconds] = useState(DEFAULT_REST_SECONDS);
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | ''>('');

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
    // IFCM FS-017 / C11: neue Übung in Gym/Fitness startet als Satz-Übung, sonst als Dauer-Übung
    setFormat(exercise ? formatOf(exercise) : defaultFormatFor(sport));
    setSets(exercise?.sets ?? 3);
    setReps(exercise?.reps ?? 10);
    setWeight(exercise?.weightKg ? String(exercise.weightKg).replace('.', ',') : '');
    setRestSeconds(exercise?.restSeconds ?? DEFAULT_REST_SECONDS);
    setMuscleGroup(exercise?.muscleGroup ?? '');
  }, [open, exercise, sport]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError('Bitte gib einen Namen für die Übung ein.');
      return;
    }
    // IFCM FS-017 / C11: Satz-Übung – eigene Prüfung, Dauer wird geschätzt statt eingegeben
    if (format === 'sets') {
      const weightKg = weight.trim() ? Number(weight.replace(',', '.')) : null;
      if (!Number.isInteger(sets) || sets < 1 || sets > MAX_SETS) {
        setError(`Bitte gib zwischen 1 und ${MAX_SETS} Sätze an.`);
        return;
      }
      if (!Number.isInteger(reps) || reps < 1 || reps > MAX_REPS) {
        setError(`Bitte gib zwischen 1 und ${MAX_REPS} Wiederholungen an.`);
        return;
      }
      if (weightKg !== null && (!Number.isFinite(weightKg) || weightKg < 0 || weightKg > MAX_WEIGHT_KG)) {
        setError(`Das Gewicht muss zwischen 0 und ${MAX_WEIGHT_KG} kg liegen.`);
        return;
      }
      if (!Number.isInteger(restSeconds) || restSeconds < 0 || restSeconds > MAX_REST_SECONDS) {
        setError(`Die Satzpause muss zwischen 0 und ${MAX_REST_SECONDS} Sekunden liegen.`);
        return;
      }
      onSubmit({
        name: name.trim(),
        description: description.trim(),
        goal: goal.trim(),
        difficulty,
        format: 'sets',
        sets,
        reps,
        weightKg: weightKg || null, // 0 kg = kein Gewicht (z. B. Eigengewicht)
        restSeconds,
        muscleGroup: muscleGroup || null,
        // geschätzte Dauer, damit Plansummen, „Heute“ und Statistik ohne Umbau weiter stimmen
        durationSeconds: estimateSetsSeconds(sets, reps, restSeconds),
      });
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
      format, // IFCM FS-017 / C11 · IFCM FS-019 / C13: 'duration' oder 'stopwatch'
      muscleGroup: muscleGroup || null, // IFCM FS-017 / C11
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
            placeholder={`z. B. ${examples.exerciseName}`} // IFCM FS-018 / C16
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
            placeholder={`z. B. ${examples.exerciseGoal}`} // IFCM FS-018 / C16
          />
        </div>
        {/* IFCM FS-017 / C11: Art der Übung wählen – Dauer oder Sätze × Wiederholungen */}
        <div role="radiogroup" aria-label="Art der Übung" className="grid grid-cols-3 gap-2">
          {(
            [
              ['duration', 'Dauer'],
              ['sets', 'Sätze × Wdh.'],
              ['stopwatch', 'Zeit messen'], // IFCM FS-019 / C13
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={format === value}
              onClick={() => {
                setFormat(value);
                setError('');
              }}
              className={`h-11 rounded-2xl border px-1 text-sm font-semibold transition ${
                format === value
                  ? 'border-transparent bg-gradient-to-br from-primary to-primary-dark text-white'
                  : 'border-border bg-bg-soft text-muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {format === 'sets' && (
          // IFCM FS-017 / C11: Kraft-Angaben; Gewicht optional (leer = Eigengewicht), Komma erlaubt
          <fieldset className="flex flex-col gap-3">
            <legend className="sr-only">Sätze, Wiederholungen, Gewicht und Satzpause</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="exercise-sets">Sätze</label>
                <input id="exercise-sets" type="number" inputMode="numeric" min={1} max={MAX_SETS} className={inputClass}
                  value={sets} onChange={(event) => { setSets(Number(event.target.value)); setError(''); }} />
              </div>
              <div>
                <label className={labelClass} htmlFor="exercise-reps">Wiederholungen</label>
                <input id="exercise-reps" type="number" inputMode="numeric" min={1} max={MAX_REPS} className={inputClass}
                  value={reps} onChange={(event) => { setReps(Number(event.target.value)); setError(''); }} />
              </div>
              <div>
                <label className={labelClass} htmlFor="exercise-weight">Gewicht in kg (optional)</label>
                <input id="exercise-weight" inputMode="decimal" className={inputClass} placeholder="z. B. 40"
                  value={weight} onChange={(event) => { setWeight(event.target.value); setError(''); }} />
              </div>
              <div>
                <label className={labelClass} htmlFor="exercise-rest">Satzpause in Sek.</label>
                <input id="exercise-rest" type="number" inputMode="numeric" min={0} max={MAX_REST_SECONDS} className={inputClass}
                  value={restSeconds} onChange={(event) => { setRestSeconds(Number(event.target.value)); setError(''); }} />
              </div>
            </div>
            <p className="text-xs text-muted-2">
              Geschätzte Dauer: {formatDuration(estimateSetsSeconds(sets || 0, reps || 0, restSeconds || 0))} (für
              Plansummen). Das Gewicht kannst du später direkt auf der Übungskarte oder im Timer mit +/− anpassen.
            </p>
          </fieldset>
        )}

        {/* IFCM FS-009 / C07: Dauer mit Minuten UND Sekunden (vorher nur ganze Minuten, mindestens 1)
            IFCM FS-019 / C13: bei „Zeit messen“ dieselben Felder als geplante Dauer (für Plansummen) */}
        {format !== 'sets' && (
        <fieldset>
          <legend className={labelClass}>{format === 'stopwatch' ? 'Geplante Dauer (für Plansummen)' : 'Dauer'}</legend>
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
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* IFCM FS-017 / C11: Muskelgruppe zum Ordnen (optional, in jeder Sportart) */}
          <div>
            <label className={labelClass} htmlFor="exercise-muscle">
              Muskelgruppe (optional)
            </label>
            <select
              id="exercise-muscle"
              className={selectClass}
              value={muscleGroup}
              onChange={(event) => setMuscleGroup(event.target.value as MuscleGroup | '')}
            >
              <option value="">– keine –</option>
              {MUSCLE_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
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
