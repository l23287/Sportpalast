import { NavLink } from 'react-router-dom';
import { Target } from 'lucide-react';
import { NAV_ITEMS } from '../lib/nav';
import { SPORT_EMOJI, SPORT_NAME } from '../lib/sport';

export function Sidebar() {
  return (
    <aside className="hidden shrink-0 py-6 pl-6 md:block md:w-64 lg:w-72">
      <div className="sticky top-6 flex h-[calc(100dvh-3rem)] flex-col gap-8 rounded-3xl border border-border bg-surface p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)]">
            <Target size={22} />
          </div>
          <div className="min-w-0">
            <p className="font-display text-lg font-extrabold leading-none text-ink">TrainerPro</p>
            <p className="mt-1.5 truncate text-xs text-muted-2">
              {SPORT_EMOJI} {SPORT_NAME}
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex h-12 items-center gap-3 rounded-2xl px-4 font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)]'
                    : 'text-muted hover:bg-surface-2 hover:text-ink'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <p className="text-xs text-muted-2">TrainerPro · Trainingsplanung</p>
      </div>
    </aside>
  );
}
