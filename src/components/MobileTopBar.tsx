import { SPORT_EMOJI } from '../lib/sport';
import { useSport } from '../context/SportContext';
import { TrainerProMark } from './Logo';

export function MobileTopBar() {
  const { sport } = useSport();

  return (
    <header className="flex items-center gap-3 px-4 pt-4 pb-2 md:hidden">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white">
        <TrainerProMark mono className="h-5 w-auto" />
      </div>
      <p className="font-display text-base font-extrabold leading-none text-ink">TrainerPro</p>
      <div className="ml-auto flex items-center gap-1.5 rounded-2xl border border-border bg-surface px-3 py-1.5 text-xs text-muted">
        <span>{SPORT_EMOJI[sport]}</span>
        <span className="max-w-[7rem] truncate">{sport}</span>
      </div>
    </header>
  );
}
