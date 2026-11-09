// IFCM FS-022 / C12 Streak: positive Anzeige der Serie in der Planübersicht – ohne Druck:
// ist heute noch nichts passiert, heißt es „heute noch offen“ statt „Serie verloren“.
import { Flame, Trophy } from 'lucide-react';
import { useStreak } from '../context/StreakContext';

export function StreakBadge() {
  const { enabled, current, longest, activeToday } = useStreak();
  if (!enabled) return null;

  return (
    <section
      aria-label="Streak"
      className="flex items-center gap-3 rounded-3xl border border-border bg-surface px-4 py-3"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
          current > 0 ? 'bg-gradient-to-br from-[#fb923c] to-[#f97316] text-[#0a0f1c]' : 'bg-surface-2 text-muted'
        }`}
      >
        <Flame size={22} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        {current > 0 ? (
          <p className="font-display text-lg font-bold text-ink">
            {current} {current === 1 ? 'Tag' : 'Tage'} in Folge
          </p>
        ) : (
          <p className="font-display text-lg font-bold text-ink">Starte deine Serie</p>
        )}
        <p className="text-xs text-muted">
          {current === 0
            ? 'Lass eine Übung komplett durchlaufen oder lege eine neue Übung an.'
            : activeToday
              ? 'Heute geschafft ✓'
              : 'Heute noch offen – eine Übung genügt.'}
        </p>
      </div>
      {longest > 0 && (
        <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-muted" title="Längste Serie">
          <Trophy size={14} aria-hidden="true" /> Rekord {longest}
        </span>
      )}
    </section>
  );
}
