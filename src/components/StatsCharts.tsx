// IFCM FS-023 / C14 Erweiterung der Statistik: schlanke Diagramm-Bausteine ohne Bibliothek.
// Gestaltungsregeln (Skill „dataviz“): je Diagramm EINE Farbe (Sportfarbe aus C03, kontrastgeprüft) statt bunter
// Paletten, schmale Balken mit 4-px-Rundung an der Datenseite und 2-px-Abstand, Hover/Fokus-Tooltip, Werte und
// Beschriftungen in Textfarbe, zusätzlich eine Tabelle für Screenreader.
import { useState } from 'react';
import type { GridDay, WeekTotal } from '../lib/statsExtra';
import { isoWeek } from '../lib/statsExtra';
import { formatDuration } from '../lib/time';

/** Trainingszeit pro Woche als Säulen (älteste links, aktuelle Woche rechts). */
export function WeeklyBars({ weeks }: { weeks: WeekTotal[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...weeks.map((w) => w.seconds), 1);
  const shown = active ?? weeks.length - 1; // ohne Hover: aktuelle Woche hervorheben

  return (
    <div className="flex flex-col gap-3">
      {/* Kopfzeile = Tooltip-Ersatz: zeigt die angetippte/überfahrene Woche (sonst die aktuelle) */}
      <p className="text-sm text-muted" aria-live="polite">
        <span className="font-semibold text-ink">
          KW {isoWeek(weeks[shown].weekStart)}
          {shown === weeks.length - 1 ? ' (diese Woche)' : ''}:
        </span>{' '}
        {formatDuration(weeks[shown].seconds)} · {weeks[shown].count}{' '}
        {weeks[shown].count === 1 ? 'Übung' : 'Übungen'}
      </p>
      <div className="flex h-36 items-end gap-[2px] border-b border-border" aria-hidden="true">
        {weeks.map((week, index) => (
          <button
            key={week.weekStart}
            type="button"
            tabIndex={-1}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
            onClick={() => setActive(index)}
            className="group flex h-full flex-1 items-end justify-center"
          >
            <span
              className={`w-full max-w-10 rounded-t-[4px] transition ${index === shown ? 'bg-sport' : 'bg-sport/45 group-hover:bg-sport/70'}`}
              // mind. 2 px, damit eine Woche mit 0 als dünne Linie sichtbar bleibt
              style={{ height: `${Math.max(2, (week.seconds / max) * 100)}%` }}
            />
          </button>
        ))}
      </div>
      <div className="flex gap-[2px] text-center text-[11px] text-muted-2" aria-hidden="true">
        {weeks.map((week) => (
          <span key={week.weekStart} className="flex-1">
            KW {isoWeek(week.weekStart)}
          </span>
        ))}
      </div>
      {/* Tabellenansicht für Screenreader */}
      <table className="sr-only">
        <caption>Trainingszeit pro Woche</caption>
        <thead>
          <tr>
            <th>Woche</th>
            <th>Trainingszeit</th>
            <th>Übungen</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week.weekStart}>
              <td>KW {isoWeek(week.weekStart)}</td>
              <td>{formatDuration(week.seconds)}</td>
              <td>{week.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

/** Aktivitäts-Raster: Spalten = Wochen, Zeilen = Wochentage; gefüllt = aktiver Tag (alle Sportarten). */
export function ActivityGrid({ grid }: { grid: GridDay[][] }) {
  const activeCount = grid.flat().filter((d) => d.active).length;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2" role="img" aria-label={`${activeCount} aktive Tage in den letzten ${grid.length} Wochen`}>
        <div className="flex flex-col gap-[3px] text-[10px] leading-4 text-muted-2" aria-hidden="true">
          {WEEKDAYS.map((day, i) => (
            <span key={day} className="h-4">{i % 2 === 0 ? day : ''}</span>
          ))}
        </div>
        <div className="flex flex-1 justify-between gap-[3px]">
          {grid.map((week) => (
            <div key={week[0].key} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <span
                  key={day.key}
                  title={`${new Date(day.key + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })}: ${day.future ? '–' : day.active ? 'aktiv' : 'keine Aktivität'}`}
                  className={`h-4 w-4 rounded-[4px] ${
                    day.future ? 'border border-dashed border-border' : day.active ? 'bg-sport' : 'bg-surface-2'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-sport" /> aktiv</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-surface-2" /> kein Training</span>
      </div>
    </div>
  );
}

/** Waagerechte Balkenliste (z. B. Muskelgruppen): Beschriftung + Anzahl als Text, Balken nur zur Orientierung. */
export function BarList({ items, label }: { items: { key: string; count: number }[]; label: string }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <ul className="flex flex-col gap-2" aria-label={label}>
      {items.map((item) => (
        <li key={item.key} className="grid grid-cols-[minmax(0,7rem)_1fr_auto] items-center gap-3 text-sm">
          <span className="truncate text-muted">{item.key}</span>
          <span className="h-2.5 rounded-r-[4px] bg-sport" style={{ width: `${(item.count / max) * 100}%` }} aria-hidden="true" />
          <span className="font-semibold tabular-nums text-ink">{item.count}</span>
        </li>
      ))}
    </ul>
  );
}
