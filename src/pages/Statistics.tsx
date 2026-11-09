import { useMemo } from 'react';
import { Activity, BarChart3, CalendarDays, CheckCircle2, ClipboardList, Clock, Dumbbell, Flag, Flame, Layers, Timer, Trophy } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { StatTile } from '../components/StatTile';
import { DonutChart, type DonutSlice } from '../components/DonutChart';
import { EmptyState } from '../components/EmptyState';
import { computeAverageDuration, computeExerciseUsage } from '../lib/stats';
import { CATEGORICAL_PALETTE_DARK, CHART_OTHER_COLOR } from '../lib/chartPalette';
import { formatDuration } from '../lib/time';
import { useSport } from '../context/SportContext';
// IFCM FS-023 / C14: neue Datenquellen und Diagramme
import { useStreak } from '../context/StreakContext';
import { useGoals } from '../context/GoalsContext';
import { useSavedTimes, MAX_SAVED_TIMES } from '../hooks/useSavedTimes';
import { ActivityGrid, BarList, WeeklyBars } from '../components/StatsCharts';
import { activityGrid, countBy, weeklyTraining } from '../lib/statsExtra';
import { toDateKey, plansByDay } from '../lib/calendar';
import { MUSCLE_GROUPS, formatOf } from '../lib/strength';
import { formatStopwatch, stopwatchLabelsFor } from '../lib/stopwatch';
import { formatDateKey } from '../lib/recurrence';

// IFCM FS-023 / C14: Zeitraum der Auswertungen
const WEEKS_BARS = 6; // Trainingszeit pro Woche
const WEEKS_GRID = 8; // Aktivitäts-Raster

const MAX_NAMED_SLICES = 5;

export function Statistics() {
  const { plans, exercises } = useAppData();
  const { sport, emoji } = useSport(); // IFCM FS-012 / C03

  // IFCM FS-023 / C14: Aktivität (gesamt), Protokoll (je Sportart), Ziele, gespeicherte Zeiten
  const streak = useStreak();
  const { goalsEnabled, openGoals, achievedGoals } = useGoals();
  const { times: savedTimes } = useSavedTimes();
  const todayKey = toDateKey(new Date());
  const weeks = useMemo(() => weeklyTraining(streak.log, sport, todayKey, WEEKS_BARS), [streak.log, sport, todayKey]);
  const grid = useMemo(() => activityGrid(streak.activeDays, todayKey, WEEKS_GRID), [streak.activeDays, todayKey]);
  const thisWeek = weeks[weeks.length - 1];
  const formatCounts = countBy(
    exercises,
    (e) => ({ duration: 'Dauer', sets: 'Sätze × Wdh.', stopwatch: 'Zeit messen' })[formatOf(e)],
    ['Dauer', 'Sätze × Wdh.', 'Zeit messen'],
  );
  const muscleCounts = countBy(exercises.filter((e) => e.muscleGroup), (e) => e.muscleGroup!, MUSCLE_GROUPS);
  const bestTimes = exercises.filter((e) => formatOf(e) === 'stopwatch' && e.bestTimeMs);
  const fastestSaved = savedTimes.length ? savedTimes.reduce((a, b) => (b.timeMs < a.timeMs ? b : a)) : null;
  // Termine im laufenden Monat (inkl. Wiederholungen, gleiche Logik wie Kalender C05/C06)
  const monthStart = todayKey.slice(0, 8) + '01';
  const monthEnd = new Date(Number(todayKey.slice(0, 4)), Number(todayKey.slice(5, 7)), 0);
  const monthEndKey = toDateKey(monthEnd);
  const monthDays = plansByDay(plans, monthStart, monthEndKey);
  const monthAppointments = [...monthDays.values()].reduce((sum, list) => sum + list.length, 0);
  const nextAppointment = [...monthDays.keys()].filter((k) => k >= todayKey).sort()[0];
  const labels = stopwatchLabelsFor(sport);

  const beginnerCount = exercises.filter((exercise) => exercise.difficulty === 'Anfänger').length;
  const advancedCount = exercises.filter((exercise) => exercise.difficulty === 'Fortgeschritten').length;

  const averageDuration = useMemo(() => computeAverageDuration(plans, exercises), [plans, exercises]);

  const usageData = useMemo(() => {
    const usage = computeExerciseUsage(plans, exercises);
    const named: DonutSlice[] = usage.slice(0, MAX_NAMED_SLICES).map((entry, index) => ({
      id: entry.exercise.id,
      label: entry.exercise.name,
      value: entry.count,
      color: CATEGORICAL_PALETTE_DARK[index],
    }));
    const rest = usage.slice(MAX_NAMED_SLICES);
    const restTotal = rest.reduce((sum, entry) => sum + entry.count, 0);
    if (restTotal > 0) {
      named.push({ id: '__other__', label: 'Andere', value: restTotal, color: CHART_OTHER_COLOR });
    }
    return named;
  }, [plans, exercises]);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-ink">Statistiken</h1>
        {/* IFCM FS-023 / C14: klarstellen, worauf sich die Zahlen beziehen */}
        <p className="text-sm text-muted">
          Auswertungen für {emoji} {sport}. Aktivität und Streak zählen über alle Sportarten.
        </p>
      </header>

      {/* IFCM FS-023 / C14: zweispaltig auch auf dem Handy, damit die Kennzahlen auf einen Blick passen */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile icon={<ClipboardList size={20} />} label="Trainingspläne" value={plans.length} />
        <StatTile icon={<Dumbbell size={20} />} label="Übungen" value={exercises.length} />
        <StatTile
          icon={<Clock size={20} />}
          label="Ø Trainingsdauer"
          value={plans.length === 0 ? '–' : formatDuration(averageDuration)}
        />
        <StatTile
          icon={<span className="text-lg leading-none">{emoji}</span>}
          label="Sportart"
          value={sport}
        />
      </div>

      {/* ── IFCM FS-023 / C14: neue Auswertungen ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile icon={<CheckCircle2 size={20} />} label="Diese Woche absolviert" value={thisWeek.count} />
        <StatTile icon={<Timer size={20} />} label="Trainingszeit diese Woche" value={formatDuration(thisWeek.seconds)} />
        <StatTile icon={<Flame size={20} />} label="Streak (alle Sportarten)" value={`${streak.current} ${streak.current === 1 ? 'Tag' : 'Tage'}`} />
        <StatTile icon={<CalendarDays size={20} />} label="Termine diesen Monat" value={monthAppointments} />
      </div>

      {/* a) Aktivität – gesamt */}
      <section className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Activity size={18} className="text-sport" /> Aktivität der letzten {WEEKS_GRID} Wochen
          </h2>
          <span className="flex items-center gap-1 text-xs font-semibold text-muted">
            <Trophy size={13} /> Rekord {streak.longest} {streak.longest === 1 ? 'Tag' : 'Tage'}
          </span>
        </div>
        <ActivityGrid grid={grid} />
        <p className="text-xs text-muted-2">
          Aktiv = eine Übung komplett absolviert oder eine neue Übung angelegt (alle Sportarten).
        </p>
      </section>

      {/* b) Trainingszeit pro Woche – diese Sportart (aus dem Protokoll absolvierter Übungen) */}
      <section className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <Clock size={18} className="text-sport" /> Trainingszeit pro Woche
        </h2>
        {weeks.every((w) => w.count === 0) ? (
          <p className="text-sm text-muted-2">
            Noch keine absolvierten Übungen. Gezählt wird ab jetzt, wenn eine Übung im Timer komplett durchläuft
            (Countdown, alle Sätze oder übernommene Zeit).
          </p>
        ) : (
          <WeeklyBars weeks={weeks} />
        )}
      </section>

      {/* c) Übungen nach Art und Muskelgruppe */}
      {exercises.length > 0 && (
        <section className="grid grid-cols-1 gap-6 rounded-3xl border border-border bg-surface p-5 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <Dumbbell size={18} className="text-sport" /> Übungen nach Art
            </h2>
            <BarList items={formatCounts} label="Übungen nach Art" />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <Layers size={18} className="text-sport" /> Muskelgruppen
            </h2>
            {muscleCounts.length === 0 ? (
              <p className="text-sm text-muted-2">Noch keine Übung mit Muskelgruppe.</p>
            ) : (
              <BarList items={muscleCounts} label="Übungen nach Muskelgruppe" />
            )}
          </div>
        </section>
      )}

      {/* d) Bestzeiten und gespeicherte Zeiten (nur zusammengefasst – freie Namen bleiben in der Stoppuhr) */}
      {(bestTimes.length > 0 || savedTimes.length > 0) && (
        <section className="flex flex-col gap-3 rounded-3xl border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Trophy size={18} className="text-sport" /> Bestzeiten
          </h2>
          {bestTimes.length > 0 && (
            <ul className="flex flex-col gap-1.5 text-sm">
              {bestTimes.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-muted">{e.name}</span>
                  <span className="font-semibold tabular-nums text-ink">{formatStopwatch(e.bestTimeMs!)}</span>
                </li>
              ))}
            </ul>
          )}
          {savedTimes.length > 0 && (
            <p className="text-sm text-muted">
              {labels.menu}: {savedTimes.length}/{MAX_SAVED_TIMES} Zeiten gespeichert
              {fastestSaved && <> · schnellste {formatStopwatch(fastestSaved.timeMs)}</>}
            </p>
          )}
        </section>
      )}

      {/* e) Ziele – nur wenn eingeschaltet (C15) */}
      {goalsEnabled && (
        <section className="flex flex-col gap-3 rounded-3xl border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Flag size={18} className="text-sport" /> Ziele
          </h2>
          <p className="text-sm text-muted">
            <span className="font-semibold text-ink">{openGoals.length}</span> offen ·{' '}
            <span className="font-semibold text-ink">{achievedGoals.length}</span> erreicht
          </p>
        </section>
      )}

      {/* f) Termine im Monat */}
      <section className="flex flex-col gap-2 rounded-3xl border border-border bg-surface p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <CalendarDays size={18} className="text-sport" /> Termine diesen Monat
        </h2>
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">{monthAppointments}</span>{' '}
          {monthAppointments === 1 ? 'geplantes Training' : 'geplante Trainings'} (inkl. Wiederholungen)
          {nextAppointment && <> · nächstes am {formatDateKey(nextAppointment)}</>}
        </p>
      </section>
      {/* ── Ende IFCM FS-023 / C14 ───────────────────────────────────────────────────────────────── */}

      <DifficultyBreakdown beginner={beginnerCount} advanced={advancedCount} />

      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-bold text-ink">Meist genutzte Übungen</h2>
        {usageData.length === 0 ? (
          <EmptyState
            icon={<BarChart3 size={28} />}
            title="Noch keine Daten"
            description="Sobald Übungen in Trainingsplänen verwendet werden, siehst du hier die Verteilung."
          />
        ) : (
          <DonutChart data={usageData} totalLabel="Einsätze" />
        )}
      </div>
    </div>
  );
}

function DifficultyBreakdown({ beginner, advanced }: { beginner: number; advanced: number }) {
  const total = beginner + advanced;
  const beginnerPct = total === 0 ? 0 : (beginner / total) * 100;
  const advancedPct = total === 0 ? 0 : (advanced / total) * 100;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
      <h2 className="font-display text-lg font-bold text-ink">Übungen nach Schwierigkeitsgrad</h2>
      {total === 0 ? (
        <p className="text-sm text-muted-2">Noch keine Übungen angelegt.</p>
      ) : (
        <>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-bg-soft">
            <div className="h-full bg-muted-2" style={{ width: `${beginnerPct}%` }} />
            {beginner > 0 && advanced > 0 && <div className="h-full w-[3px] bg-bg-soft" />}
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-dark"
              style={{ width: `${advancedPct}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-2 text-muted">
              <span className="h-2.5 w-2.5 rounded-full bg-muted-2" /> Anfänger · {beginner}
            </span>
            <span className="inline-flex items-center gap-2 text-muted">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-primary to-primary-dark" />{' '}
              Fortgeschritten · {advanced}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
