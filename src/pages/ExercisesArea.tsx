// IFCM FS-003 / C04 Aufschlagtraining nur bei Tischtennis: neuer Rahmen für den Übungsbereich.
// Bei Tischtennis zeigt er oben die Reiter „Übungen“ | „Stoppuhr“ | „Aufschlagtraining“, bei allen anderen Sportarten
// „Übungen“ | „Stoppuhr“ (IFCM FS-019 / C13). Die eigentlichen Seiten (Exercises, ServeTraining) bleiben unverändert.
import type { ReactNode } from 'react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { Crosshair, Dumbbell, Timer } from 'lucide-react';
import { useSport } from '../context/SportContext';
import { hasServeTraining } from '../lib/sport';

// IFCM FS-019 / C13: Reiter „Stoppuhr“ für ALLE Sportarten; „Aufschlagtraining“ weiterhin nur bei Tischtennis (C04)
const TABS = [
  { to: '/uebungen', label: 'Übungen', icon: Dumbbell, end: true, serveOnly: false },
  { to: '/uebungen/stoppuhr', label: 'Stoppuhr', icon: Timer, end: false, serveOnly: false },
  { to: '/uebungen/aufschlagtraining', label: 'Aufschlagtraining', icon: Crosshair, end: false, serveOnly: true },
];

export function ExercisesArea() {
  const { sport } = useSport();

  return (
    <div className="flex flex-col gap-6">
      {/* IFCM FS-019 / C13: Reiterleiste jetzt immer sichtbar (mind. „Übungen“ und „Stoppuhr“) */}
      <nav aria-label="Bereiche im Übungsbereich" className="flex flex-wrap gap-2">
          {TABS.filter((tab) => !tab.serveOnly || hasServeTraining(sport)).map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                // gleiche Optik wie die bestehenden Auswahl-Buttons (PillSelect) – Design bleibt erhalten
                `inline-flex h-11 items-center gap-2 rounded-2xl border px-5 text-sm font-semibold transition ${
                  isActive
                    ? 'border-transparent bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_8px_18px_rgba(37,99,235,0.3)]'
                    : 'border-border bg-bg-soft text-muted hover:text-ink'
                }`
              }
            >
              <tab.icon size={16} />
              {tab.label}
            </NavLink>
          ))}
        </nav>
      <Outlet />
    </div>
  );
}

// IFCM FS-003 / C04: Schutz für die Aufschlag-Seite. Bei Sportarten ohne Aufschlagtraining führt auch die
// direkte Adresse zurück zu den Übungen.
export function ServeTrainingGuard({ children }: { children: ReactNode }) {
  const { sport } = useSport();
  if (!hasServeTraining(sport)) return <Navigate to="/uebungen" replace />;
  return <>{children}</>;
}
