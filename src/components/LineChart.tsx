import { useState } from 'react';

export interface LineChartPoint {
  x: number;
  y: number;
  good: boolean;
}

interface LineChartProps {
  points: LineChartPoint[];
}

const WIDTH = 600;
const HEIGHT = 220;
const PADDING_X = 16;
const PADDING_Y = 16;
const GRID_VALUES = [0, 25, 50, 75, 100];

export function LineChart({ points }: LineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const innerWidth = WIDTH - PADDING_X * 2;
  const innerHeight = HEIGHT - PADDING_Y * 2;
  const maxIndex = Math.max(1, points.length - 1);

  function toX(index: number) {
    return PADDING_X + (points.length <= 1 ? innerWidth / 2 : (index / maxIndex) * innerWidth);
  }
  function toY(value: number) {
    return PADDING_Y + innerHeight - (value / 100) * innerHeight;
  }

  const pathD = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${toX(index)} ${toY(point.y)}`).join(' ');

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-52 w-full" preserveAspectRatio="none" aria-hidden="true">
        {GRID_VALUES.map((value) => (
          <line
            key={value}
            x1={PADDING_X}
            x2={WIDTH - PADDING_X}
            y1={toY(value)}
            y2={toY(value)}
            stroke="var(--color-border)"
            strokeWidth={1}
            strokeDasharray={value === 0 ? undefined : '4 4'}
          />
        ))}
        <path
          d={pathD}
          fill="none"
          stroke="url(#serve-line-gradient)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="serve-line-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
        {points.map((point, index) => (
          <circle
            key={point.x}
            cx={toX(index)}
            cy={toY(point.y)}
            r={hoveredIndex === index ? 6 : 4}
            fill={point.good ? 'var(--color-accent)' : 'var(--color-danger)'}
            stroke="var(--color-surface)"
            strokeWidth={1.5}
            style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <title>
              Aufschlag {point.x}: {point.good ? 'Gut' : 'Schlecht'} · {Math.round(point.y)}% Quote
            </title>
          </circle>
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-muted-2">
        <span>Aufschlag 1</span>
        <span>Aufschlag {points.length}</span>
      </div>
    </div>
  );
}
