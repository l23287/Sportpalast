import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowDown, ArrowUp, Check, ChevronLeft, Plus, X } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { IconButton } from '../components/IconButton';
import { SearchInput } from '../components/SearchInput';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { inputClass, labelClass, textareaClass } from '../lib/formStyles';
import { formatDuration } from '../lib/time';
import type { Exercise, PlanInput } from '../types';

export function PlanForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { exercises, plans, addPlan, updatePlan } = useAppData();
  const editingPlan = id ? plans.find((plan) => plan.id === id) : undefined;
  const isEditing = Boolean(editingPlan);
  const backTarget = editingPlan ? `/plaene/${editingPlan.id}` : '/plaene';

  const [name, setName] = useState(editingPlan?.name ?? '');
  const [description, setDescription] = useState(editingPlan?.description ?? '');
  const [targetGroup, setTargetGroup] = useState(editingPlan?.targetGroup ?? '');
  const [date, setDate] = useState(editingPlan?.date ?? '');
  const [exerciseIds, setExerciseIds] = useState<string[]>(editingPlan?.exerciseIds ?? []);
  const [poolQuery, setPoolQuery] = useState('');
  const [error, setError] = useState('');

  const selectedExercises = useMemo(
    () =>
      exerciseIds
        .map((exerciseId) => exercises.find((e) => e.id === exerciseId))
        .filter((e): e is Exercise => Boolean(e)),
    [exerciseIds, exercises],
  );

  const availableExercises = useMemo(() => {
    const q = poolQuery.trim().toLowerCase();
    return exercises
      .filter((exercise) => !exerciseIds.includes(exercise.id))
      .filter((exercise) => !q || exercise.name.toLowerCase().includes(q));
  }, [exercises, exerciseIds, poolQuery]);

  function addExerciseToPlan(exerciseId: string) {
    setExerciseIds((prev) => [...prev, exerciseId]);
  }

  function removeExerciseFromPlan(exerciseId: string) {
    setExerciseIds((prev) => prev.filter((eid) => eid !== exerciseId));
  }

  function moveExercise(index: number, direction: -1 | 1) {
    setExerciseIds((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError('Bitte gib einen Namen für den Plan ein.');
      return;
    }
    const input: PlanInput = {
      name: name.trim(),
      description: description.trim(),
      targetGroup: targetGroup.trim(),
      date: date || null,
      exerciseIds,
    };
    if (editingPlan) {
      updatePlan(editingPlan.id, input);
      navigate(`/plaene/${editingPlan.id}`);
    } else {
      const plan = addPlan(input);
      navigate(`/plaene/${plan.id}`);
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex items-center gap-3">
        <IconButton icon={<ChevronLeft size={18} />} label="Zurück" onClick={() => navigate(backTarget)} />
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
          {isEditing ? 'Plan bearbeiten' : 'Neuen Plan erstellen'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <section className="grid grid-cols-1 gap-5 rounded-3xl border border-border bg-surface p-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="plan-name">
              Name
            </label>
            <input
              id="plan-name"
              className={inputClass}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="z. B. Techniktraining U14"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="plan-description">
              Beschreibung
            </label>
            <textarea
              id="plan-description"
              className={textareaClass}
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Worum geht es in dieser Einheit?"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="plan-target-group">
              Zielgruppe
            </label>
            <input
              id="plan-target-group"
              className={inputClass}
              value={targetGroup}
              onChange={(event) => setTargetGroup(event.target.value)}
              placeholder="z. B. U14, Fortgeschrittene"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="plan-date">
              Datum (optional)
            </label>
            <input
              id="plan-date"
              type="date"
              className={`${inputClass} [color-scheme:dark]`}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-3xl border border-border bg-surface p-5">
            <h2 className="font-display text-lg font-bold text-ink">Übungspool</h2>
            <SearchInput value={poolQuery} onChange={setPoolQuery} placeholder="Übung suchen…" />
            <div className="flex max-h-96 flex-col gap-2 overflow-y-auto pr-1">
              {availableExercises.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-2">Keine Übungen gefunden.</p>
              )}
              {availableExercises.map((exercise) => (
                <button
                  type="button"
                  key={exercise.id}
                  onClick={() => addExerciseToPlan(exercise.id)}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-bg-soft px-4 py-3 text-left transition hover:border-primary"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">{exercise.name}</span>
                    <span className="mt-1.5 flex items-center gap-2 text-xs text-muted-2">
                      <DifficultyBadge difficulty={exercise.difficulty} />
                      {formatDuration(exercise.durationMinutes)}
                    </span>
                  </span>
                  <Plus size={18} className="shrink-0 text-primary" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-border bg-surface p-5">
            <h2 className="font-display text-lg font-bold text-ink">
              Ausgewählte Übungen {selectedExercises.length > 0 && `(${selectedExercises.length})`}
            </h2>
            {selectedExercises.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-2">
                Noch keine Übungen ausgewählt. Wähle Übungen aus dem Pool aus.
              </p>
            ) : (
              <ol className="flex flex-col gap-2">
                {selectedExercises.map((exercise, index) => (
                  <li
                    key={exercise.id}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-bg-soft px-4 py-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft font-display text-xs font-bold text-accent">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">{exercise.name}</span>
                      <span className="mt-1.5 flex items-center gap-2 text-xs text-muted-2">
                        <DifficultyBadge difficulty={exercise.difficulty} />
                        {formatDuration(exercise.durationMinutes)}
                      </span>
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveExercise(index, -1)}
                        aria-label="Nach oben verschieben"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-surface-2 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        type="button"
                        disabled={index === selectedExercises.length - 1}
                        onClick={() => moveExercise(index, 1)}
                        aria-label="Nach unten verschieben"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-surface-2 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
                      >
                        <ArrowDown size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExerciseFromPlan(exercise.id)}
                        aria-label="Entfernen"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>

        {error && <p className="text-sm font-medium text-danger">{error}</p>}

        <div className="flex gap-3">
          <PrimaryButton type="submit" icon={<Check size={18} />}>
            {isEditing ? 'Änderungen speichern' : 'Plan erstellen'}
          </PrimaryButton>
          <PrimaryButton
            type="button"
            variant="ghost"
            className="border border-border"
            onClick={() => navigate(backTarget)}
          >
            Abbrechen
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
