// IFCM FS-004 / C05 Kalendertool: neue Seite mit Monatsansicht der Trainingspläne.
// Zeigt nur Pläne der aktuell gewählten Sportart (die Filterung übernimmt der AppDataContext aus C01).
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronLeft, ChevronRight, ClipboardList, Plus, Repeat } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { IconButton } from '../components/IconButton';
import { PrimaryButton } from '../components/PrimaryButton';
import {
  WEEKDAY_LABELS,
  buildMonthGrid,
  formatLongDate,
  formatMonthTitle,
  plansByDay,
  toDateKey,
} from '../lib/calendar';
import { RECURRENCE_LABELS, isRecurring } from '../lib/recurrence'; // IFCM FS-005 / C06

export function CalendarPage() {
  const { plans } = useAppData();
  const navigate = useNavigate();

  const todayKey = toDateKey(new Date());
  // Angezeigter Monat (month 0-basiert) und ausgewählter Tag; Start: heute
  const [view, setView] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedKey, setSelectedKey] = useState(todayKey);

  const days = useMemo(() => buildMonthGrid(view.year, view.month), [view]);

  // Pläne für den sichtbaren Zeitraum (inkl. aufgefüllter Tage aus Nachbarmonaten) und den gewählten Tag
  const byDay = useMemo(
    () => plansByDay(plans, days[0].key, days[days.length - 1].key),
    [plans, days],
  );
  // IFCM FS-006 / C06a: Tagesliste nach Uhrzeit sortiert (Pläne ohne Uhrzeit ans Ende)
  const selectedPlans = useMemo(
    () =>
      [...(plansByDay(plans, selectedKey, selectedKey).get(selectedKey) ?? [])].sort((a, b) =>
        (a.time ?? '99:99').localeCompare(b.time ?? '99:99'),
      ),
    [plans, selectedKey],
  );
  const undatedCount = plans.filter((plan) => !plan.date).length;

  function changeMonth(delta: number) {
    setView((prev) => {
      const date = new Date(prev.year, prev.month + delta, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  }

  function goToToday() {
    const now = new Date();
    setView({ year: now.getFullYear(), month: now.getMonth() });
    setSelectedKey(todayKey);
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold text-ink">Kalender</h1>
        <PrimaryButton variant="ghost" icon={<CalendarDays size={18} />} onClick={goToToday}>
          Heute
        </PrimaryButton>
      </header>

      <section className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-4 sm:p-5">
        {/* Monatsnavigation */}
        <div className="flex items-center justify-between gap-3">
          <IconButton icon={<ChevronLeft size={18} />} label="Vorheriger Monat" onClick={() => changeMonth(-1)} />
          <h2 className="font-display text-lg font-bold text-ink" aria-live="polite">
            {formatMonthTitle(view.year, view.month)}
          </h2>
          <IconButton icon={<ChevronRight size={18} />} label="Nächster Monat" onClick={() => changeMonth(1)} />
        </div>

        {/* Monatsraster: 7 Spalten, Woche beginnt Montag */}
        <div className="grid grid-cols-7 gap-1 text-center" role="grid" aria-label="Monatsansicht">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="py-1 text-xs font-semibold text-muted-2" role="columnheader">
              {label}
            </div>
          ))}
          {days.map((day) => {
            const dayPlans = byDay.get(day.key) ?? [];
            const isToday = day.key === todayKey;
            const isSelected = day.key === selectedKey;
            // überfällig = Tag liegt vor heute (gleiche Logik wie die rote Markierung in der Planübersicht)
            const isPast = day.key < todayKey;
            return (
              <button
                key={day.key}
                type="button"
                role="gridcell"
                aria-selected={isSelected}
                aria-label={`${formatLongDate(day.key)}${dayPlans.length ? `, ${dayPlans.length} Plan/Pläne` : ''}`}
                onClick={() => setSelectedKey(day.key)}
                className={`flex aspect-square min-h-11 flex-col items-center justify-center gap-1 rounded-2xl text-sm font-semibold transition ${
                  isSelected
                    ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_8px_18px_rgba(37,99,235,0.3)]'
                    : isToday
                      ? 'border border-primary text-primary'
                      : day.inMonth
                        ? 'text-ink hover:bg-surface-2'
                        : 'text-muted-2/60 hover:bg-surface-2'
                }`}
              >
                <span>{day.day}</span>
                {/* Punkte = Pläne an diesem Tag (max. 3), rot wenn überfällig.
                    IFCM FS-005 / C06: vergangene Termine wiederkehrender Pläne sind NICHT überfällig → grau */}
                <span className="flex h-1.5 gap-0.5">
                  {dayPlans.slice(0, 3).map((plan) => (
                    <span
                      key={plan.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected
                          ? 'bg-white'
                          : isPast
                            ? isRecurring(plan)
                              ? 'bg-muted-2'
                              : 'bg-danger'
                            : 'bg-primary'
                      }`}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tagesliste: Pläne des ausgewählten Tages */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-ink">{formatLongDate(selectedKey)}</h2>
          {/* Plan für diesen Tag anlegen – das Datum wird im Formular vorausgefüllt */}
          <PrimaryButton icon={<Plus size={18} />} onClick={() => navigate(`/plaene/neu?datum=${selectedKey}`)}>
            Plan für diesen Tag
          </PrimaryButton>
        </div>

        {selectedPlans.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border p-5 text-sm text-muted">
            An diesem Tag ist kein Training geplant.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {selectedPlans.map((plan) => {
              // IFCM FS-005 / C06: nur einmalige Pläne können überfällig sein
              const recurring = isRecurring(plan);
              const overdue = selectedKey < todayKey && !recurring;
              return (
                <li key={plan.id}>
                  <Link
                    to={`/plaene/${plan.id}`}
                    className={`flex items-center gap-3 rounded-2xl border bg-surface p-4 transition hover:bg-surface-2 ${
                      overdue ? 'border-danger/50' : 'border-border'
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white">
                      <ClipboardList size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink">
                        {/* IFCM FS-006 / C06a: Uhrzeit vor dem Namen */}
                        {plan.time && <span className="mr-1.5 text-primary">{plan.time}</span>}
                        {plan.name}
                      </span>
                      <span className={`block text-xs ${overdue ? 'text-danger' : 'text-muted-2'}`}>
                        {plan.exerciseIds.length} Übungen{overdue ? ' · Überfällig' : ''}
                        {/* IFCM FS-005 / C06: Rhythmus anzeigen */}
                        {recurring && plan.recurrence && (
                          <span className="ml-1 inline-flex items-center gap-1">
                            · <Repeat size={11} /> {RECURRENCE_LABELS[plan.recurrence]}
                          </span>
                        )}
                      </span>
                    </span>
                    <ChevronRight size={18} className="text-muted-2" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {undatedCount > 0 && (
          <p className="text-xs text-muted-2">
            {undatedCount} {undatedCount === 1 ? 'Plan hat' : 'Pläne haben'} kein Datum und{' '}
            {undatedCount === 1 ? 'erscheint' : 'erscheinen'} deshalb nicht im Kalender.
          </p>
        )}
      </section>
    </div>
  );
}
