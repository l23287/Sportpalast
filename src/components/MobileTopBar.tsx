import { Target } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { getSportEmoji } from '../lib/sports';

export function MobileTopBar() {
  const { settings } = useAppData();

  return (
    <header className="flex items-center gap-3 px-4 pt-4 pb-2 md:hidden">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white">
        <Target size={18} />
      </div>
      <p className="font-display text-base font-extrabold leading-none text-ink">TrainerPro</p>
      <div className="ml-auto flex items-center gap-1.5 rounded-2xl border border-border bg-surface px-3 py-1.5 text-xs text-muted">
        <span>{getSportEmoji(settings.sport)}</span>
        <span className="max-w-[7rem] truncate">{settings.sport}</span>
      </div>
    </header>
  );
}
