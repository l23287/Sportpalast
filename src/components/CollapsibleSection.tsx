// IFCM FS-014 / C09a: aufklappbarer Bereich für die Einstellungen.
// Die Bereiche „Deine Ziele“ und „Sportart“ sind standardmäßig eingeklappt und zeigen nur eine Kopfzeile mit
// Kurzinfo (z. B. „2/3 offen“, „⚽ Fußball“). So nimmt kein Bereich den ganzen Bildschirm ein.
// Technik: kontrollierter Zustand statt <details>, damit der Bereich auch von außen geöffnet werden kann
// (Link „/einstellungen#ziele“ aus der Planübersicht) und die Pfeil-Animation zuverlässig ist.
import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  id?: string; // Sprungziel (z. B. „ziele“)
  title: string;
  icon?: ReactNode;
  summary?: ReactNode; // Kurzinfo in der Kopfzeile, auch im eingeklappten Zustand sichtbar
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({ id, title, icon, summary, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <section id={id} className="scroll-mt-4 rounded-3xl border border-border bg-surface">
      <h2>
        {/* Die ganze Kopfzeile ist ein Button: groß genug zum Tippen, mit aria-expanded für Screenreader */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls={contentId}
          className="flex w-full items-center gap-3 rounded-3xl p-5 text-left transition hover:bg-surface-2/40"
        >
          {icon && <span className="shrink-0 text-sport">{icon}</span>}
          <span className="min-w-0 flex-1">
            <span className="block font-display text-lg font-bold text-ink">{title}</span>
            {summary && <span className="block truncate text-xs text-muted-2">{summary}</span>}
          </span>
          <ChevronDown
            size={20}
            className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </h2>
      {/* hidden statt Entfernen: Eingaben im Formular bleiben beim Zu- und Aufklappen erhalten */}
      <div id={contentId} hidden={!open} className="flex flex-col gap-4 px-5 pb-5">
        {children}
      </div>
    </section>
  );
}
