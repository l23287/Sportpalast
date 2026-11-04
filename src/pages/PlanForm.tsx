import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowDown, ArrowUp, Check, ChevronLeft, Dumbbell, Plus, X } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { IconButton } from '../components/IconButton';
import { SearchInput } from '../components/SearchInput';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { EmptyState } from '../components/EmptyState'; // IFCM FS-001 / C01
import { inputClass, labelClass, selectClass, textareaClass } from '../lib/formStyles';
import { RECURRENCE_LABELS, WEEKDAY_NAMES, usesWeekday, weekdayOfKey } from '../lib/recurrence'; // IFCM FS-005 / C06, FS-006 / C06a
import { formatDuration } from '../lib/time';
import { RECURRENCES, type Exercise, type PlanInput, type Recurrence } from '../types';

export function PlanForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { exercises, plans, addPlan, updatePlan } = useAppData();
  const editingPlan = id ? plans.find((plan) => plan.id === id) : undefined;
  const isEditing = Boolean(editingPlan);
  // IFCM FS-001 / C01: Bearbeiten-URL eines Plans, der nicht (mehr) zur aktuellen Sportart gehört.
  // Ohne diese Prüfung würde stattdessen ein leeres „Neuer Plan“-Formular erscheinen.
  const planMissing = Boolean(id) && !editingPlan;
  const backTarget = editingPlan ? `/plaene/${editingPlan.id}` : '/plaene';

  const [name, setName] = useState(editingPlan?.name ?? '');
  const [description, setDescription] = useState(editingPlan?.description ?? '');
  const [targetGroup, setTargetGroup] = useState(editingPlan?.targetGroup ?? '');
  // IFCM FS-004 / C05: Beim Anlegen aus dem Kalender („Plan für diesen Tag“) kommt das Datum als ?datum=JJJJ-MM-TT.
  // Nur ein gültiges Datumsformat wird übernommen; beim Bearbeiten gilt immer das gespeicherte Datum.
  const [searchParams] = useSearchParams();
  const presetDate = searchParams.get('datum');
  const initialDate = editingPlan?.date ?? (presetDate && /^\d{4}-\d{2}-\d{2}$/.test(presetDate) ? presetDate : '');
  const [date, setDate] = useState(initialDate);
  // IFCM FS-005 / C06: Wiederholung und optionales Enddatum (alte Pläne ohne Angabe = einmalig)
  const [recurrence, setRecurrence] = useState<Recurrence>(editingPlan?.recurrence ?? 'none');
  const [recurrenceEnd, setRecurrenceEnd] = useState(editingPlan?.recurrenceEnd ?? '');
  // IFCM FS-006 / C06a: Wochentag der Wiederholung. Vorbelegung: gespeicherter Wochentag, sonst der Wochentag
  // des Startdatums. Solange der Wochentag nicht selbst gewählt wurde, folgt er dem Startdatum.
  const [weekday, setWeekday] = useState<number>(
    editingPlan?.recurrenceWeekday ?? (initialDate ? weekdayOfKey(initialDate) : 0),
  );
  const [weekdayTouched, setWeekdayTouched] = useState(
    editingPlan?.recurrenceWeekday !== undefined && editingPlan?.recurrenceWeekday !== null,
  );
  // IFCM FS-006 / C06a: Uhrzeit „HH:MM“ (optional), gilt für jeden Termin
  const [time, setTime] = useState(editingPlan?.time ?? '');
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
    // IFCM FS-005 / C06: Eine Wiederholung braucht einen ersten Termin; das Enddatum darf nicht davor liegen.
    if (recurrence !== 'none' && !date) {
      setError('Für einen wiederkehrenden Plan brauchst du ein Datum für den ersten Termin.');
      return;
    }
    if (recurrence !== 'none' && recurrenceEnd && recurrenceEnd < date) {
      setError('Das Enddatum der Wiederholung darf nicht vor dem ersten Termin liegen.');
      return;
    }
    // IFCM FS-006 / C06a: Uhrzeit nur im Format HH:MM (00:00–23:59) übernehmen
    if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      setError('Bitte gib die Uhrzeit im Format HH:MM an.');
      return;
    }
    const input: PlanInput = {
      name: name.trim(),
      description: description.trim(),
      targetGroup: targetGroup.trim(),
      date: date || null,
      exerciseIds,
      // IFCM FS-005 / C06: Regel speichern; bei „Einmalig“ wird ein altes Enddatum verworfen
      recurrence,
      recurrenceEnd: recurrence !== 'none' && recurrenceEnd ? recurrenceEnd : null,
      // IFCM FS-006 / C06a: Wochentag nur bei wöchentlich / alle 2 Wochen speichern; Uhrzeit für alle Pläne
      recurrenceWeekday: usesWeekday(recurrence) ? weekday : null,
      time: time || null,
    };
    if (editingPlan) {
      updatePlan(editingPlan.id, input);
      navigate(`/plaene/${editingPlan.id}`);
    } else {
      const plan = addPlan(input);
      navigate(`/plaene/${plan.id}`);
    }
  }

  // IFCM FS-001 / C01: Hinweis statt Formular, wenn der Plan zu einer anderen Sportart gehört
  if (planMissing) {
    return (
      <div className="flex flex-col gap-6">
        <IconButton icon={<ChevronLeft size={18} />} label="Zurück" onClick={() => navigate('/plaene')} />
        <EmptyState
          icon={<Dumbbell size={28} />}
          title="Plan nicht gefunden"
          description="Dieser Trainingsplan existiert nicht oder gehört zu einer anderen Sportart."
          action={<PrimaryButton onClick={() => navigate('/plaene')}>Zurück zur Übersicht</PrimaryButton>}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex items-center gap-3">
        <IconButton icon={<ChevronLeft size={18} />} label="Zurück" onClick={() => navigate(backTarget)} />
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
          {isEditing ? 'Plan bearbeiten' : 'Neuen Plan erstellen'}
        </h1>
      </div>

      {/* IFCM FS-005 / C06: noValidate – die Prüfungen (u. a. Enddatum ≥ erster Termin) übernimmt handleSubmit
          mit verständlicher deutscher Meldung statt der Browser-Sprechblase */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
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
              {/* IFCM FS-006 / C06a: bei Wiederholung ist das Datum der Beginn der Serie */}
              {recurrence === 'none' ? 'Datum (optional)' : 'Startdatum'}
            </label>
            <input
              id="plan-date"
              type="date"
              className={`${inputClass} [color-scheme:dark]`}
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                // IFCM FS-006 / C06a: Wochentag folgt dem Startdatum, bis er selbst gewählt wurde
                if (!weekdayTouched && event.target.value) setWeekday(weekdayOfKey(event.target.value));
              }}
            />
          </div>
          {/* IFCM FS-006 / C06a: Uhrzeit des Trainings (bei Wiederholung für jeden Termin) */}
          <div>
            <label className={labelClass} htmlFor="plan-time">
              Uhrzeit (optional)
            </label>
            <input
              id="plan-time"
              type="time"
              className={`${inputClass} [color-scheme:dark]`}
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>
          {/* IFCM FS-005 / C06: Auswahl der Wiederholung; das Datum oben ist der erste Termin */}
          <div>
            <label className={labelClass} htmlFor="plan-recurrence">
              Wiederholung
            </label>
            <select
              id="plan-recurrence"
              className={`${selectClass} [color-scheme:dark]`}
              value={recurrence}
              onChange={(event) => setRecurrence(event.target.value as Recurrence)}
            >
              {RECURRENCES.map((option) => (
                <option key={option} value={option}>
                  {RECURRENCE_LABELS[option]}
                </option>
              ))}
            </select>
          </div>
          {/* IFCM FS-006 / C06a: Wochentag nur bei wöchentlich / alle 2 Wochen (monatlich = gleicher Tag im Monat) */}
          {usesWeekday(recurrence) && (
            <div>
              <label className={labelClass} htmlFor="plan-weekday">
                Wochentag
              </label>
              <select
                id="plan-weekday"
                className={`${selectClass} [color-scheme:dark]`}
                value={weekday}
                onChange={(event) => {
                  setWeekday(Number(event.target.value));
                  setWeekdayTouched(true);
                }}
              >
                {WEEKDAY_NAMES.map((dayName, index) => (
                  <option key={dayName} value={index}>
                    {dayName}
                  </option>
                ))}
              </select>
            </div>
          )}
          {recurrence !== 'none' && (
            <div>
              <label className={labelClass} htmlFor="plan-recurrence-end">
                Wiederholen bis (optional)
              </label>
              <input
                id="plan-recurrence-end"
                type="date"
                className={`${inputClass} [color-scheme:dark]`}
                value={recurrenceEnd}
                min={date || undefined}
                onChange={(event) => setRecurrenceEnd(event.target.value)}
              />
            </div>
          )}
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
                      {formatDuration(exercise.durationSeconds) /* IFCM FS-009 / C07 */}
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
                        {formatDuration(exercise.durationSeconds) /* IFCM FS-009 / C07 */}
                      </span>
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveExercise(index, -1)}
                        aria-label="Nach oben verschieben"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-2 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        type="button"
                        disabled={index === selectedExercises.length - 1}
                        onClick={() => moveExercise(index, 1)}
                        aria-label="Nach unten verschieben"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-2 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
                      >
                        <ArrowDown size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExerciseFromPlan(exercise.id)}
                        aria-label="Entfernen"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"
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

        <div className="flex flex-col gap-3 md:flex-row">
          <PrimaryButton type="submit" icon={<Check size={18} />} className="w-full md:w-auto">
            {isEditing ? 'Änderungen speichern' : 'Plan erstellen'}
          </PrimaryButton>
          <PrimaryButton
            type="button"
            variant="ghost"
            className="w-full border border-border md:w-auto"
            onClick={() => navigate(backTarget)}
          >
            Abbrechen
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
