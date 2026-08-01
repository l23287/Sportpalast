import type { Difficulty } from '../types';

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const isAdvanced = difficulty === 'Fortgeschritten';
  return (
    <span
      className={`inline-flex items-center rounded-2xl px-3 py-1 text-xs font-semibold whitespace-nowrap ${
        isAdvanced ? 'bg-primary-soft text-accent' : 'bg-surface-2 text-muted'
      }`}
    >
      {difficulty}
    </span>
  );
}
