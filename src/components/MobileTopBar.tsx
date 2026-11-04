import { useSport } from '../context/SportContext';
import { TrainerProMark } from './Logo';

export function MobileTopBar() {
  const { sport, emoji } = useSport(); // IFCM FS-012 / C03: Symbol aus dem Context (inkl. eigener Sportarten)

  return (
    <header className="flex items-center gap-3 px-4 pt-4 pb-2 md:hidden">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white">
        <TrainerProMark mono className="h-5 w-auto" />
      </div>
      <p className="font-display text-base font-extrabold leading-none text-ink">TrainerPro</p>
      {/* IFCM FS-012 / C03: Sportart-Abzeichen mit Rahmen in der Sportfarbe */}
      <div className="ml-auto flex items-center gap-1.5 rounded-2xl border border-sport/50 bg-sport/10 px-3 py-1.5 text-xs text-ink">
        <span>{emoji}</span>
        <span className="max-w-[7rem] truncate">{sport}</span>
      </div>
    </header>
  );
}
