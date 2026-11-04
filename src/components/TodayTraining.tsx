// IFCM FS-007 / C06b: Gesonderter Bereich „Heute“ oben in der Trainingsplan-Übersicht.
// Zeigt alle Pläne, die HEUTE einen Termin haben (einmalig oder als Wiederholung aus C06/C06a), jeweils mit
// ihren anstehenden Übungen in der geplanten Reihenfolge. Steht heute nichts an, nennt er den nächsten Termin.
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, ChevronRight, Clock, Sun } from 'lucide-react';
import type { Exercise, TrainingPlan } from '../types';
import { plansByDay, toDateKey, formatLongDate } from '../lib/calendar';
import { formatDateKey } from '../lib/recurrence';
import { formatDuration } from '../lib/time';
import { ExpandableNote } from './ExpandableNote'; // IFCM FS-011 / C08a

interface TodayTrainingProps {
  plans: TrainingPlan[]; // bereits auf die aktuelle Sportart gefiltert (C01)
  exercises: Exercise[];
}

// Wie weit nach dem nächsten Termin gesucht wird, wenn heute nichts ansteht (Tage)
const LOOKAHEAD_DAYS = 60;

export function TodayTraining({ plans, exercises }: TodayTrainingProps) {
  const todayKey = toDateKey(new Date());

  // Heutige Pläne – dieselbe Terminlogik wie im Kalender (plansByDay), sortiert nach Uhrzeit (C06a)
  const todaysPlans = useMemo(
    () =>
      [...(plansByDay(plans, todayKey, todayKey).get(todayKey) ?? [])].sort((a, b) =>
        (a.time ?? '99:99').localeCompare(b.time ?? '99:99'),
      ),
    [plans, todayKey],
  );

  // Nächster Termin nach heute (nur nötig, wenn heute nichts ansteht)
  const nextUp = useMemo(() => {
    if (todaysPlans.length > 0) return null;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const until = new Date();
    until.setDate(until.getDate() + LOOKAHEAD_DAYS);
    const byDay = plansByDay(plans, toDateKey(tomorrow), toDateKey(until));
    const firstKey = [...byDay.keys()].sort()[0];
    return firstKey ? { key: firstKey, plan: byDay.get(firstKey)![0] } : null;
  }, [plans, todaysPlans.length]);

  // Ohne Pläne mit Datum gibt es nichts zu zeigen – die Übersicht bleibt dann wie bisher
  if (todaysPlans.length === 0 && !nextUp) return null;

  return (
    <section
      aria-labelledby="today-heading"
      className="flex flex-col gap-4 rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/15 to-surface p-5"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white">
          <Sun size={20} />
        </span>
        <div className="min-w-0">
          <h2 id="today-heading" className="font-display text-lg font-bold text-ink">
            Heute
          </h2>
          <p className="text-xs text-muted">{formatLongDate(todayKey)}</p>
        </div>
      </div>

      {todaysPlans.length === 0 && nextUp ? (
        // Heute kein Training → Hinweis auf den nächsten Termin
        <Link
          to={`/plaene/${nextUp.plan.id}`}
          className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-sm transition hover:bg-surface-2"
        >
          <CalendarClock size={18} className="shrink-0 text-primary" />
          <span className="min-w-0 flex-1 text-muted">
            Heute steht kein Training an. Nächster Termin:{' '}
            <span className="font-semibold text-ink">
              {nextUp.plan.name} am {formatDateKey(nextUp.key)}
              {nextUp.plan.time && `, ${nextUp.plan.time} Uhr`}
            </span>
          </span>
          <ChevronRight size={18} className="text-muted-2" />
        </Link>
      ) : (
        <ul className="flex flex-col gap-3">
          {todaysPlans.map((plan) => {
            // Übungen des Plans in der geplanten Reihenfolge (gelöschte Übungen werden übersprungen)
            const planExercises = plan.exerciseIds
              .map((id) => exercises.find((exercise) => exercise.id === id))
              .filter((exercise): exercise is Exercise => Boolean(exercise));
            // IFCM FS-009 / C07: Summe in Sekunden
            const totalSeconds = planExercises.reduce((sum, exercise) => sum + exercise.durationSeconds, 0);
            return (
              <li key={plan.id} className="rounded-2xl border border-border bg-surface p-4">
                <Link to={`/plaene/${plan.id}`} className="group flex items-center gap-3">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink group-hover:text-primary">
                      {plan.time && <span className="mr-1.5 text-primary">{plan.time}</span>}
                      {plan.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-2">
                      <Clock size={12} /> {formatDuration(totalSeconds)} · {planExercises.length} {planExercises.length === 1 ? 'Übung' : 'Übungen'}
                    </span>
                  </span>
                  {/* auf dem Handy nur der Pfeil, damit der Planname Platz hat */}
                  <span className="hidden shrink-0 text-xs font-semibold text-primary sm:inline">Zum Plan</span>
                  <ChevronRight size={18} className="shrink-0 text-muted-2" />
                </Link>

                {planExercises.length === 0 ? (
                  <p className="mt-3 text-xs text-muted-2">Diesem Plan sind noch keine Übungen zugeordnet.</p>
                ) : (
                  <ol className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                    {planExercises.map((exercise, index) => (
                      <li key={exercise.id} className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-accent">
                            {index + 1}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-ink">{exercise.name}</span>
                          <span className="shrink-0 text-xs text-muted-2">{formatDuration(exercise.durationSeconds)}</span>
                        </div>
                        {/* IFCM FS-011 / C08a: Notiz der Übung (aus C08) immer anzeigen, eingerückt unter dem Namen;
                            lange Notizen gekürzt und ausklappbar */}
                        {exercise.note && (
                          <div className="pl-9">
                            <ExpandableNote note={exercise.note} />
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
