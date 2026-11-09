import { Clock, Dumbbell, Layers, Pencil, Repeat2, StickyNote, Target, Timer, Trash2 } from 'lucide-react';
import type { Exercise } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { IconButton } from './IconButton';
import { formatDuration } from '../lib/time';
import { formatOf } from '../lib/strength'; // IFCM FS-017 / C11
import { WeightStepper } from './WeightStepper'; // IFCM FS-017 / C11

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

      {/* IFCM FS-010 / C08: vorhandene Notiz als Erinnerung auf der Karte anzeigen (gekürzt) */}
      {exercise.note && (
        <p className="flex items-start gap-1.5 rounded-2xl bg-primary-soft px-3 py-2 text-xs text-ink">
          <StickyNote size={13} className="mt-0.5 shrink-0 text-primary" />
          <span className="line-clamp-2 break-words">{exercise.note}</span>
        </p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-2">
        {exercise.goal && (
          <span className="inline-flex items-center gap-1">
            <Target size={13} /> {exercise.goal}
          </span>
        )}
        {/* IFCM FS-017 / C11: Satz-Übung zeigt Sätze × Wdh. und Satzpause, Dauer-Übung wie bisher die Dauer */}
        {formatOf(exercise) === 'sets' ? (
          <>
            <span className="inline-flex items-center gap-1">
              <Repeat2 size={13} /> {exercise.sets} × {exercise.reps}
            </span>
            <span className="inline-flex items-center gap-1">
              <Timer size={13} /> {exercise.restSeconds ?? 0} Sek. Pause
            </span>
          </>
        ) : (
          <span className="inline-flex items-center gap-1">
            <Clock size={13} /> {formatDuration(exercise.durationSeconds) /* IFCM FS-009 / C07 */}
          </span>
        )}
        {exercise.muscleGroup && (
          <span className="inline-flex items-center gap-1">
            <Layers size={13} /> {exercise.muscleGroup}
          </span>
        )}
      </div>

      {/* IFCM FS-017 / C11: Gewicht direkt auf der Karte anpassen */}
      {formatOf(exercise) === 'sets' && <WeightStepper exercise={exercise} />}

      <div className="mt-1 flex gap-2">
        <IconButton icon={<Pencil size={16} />} label="Übung bearbeiten" onClick={onEdit} />
        <IconButton icon={<Trash2 size={16} />} label="Übung löschen" onClick={onDelete} />
      </div>
    </div>
  );
}
