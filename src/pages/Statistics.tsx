import { useMemo } from 'react';
import { BarChart3, ClipboardList, Clock, Dumbbell } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { StatTile } from '../components/StatTile';
import { DonutChart, type DonutSlice } from '../components/DonutChart';
import { EmptyState } from '../components/EmptyState';
import { computeAverageDuration, computeExerciseUsage } from '../lib/stats';
import { CATEGORICAL_PALETTE_DARK, CHART_OTHER_COLOR } from '../lib/chartPalette';
import { formatDuration } from '../lib/time';
import { SPORT_EMOJI } from '../lib/sport';
import { useSport } from '../context/SportContext';

const MAX_NAMED_SLICES = 5;

export function Statistics() {
  const { plans, exercises } = useAppData();
  const { sport } = useSport();

  const beginnerCount = exercises.filter((exercise) => exercise.difficulty === 'Anfänger').length;
  const advancedCount = exercises.filter((exercise) => exercise.difficulty === 'Fortgeschritten').length;

  const averageDuration = useMemo(() => computeAverageDuration(plans, exercises), [plans, exercises]);

  const usageData = useMemo(() => {
    const usage = computeExerciseUsage(plans, exercises);
    const named: DonutSlice[] = usage.slice(0, MAX_NAMED_SLICES).map((entry, index) => ({
      id: entry.exercise.id,
      label: entry.exercise.name,
      value: entry.count,
      color: CATEGORICAL_PALETTE_DARK[index],
    }));
    const rest = usage.slice(MAX_NAMED_SLICES);
    const restTotal = rest.reduce((sum, entry) => sum + entry.count, 0);
    if (restTotal > 0) {
      named.push({ id: '__other__', label: 'Andere', value: restTotal, color: CHART_OTHER_COLOR });
    }
    return named;
  }, [plans, exercises]);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-ink">Statistiken</h1>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile icon={<ClipboardList size={20} />} label="Trainingspläne" value={plans.length} />
        <StatTile icon={<Dumbbell size={20} />} label="Übungen" value={exercises.length} />
        <StatTile
          icon={<Clock size={20} />}
          label="Ø Trainingsdauer"
          value={plans.length === 0 ? '–' : formatDuration(averageDuration)}
        />
        <StatTile
          icon={<span className="text-lg leading-none">{SPORT_EMOJI[sport]}</span>}
          label="Sportart"
          value={sport}
        />
      </div>

      <DifficultyBreakdown beginner={beginnerCount} advanced={advancedCount} />

      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-bold text-ink">Meist genutzte Übungen</h2>
        {usageData.length === 0 ? (
          <EmptyState
            icon={<BarChart3 size={28} />}
            title="Noch keine Daten"
            description="Sobald Übungen in Trainingsplänen verwendet werden, siehst du hier die Verteilung."
          />
        ) : (
          <DonutChart data={usageData} totalLabel="Einsätze" />
        )}
      </div>
    </div>
  );
}

function DifficultyBreakdown({ beginner, advanced }: { beginner: number; advanced: number }) {
  const total = beginner + advanced;
  const beginnerPct = total === 0 ? 0 : (beginner / total) * 100;
  const advancedPct = total === 0 ? 0 : (advanced / total) * 100;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
      <h2 className="font-display text-lg font-bold text-ink">Übungen nach Schwierigkeitsgrad</h2>
      {total === 0 ? (
        <p className="text-sm text-muted-2">Noch keine Übungen angelegt.</p>
      ) : (
        <>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-bg-soft">
            <div className="h-full bg-muted-2" style={{ width: `${beginnerPct}%` }} />
            {beginner > 0 && advanced > 0 && <div className="h-full w-[3px] bg-bg-soft" />}
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-dark"
              style={{ width: `${advancedPct}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-2 text-muted">
              <span className="h-2.5 w-2.5 rounded-full bg-muted-2" /> Anfänger · {beginner}
            </span>
            <span className="inline-flex items-center gap-2 text-muted">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-primary to-primary-dark" />{' '}
              Fortgeschritten · {advanced}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
