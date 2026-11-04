// IFCM FS-011 / C08a: Notiz einer Übung, die immer sichtbar ist. Lange Notizen werden zunächst gekürzt
// (2 Zeilen) und lassen sich per „Mehr anzeigen“ aus- bzw. per „Weniger“ wieder einklappen.
import { useState } from 'react';
import { StickyNote } from 'lucide-react';

// Ab dieser Länge (Zeichen) oder bei mehreren Zeilen gilt eine Notiz als „lang“ und wird zuerst gekürzt.
// Zeichengrenze statt Messung der tatsächlichen Höhe: einfach, ohne Layout-Berechnung, auf allen Geräten gleich.
const LONG_NOTE_CHARS = 80;

export function ExpandableNote({ note }: { note: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = note.length > LONG_NOTE_CHARS || note.includes('\n');

  return (
    <div className="flex items-start gap-1.5 rounded-xl bg-primary-soft px-2.5 py-1.5 text-xs text-ink">
      <StickyNote size={12} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <span className="sr-only">Notiz: </span>
        <p className={`whitespace-pre-line break-words ${isLong && !expanded ? 'line-clamp-2' : ''}`}>{note}</p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="mt-0.5 font-semibold text-primary hover:underline"
          >
            {expanded ? 'Weniger' : 'Mehr anzeigen'}
          </button>
        )}
      </div>
    </div>
  );
}
