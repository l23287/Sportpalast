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
const PADDING_Y = 20;
const GRID_VALUES = [0, 25, 50, 75, 100];
// Muss zur Tailwind-Klasse h-52 (13rem = 208px) auf SVG und Label-Spalte passen,
// damit die Prozent-Labels auf Höhe der SVG-Gridlines sitzen.
const RENDERED_HEIGHT_PX = 208;

function buildSmoothPath(coords: { x: number; y: number }[]): string {
  if (coords.length === 0) return '';
  if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

  let d = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i - 1] ?? coords[i];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function LineChart({ points }: LineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const innerWidth = WIDTH - PADDING_X * 2;
  const innerHeight = HEIGHT - PADDING_Y * 2;
  const maxIndex = Math.max(1, points.length - 1);
  const baseline = PADDING_Y + innerHeight;
  const labelPadding = (PADDING_Y / HEIGHT) * RENDERED_HEIGHT_PX;

  function toX(index: number) {
    return PADDING_X + (points.length <= 1 ? innerWidth / 2 : (index / maxIndex) * innerWidth);
  }
  function toY(value: number) {
    return PADDING_Y + innerHeight - (value / 100) * innerHeight;
  }

  const coords = points.map((point, index) => ({ x: toX(index), y: toY(point.y) }));
  const linePath = buildSmoothPath(coords);
  const areaPath =
    coords.length >= 2
      ? `${linePath} L ${coords[coords.length - 1].x} ${baseline} L ${coords[0].x} ${baseline} Z`
      : '';

  return (
    <div className="flex gap-3">
      <div
        className="flex h-52 shrink-0 flex-col justify-between text-right text-[11px] text-muted-2"
        style={{ paddingTop: labelPadding, paddingBottom: labelPadding }}
      >
        {[...GRID_VALUES].reverse().map((value) => (
          <span key={value}>{value}%</span>
        ))}
      </div>

      <div className="min-w-0 flex-1">
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

          <defs>
            <linearGradient id="serve-line-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
            <linearGradient id="serve-area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {areaPath && <path d={areaPath} fill="url(#serve-area-gradient)" stroke="none" />}

          <path
            d={linePath}
            fill="none"
            stroke="url(#serve-line-gradient)"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(56,189,248,0.35))' }}
          />

          {points.map((point, index) => (
            <circle
              key={point.x}
              cx={coords[index].x}
              cy={coords[index].y}
              r={hoveredIndex === index ? 7 : 4.5}
              fill={point.good ? 'var(--color-accent)' : 'var(--color-danger)'}
              stroke="var(--color-surface)"
              strokeWidth={2}
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
    </div>
  );
}
