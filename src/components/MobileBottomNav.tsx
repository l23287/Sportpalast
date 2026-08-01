import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../lib/nav';

export function MobileBottomNav() {
  return (
    <nav
      className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-around rounded-[28px] border border-border bg-surface/95 px-2 py-2 backdrop-blur md:hidden"
      aria-label="Hauptnavigation"
    >
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} aria-label={item.label} title={item.label} className="flex flex-1 items-center justify-center py-1">
          {({ isActive }) => (
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
                isActive ? 'bg-primary-soft text-primary' : 'text-muted-2'
              }`}
            >
              <item.icon size={22} />
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
