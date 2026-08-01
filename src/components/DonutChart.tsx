import { useState } from 'react';

export interface DonutSlice {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  totalLabel?: string;
}

const SIZE = 200;
const RADIUS = 80;
const STROKE_WIDTH = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3;

export function DonutChart({ data, totalLabel = 'Einsätze' }: DonutChartProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  let cumulative = 0;
  const segments = data.map((slice) => {
    const rawLength = total === 0 ? 0 : (slice.value / total) * CIRCUMFERENCE;
    const length = Math.max(rawLength - GAP, 0);
    const offset = -cumulative;
    cumulative += rawLength;
    const percentage = total === 0 ? 0 : Math.round((slice.value / total) * 100);
    return { ...slice, length, offset, percentage };
  });

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
      <div className="relative h-52 w-52 shrink-0">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full -rotate-90" aria-hidden="true">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-surface-2)"
            strokeWidth={STROKE_WIDTH}
          />
          {segments.map((segment) => (
            <circle
              key={segment.id}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={segment.color}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
              strokeDashoffset={segment.offset}
              strokeLinecap="butt"
              opacity={hoveredId && hoveredId !== segment.id ? 0.4 : 1}
              style={{ transition: 'opacity 0.15s ease', cursor: 'pointer' }}
              onMouseEnter={() => setHoveredId(segment.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <title>
                {segment.label}: {segment.value}× ({segment.percentage}%)
              </title>
            </circle>
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-extrabold text-ink">{total}</span>
          <span className="text-xs text-muted-2">{totalLabel}</span>
        </div>
      </div>

      <ul className="flex w-full flex-col gap-1 sm:max-w-xs">
        {segments.map((segment) => (
          <li
            key={segment.id}
            onMouseEnter={() => setHoveredId(segment.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`flex items-center gap-3 rounded-2xl px-3 py-2 transition ${
              hoveredId === segment.id ? 'bg-surface-2' : ''
            }`}
          >
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate text-sm text-ink">{segment.label}</span>
            <span className="shrink-0 text-xs text-muted-2">
              {segment.value}× · {segment.percentage}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
