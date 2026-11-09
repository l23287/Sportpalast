// IFCM FS-017 / C11: Gewicht schnell anpassen („der Muskel wächst“) – direkt auf der Übungskarte und im Timer,
// ohne das Bearbeiten-Formular zu öffnen. Ein Tipp ändert das Vorgabe-Gewicht um ±2,5 kg und speichert sofort.
import { Minus, Plus } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { MAX_WEIGHT_KG, WEIGHT_STEP_KG, formatWeight, stepWeight } from '../lib/strength';
import type { Exercise } from '../types';

export function WeightStepper({ exercise, size = 'sm' }: { exercise: Exercise; size?: 'sm' | 'lg' }) {
  const { updateExerciseWeight } = useAppData();
  const weight = exercise.weightKg ?? 0;
  const button = size === 'lg' ? 'h-11 w-11' : 'h-8 w-8';

  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={`Gewicht für ${exercise.name}`}>
      <button
        type="button"
        onClick={() => updateExerciseWeight(exercise.id, stepWeight(weight, -1))}
        disabled={weight <= 0}
        aria-label={`Gewicht um ${formatWeight(WEIGHT_STEP_KG)} verringern`}
        className={`flex ${button} items-center justify-center rounded-full border border-border bg-bg-soft text-ink transition hover:border-primary disabled:opacity-30`}
      >
        <Minus size={size === 'lg' ? 18 : 14} />
      </button>
      {/* aria-live: Screenreader sagen das neue Gewicht nach jedem Tipp an */}
      <span
        aria-live="polite"
        className={`min-w-16 text-center font-semibold tabular-nums text-ink ${size === 'lg' ? 'text-lg' : 'text-sm'}`}
      >
        {weight > 0 ? formatWeight(weight) : 'ohne Gewicht'}
      </span>
      <button
        type="button"
        onClick={() => updateExerciseWeight(exercise.id, stepWeight(weight, 1))}
        disabled={weight >= MAX_WEIGHT_KG}
        aria-label={`Gewicht um ${formatWeight(WEIGHT_STEP_KG)} erhöhen`}
        className={`flex ${button} items-center justify-center rounded-full border border-border bg-bg-soft text-ink transition hover:border-primary disabled:opacity-30`}
      >
        <Plus size={size === 'lg' ? 18 : 14} />
      </button>
    </div>
  );
}
