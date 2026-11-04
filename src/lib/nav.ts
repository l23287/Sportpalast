import { BarChart3, CalendarDays, ClipboardList, Dumbbell, Settings } from 'lucide-react';
import type { ComponentType } from 'react';

export interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/plaene', label: 'Trainingspläne', icon: ClipboardList },
  { to: '/uebungen', label: 'Übungen', icon: Dumbbell },
  { to: '/statistiken', label: 'Statistiken', icon: BarChart3 },
  // IFCM FS-003 / C04: Aufschlagtraining ist kein eigener Navigationspunkt mehr. Es liegt bei Tischtennis als
  // Reiter im Übungsbereich (/uebungen/aufschlagtraining).
  // IFCM FS-004 / C05: Auf den frei gewordenen Platz kommt der Kalender.
  { to: '/kalender', label: 'Kalender', icon: CalendarDays },
  { to: '/einstellungen', label: 'Einstellungen', icon: Settings },
];
