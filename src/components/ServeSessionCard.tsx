import { Crosshair, Ruler, Trash2 } from 'lucide-react';
import type { ServeSession } from '../types';
import { computeServeSessionSummary } from '../lib/serveStats';
import { formatDateTime } from '../lib/time';
import { IconButton } from './IconButton';

interface ServeSessionCardProps {
  session: ServeSession;
  onView: () => void;
  onDelete: () => void;
}

export function ServeSessionCard({ session, onView, onDelete }: ServeSessionCardProps) {
  const { total, good, successRate } = computeServeSessionSummary(session);

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_8px_18px_rgba(37,99,235,0.3)]">
          <Crosshair size={20} />
        </div>
        <span className="text-xs text-muted-2">{formatDateTime(session.startedAt)}</span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-2">
        <span className="inline-flex items-center gap-1">
          <Ruler size={13} /> {session.length}
        </span>
        <span className="inline-flex items-center gap-1">
          <Crosshair size={13} /> {session.placement}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {total} Aufschläge · {good} gut
        </p>
        <p className="font-display text-xl font-extrabold text-ink">{successRate}%</p>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={onView}
          className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-sm font-semibold text-white transition hover:brightness-110"
        >
          Ergebnis ansehen
        </button>
        <IconButton icon={<Trash2 size={16} />} label="Session löschen" onClick={onDelete} />
      </div>
    </div>
  );
}
