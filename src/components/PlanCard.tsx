import { Link } from 'react-router-dom';
import { Calendar, ClipboardList, Clock, ListChecks, Pencil, Repeat, Trash2, Users } from 'lucide-react';
import type { Exercise, TrainingPlan } from '../types';
import { formatDuration } from '../lib/time';
// IFCM FS-005 / C06: Termin und „überfällig“ kommen aus der zentralen Logik für (wiederkehrende) Pläne
import { RECURRENCE_LABELS, formatDateKey, getPlanSchedule } from '../lib/recurrence';
import { toDateKey } from '../lib/calendar';
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
  // IFCM FS-005 / C06: Nur einmalige Pläne können überfällig sein; wiederkehrende zeigen den nächsten Termin.
  const schedule = getPlanSchedule(plan, toDateKey(new Date()));
  const overdue = schedule.kind === 'once' && schedule.overdue;

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
        {/* IFCM FS-005 / C06: einmalig = Datum (rot wenn überfällig); wiederkehrend = Wiederhol-Symbol + nächster Termin */}
        {schedule.kind === 'once' && (
          <span
            className={`inline-flex items-center gap-1 rounded-2xl px-3 py-1 text-xs font-semibold whitespace-nowrap ${
              overdue ? 'bg-danger/15 text-danger' : 'bg-surface-2 text-muted'
            }`}
          >
            <Calendar size={12} />
            {formatDateKey(schedule.dateKey)}
          </span>
        )}
        {schedule.kind === 'recurring' && (
          <span
            className="inline-flex items-center gap-1 rounded-2xl bg-primary-soft px-3 py-1 text-xs font-semibold whitespace-nowrap text-accent"
            title={`${RECURRENCE_LABELS[schedule.recurrence]} – nächster Termin`}
          >
            <Repeat size={12} />
            {formatDateKey(schedule.dateKey)}
          </span>
        )}
        {schedule.kind === 'ended' && (
          <span className="inline-flex items-center gap-1 rounded-2xl bg-surface-2 px-3 py-1 text-xs font-semibold whitespace-nowrap text-muted">
            <Repeat size={12} />
            Serie beendet
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
