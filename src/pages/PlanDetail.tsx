import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, ChevronLeft, Clock, Dumbbell, Pencil, Play, Repeat, Trash2, Users } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { IconButton } from '../components/IconButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Timer } from '../components/Timer';
import { formatDuration } from '../lib/time';
// IFCM FS-005 / C06: zentrale Termin-/Überfällig-Logik für einmalige und wiederkehrende Pläne
import { RECURRENCE_LABELS, describeRecurrence, formatDateKey, formatTime, getPlanSchedule } from '../lib/recurrence';
import { toDateKey } from '../lib/calendar';
import type { Exercise } from '../types';

export function PlanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlan, exercises, deletePlan } = useAppData();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  const plan = id ? getPlan(id) : undefined;

  if (!plan) {
    return (
      <div className="flex flex-col gap-6">
        <IconButton icon={<ChevronLeft size={18} />} label="Zurück" onClick={() => navigate('/plaene')} />
        <EmptyState
          icon={<Dumbbell size={28} />}
          title="Plan nicht gefunden"
          // IFCM FS-001 / C01: Text um den Fall „andere Sportart“ ergänzt
          description="Dieser Trainingsplan existiert nicht (mehr) oder gehört zu einer anderen Sportart."
          action={
            <PrimaryButton onClick={() => navigate('/plaene')}>Zurück zur Übersicht</PrimaryButton>
          }
        />
      </div>
    );
  }

  const planExercises = plan.exerciseIds
    .map((exerciseId) => exercises.find((e) => e.id === exerciseId))
    .filter((e): e is Exercise => Boolean(e));
  // IFCM FS-009 / C07: Summe in Sekunden
  const totalSeconds = planExercises.reduce((sum, e) => sum + e.durationSeconds, 0);
  // IFCM FS-005 / C06: Nur einmalige Pläne können überfällig sein.
  const schedule = getPlanSchedule(plan, toDateKey(new Date()));
  const overdue = schedule.kind === 'once' && schedule.overdue;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex items-start gap-3">
        <IconButton
          icon={<ChevronLeft size={18} />}
          label="Zurück"
          onClick={() => navigate('/plaene')}
          className="mt-0.5 shrink-0"
        />
        <h1 className="min-w-0 flex-1 break-words font-display text-2xl font-extrabold text-ink sm:text-3xl">
          {plan.name}
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          <IconButton
            icon={<Pencil size={16} />}
            label="Plan bearbeiten"
            onClick={() => navigate(`/plaene/${plan.id}/bearbeiten`)}
          />
          <IconButton icon={<Trash2 size={16} />} label="Plan löschen" onClick={() => setConfirmDelete(true)} />
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center gap-2">
          {/* IFCM FS-005 / C06: einmaliger Plan → Datum (ggf. „Überfällig“) */}
          {schedule.kind === 'once' && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-semibold ${
                overdue ? 'bg-danger/15 text-danger' : 'bg-surface-2 text-muted'
              }`}
            >
              <Calendar size={13} />
              {formatDateKey(schedule.dateKey)}
              {/* IFCM FS-006 / C06a: Uhrzeit */}
              {plan.time && `, ${formatTime(plan.time)}`}
              {overdue && ' · Überfällig'}
            </span>
          )}
          {/* IFCM FS-005 / C06: wiederkehrender Plan → Rhythmus + nächster Termin, nie „Überfällig“ */}
          {schedule.kind === 'recurring' && (
            <span className="inline-flex items-center gap-1.5 rounded-2xl bg-primary-soft px-3 py-1.5 text-xs font-semibold text-accent">
              <Repeat size={13} />
              {/* IFCM FS-006 / C06a: Rhythmus mit Wochentag und Uhrzeit, z. B. „Wöchentlich, dienstags um 18:00 Uhr“ */}
              {describeRecurrence(plan)} · nächster Termin {formatDateKey(schedule.dateKey)}
              {plan.recurrenceEnd && ` · bis ${formatDateKey(plan.recurrenceEnd)}`}
            </span>
          )}
          {schedule.kind === 'ended' && (
            <span className="inline-flex items-center gap-1.5 rounded-2xl bg-surface-2 px-3 py-1.5 text-xs font-semibold text-muted">
              <Repeat size={13} />
              {RECURRENCE_LABELS[schedule.recurrence]} · Serie beendet
            </span>
          )}
          {plan.targetGroup && (
            <span className="inline-flex items-center gap-1.5 rounded-2xl bg-surface-2 px-3 py-1.5 text-xs font-semibold text-muted">
              <Users size={13} />
              {plan.targetGroup}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-2xl bg-primary-soft px-3 py-1.5 text-xs font-semibold text-accent">
            <Clock size={13} />
            {formatDuration(totalSeconds)} gesamt · {planExercises.length} Übungen
          </span>
        </div>
        {plan.description && <p className="text-sm text-muted">{plan.description}</p>}
      </div>

      {planExercises.length === 0 ? (
        <EmptyState
          icon={<Dumbbell size={28} />}
          title="Noch keine Übungen im Plan"
          description="Füge über 'Bearbeiten' Übungen aus deinem Pool hinzu."
          action={
            <PrimaryButton
              icon={<Pencil size={16} />}
              onClick={() => navigate(`/plaene/${plan.id}/bearbeiten`)}
            >
              Plan bearbeiten
            </PrimaryButton>
          }
        />
      ) : (
        <ol className="flex flex-col gap-3">
          {planExercises.map((exercise, index) => (
            <li
              key={exercise.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface p-4 sm:flex-nowrap"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft font-display text-sm font-bold text-accent">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{exercise.name}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <DifficultyBadge difficulty={exercise.difficulty} />
                  <span className="inline-flex items-center gap-1 text-xs text-muted-2">
                    <Clock size={13} /> {formatDuration(exercise.durationSeconds)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveExercise(exercise)}
                className="flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-primary-dark px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition hover:brightness-110"
              >
                <Play size={16} />
                Start
              </button>
            </li>
          ))}
        </ol>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Plan löschen?"
        description={`„${plan.name}“ wird unwiderruflich gelöscht.`}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          deletePlan(plan.id);
          navigate('/plaene');
        }}
      />

      {activeExercise && <Timer exercise={activeExercise} onClose={() => setActiveExercise(null)} />}
    </div>
  );
}
