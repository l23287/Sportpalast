import { BarChart3, CalendarDays, ClipboardList, Dumbbell, Settings, Timer } from 'lucide-react';
import { stopwatchLabelsFor } from './stopwatch'; // IFCM FS-020 / C13a
import type { ComponentType } from 'react';

export interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  // IFCM FS-020 / C13a: optionale Beschriftung abhängig von der Sportart (z. B. „Zeitmessung“ bei Schwimmen)
  labelFor?: (sport: string) => string;
}

/** IFCM FS-020 / C13a: Beschriftung eines Menüpunkts für die aktuelle Sportart. */
export function navLabel(item: NavItem, sport: string): string {
  return item.labelFor ? item.labelFor(sport) : item.label;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/plaene', label: 'Trainingspläne', icon: ClipboardList },
  { to: '/uebungen', label: 'Übungen', icon: Dumbbell },
  { to: '/statistiken', label: 'Statistiken', icon: BarChart3 },
  // IFCM FS-003 / C04: Aufschlagtraining ist kein eigener Navigationspunkt mehr. Es liegt bei Tischtennis als
  // Reiter im Übungsbereich (/uebungen/aufschlagtraining).
  // IFCM FS-004 / C05: Auf den frei gewordenen Platz kommt der Kalender.
  { to: '/kalender', label: 'Kalender', icon: CalendarDays },
  // IFCM FS-020 / C13a: Stoppuhr als eigener Menüpunkt für alle Sportarten (wie früher das Aufschlagtraining),
  // Name je Sportart – Voreinstellung „Stoppuhr“, z. B. „Zeitmessung“ bei Schwimmen und Leichtathletik
  { to: '/stoppuhr', label: 'Stoppuhr', icon: Timer, labelFor: (sport) => stopwatchLabelsFor(sport).menu },
  { to: '/einstellungen', label: 'Einstellungen', icon: Settings },
];
