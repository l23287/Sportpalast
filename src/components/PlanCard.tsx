import { Link } from 'react-router-dom';
import { Calendar, ClipboardList, Clock, ListChecks, Pencil, Trash2, Users } from 'lucide-react';
import type { Exercise, TrainingPlan } from '../types';
import { formatDate, formatDuration, isOverdue } from '../lib/time';
import { IconButton } from './IconButton';

interface PlanCardProps {
  plan: TrainingPlan;
  exercises: Exercise[];
  onEdit: () => void;
  onDelete: () => void;
}

export function PlanCard({ plan, exercises, onEdit, onDelete }: PlanCardProps) {
  const planExercises = plan.exerciseIds
    .map((exerciseId) => exercises.find((e) => e.id === exerciseId))
    .filter((e): e is Exercise => Boolean(e));
  const totalMinutes = planExercises.reduce((sum, e) => sum + e.durationMinutes, 0);
  const overdue = isOverdue(plan.date);

  return (
    <div
      className={`flex flex-col gap-4 rounded-3xl border bg-surface p-5 ${
        overdue ? 'border-danger/50' : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_8px_18px_rgba(37,99,235,0.3)]">
          <ClipboardList size={22} />
        </div>
        {plan.date && (
          <span
            className={`inline-flex items-center gap-1 rounded-2xl px-3 py-1 text-xs font-semibold whitespace-nowrap ${
              overdue ? 'bg-danger/15 text-danger' : 'bg-surface-2 text-muted'
            }`}
          >
            <Calendar size={12} />
            {formatDate(plan.date)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 font-display text-lg font-bold text-ink">{plan.name}</h3>
        {plan.description && <p className="mt-1 line-clamp-2 text-sm text-muted">{plan.description}</p>}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-2">
        <span className="inline-flex items-center gap-1">
          <ListChecks size={14} /> {planExercises.length} Übungen
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock size={14} /> {formatDuration(totalMinutes)}
        </span>
        {plan.targetGroup && (
          <span className="inline-flex items-center gap-1">
            <Users size={14} /> {plan.targetGroup}
          </span>
        )}
      </div>

      {overdue && <p className="text-xs font-semibold text-danger">Überfällig</p>}

      <div className="mt-1 flex items-center gap-2">
        <Link
          to={`/plaene/${plan.id}`}
          className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-sm font-semibold text-white transition hover:brightness-110"
        >
          Anzeigen
        </Link>
        <IconButton icon={<Pencil size={16} />} label="Plan bearbeiten" onClick={onEdit} />
        <IconButton icon={<Trash2 size={16} />} label="Plan löschen" onClick={onDelete} />
      </div>
    </div>
  );
}
