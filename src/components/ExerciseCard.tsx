import { Clock, Dumbbell, Pencil, Target, Trash2 } from 'lucide-react';
import type { Exercise } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { IconButton } from './IconButton';
import { formatDuration } from '../lib/time';
import { getSportEmoji } from '../lib/sports';

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: () => void;
  onDelete: () => void;
}

export function ExerciseCard({ exercise, onEdit, onDelete }: ExerciseCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-dark text-[#04263f]">
          <Dumbbell size={20} />
        </div>
        <DifficultyBadge difficulty={exercise.difficulty} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 font-display text-lg font-bold text-ink">{exercise.name}</h3>
        {exercise.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted">{exercise.description}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-2">
        {exercise.goal && (
          <span className="inline-flex items-center gap-1">
            <Target size={13} /> {exercise.goal}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Clock size={13} /> {formatDuration(exercise.durationMinutes)}
        </span>
        <span className="inline-flex items-center gap-1">
          {getSportEmoji(exercise.sport)} {exercise.sport}
        </span>
      </div>

      <div className="mt-1 flex gap-2">
        <IconButton icon={<Pencil size={16} />} label="Übung bearbeiten" onClick={onEdit} />
        <IconButton icon={<Trash2 size={16} />} label="Übung löschen" onClick={onDelete} />
      </div>
    </div>
  );
}
