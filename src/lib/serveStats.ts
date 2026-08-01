import type { ServeAttempt, ServeSession } from '../types';
import type { LineChartPoint } from '../components/LineChart';

export function computeServeProgress(attempts: ServeAttempt[]): LineChartPoint[] {
  let goodCount = 0;
  return attempts.map((attempt, index) => {
    if (attempt.result === 'gut') goodCount += 1;
    return { x: index + 1, y: (goodCount / (index + 1)) * 100, good: attempt.result === 'gut' };
  });
}

export interface ServeSessionSummary {
  total: number;
  good: number;
  bad: number;
  successRate: number;
}

export function computeServeSessionSummary(session: ServeSession): ServeSessionSummary {
  const total = session.attempts.length;
  const good = session.attempts.filter((attempt) => attempt.result === 'gut').length;
  const bad = total - good;
  const successRate = total === 0 ? 0 : Math.round((good / total) * 100);
  return { total, good, bad, successRate };
}
