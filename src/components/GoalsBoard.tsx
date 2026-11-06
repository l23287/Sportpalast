// IFCM FS-013 / C09 Zielsetzungstool: motivierende Anzeige der Kernziele.
// Umsetzung der Praxistipps der Quelle: Visualisieren (Ziele dauerhaft sichtbar in der Planübersicht),
// Kontrollieren (Restzeit + Fortschrittsleiste bis zum Zieldatum), Feiern (Abhaken mit Erfolgsmeldung).
// mode „overview“: kompakt in der Planübersicht; mode „manage“: in den Einstellungen mit Bearbeiten/Löschen.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Check, Flag, Pencil, Plus, Ruler, Trash2, Trophy } from 'lucide-react';
import { useGoals } from '../context/GoalsContext';
import { toDateKey } from '../lib/calendar';
import { formatDateKey } from '../lib/recurrence';
import { MAX_OPEN_GOALS, daysUntil, formatRemaining, timeProgress } from '../lib/goals';
import type { Goal } from '../types';
import { IconButton } from './IconButton';
import { GoalForm } from './GoalForm';

interface GoalsBoardProps {
  mode: 'overview' | 'manage';
  // IFCM FS-014 / C09a: Überschrift ausblenden, wenn der umgebende aufklappbare Bereich sie schon zeigt
  showHeading?: boolean;
}

export function GoalsBoard({ mode, showHeading = true }: GoalsBoardProps) {
  const { openGoals, achievedGoals, toggleAchieved, deleteGoal, updateGoal } = useGoals();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState<string | null>(null); // Text der Erfolgsmeldung
  const todayKey = toDateKey(new Date());

  function handleToggle(goal: Goal) {
    toggleAchieved(goal.id);
    // „Feiern!“ – kurze Erfolgsmeldung beim Abhaken
    setCelebrate(goal.achievedAt ? null : `Stark! „${goal.text}“ ist erreicht. 🎉`);
  }

  // In der Übersicht: ohne Ziele nur ein dezenter Hinweis auf die Einstellungen
  if (mode === 'overview' && openGoals.length === 0 && !celebrate) {
    return (
      <Link
        to="/einstellungen#ziele"
        className="flex items-center gap-3 rounded-2xl border border-dashed border-border p-4 text-sm text-muted transition hover:border-sport/60 hover:text-ink"
      >
        <Flag size={18} className="shrink-0 text-sport" />
        <span className="flex-1">Setze dir bis zu {MAX_OPEN_GOALS} Kernziele für diese Sportart – sie erscheinen dann hier.</span>
        <Plus size={18} />
      </Link>
    );
  }

  return (
    <section aria-labelledby={`goals-heading-${mode}`} className="flex flex-col gap-3">
      {showHeading && (
      <div className="flex items-center gap-2">
        <Flag size={18} className="text-sport" />
        <h2 id={`goals-heading-${mode}`} className="font-display text-lg font-bold text-ink">
          Deine Ziele
        </h2>
        <span className="text-xs text-muted-2">
          {openGoals.length}/{MAX_OPEN_GOALS} offen
        </span>
      </div>
      )}

      {celebrate && (
        <p role="status" className="rounded-2xl border border-sport/40 bg-sport/15 px-4 py-3 text-sm font-semibold text-ink">
          {celebrate}
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {openGoals.map((goal) =>
          editingId === goal.id ? (
            <li key={goal.id}>
              <GoalForm
                goal={goal}
                onSubmit={(input) => {
                  const error = updateGoal(goal.id, input);
                  if (!error) setEditingId(null);
                  return error;
                }}
                onCancel={() => setEditingId(null)}
              />
            </li>
          ) : (
            <li key={goal.id} className="flex gap-3 rounded-2xl border border-border bg-surface p-4">
              {/* Abhaken = Ziel erreicht */}
              <button
                type="button"
                onClick={() => handleToggle(goal)}
                aria-label={`Ziel als erreicht markieren: ${goal.text}`}
                className="group mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-sport text-sport transition hover:bg-sport/20"
              >
                <Check size={14} className="opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="break-words font-semibold text-ink">{goal.text}</p>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-2">
                  {goal.measure && (
                    <span className="inline-flex items-center gap-1">
                      <Ruler size={12} /> {goal.measure}
                    </span>
                  )}
                  {goal.dueDate && (
                    <span
                      className={`inline-flex items-center gap-1 ${daysUntil(goal.dueDate, todayKey) < 0 ? 'text-danger' : ''}`}
                    >
                      <CalendarClock size={12} /> bis {formatDateKey(goal.dueDate)} · {formatRemaining(goal.dueDate, todayKey)}
                    </span>
                  )}
                </div>
                {/* Fortschrittsleiste: verstrichene Zeit bis zum Zieldatum (Kontrollieren) */}
                {goal.dueDate && (
                  <div
                    className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2"
                    role="progressbar"
                    aria-label="Verstrichene Zeit bis zum Zieldatum"
                    aria-valuenow={Math.round(timeProgress(goal.createdAt, goal.dueDate, todayKey) * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-sport"
                      style={{ width: `${timeProgress(goal.createdAt, goal.dueDate, todayKey) * 100}%` }}
                    />
                  </div>
                )}
                {/* Überschrittenes Ziel: Hinweis „Anpassen“ statt Scheitern (Praxistipp der Quelle) */}
                {goal.dueDate && daysUntil(goal.dueDate, todayKey) < 0 && (
                  <p className="mt-1.5 text-xs text-muted">
                    Zieldatum überschritten – Ziele anzupassen ist kein Scheitern.
                    {mode === 'overview' && (
                      <Link to="/einstellungen#ziele" className="ml-1 font-semibold text-primary hover:underline">
                        Anpassen
                      </Link>
                    )}
                  </p>
                )}
              </div>
              {mode === 'manage' && (
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <IconButton icon={<Pencil size={15} />} label="Ziel bearbeiten" onClick={() => setEditingId(goal.id)} />
                  <IconButton icon={<Trash2 size={15} />} label="Ziel löschen" onClick={() => deleteGoal(goal.id)} />
                </div>
              )}
            </li>
          ),
        )}
      </ul>

      {/* Erreichte Ziele (in der Übersicht nur das letzte, in den Einstellungen alle) */}
      {achievedGoals.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {(mode === 'overview' ? achievedGoals.slice(0, 1) : achievedGoals).map((goal) => (
            <li key={goal.id} className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-xs text-muted">
              <Trophy size={14} className="shrink-0 text-sport" />
              <span className="min-w-0 flex-1 truncate line-through decoration-muted-2">{goal.text}</span>
              {mode === 'manage' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleToggle(goal)}
                    className="shrink-0 font-semibold text-primary hover:underline disabled:opacity-50"
                    disabled={openGoals.length >= MAX_OPEN_GOALS}
                    title={openGoals.length >= MAX_OPEN_GOALS ? 'Schon 3 offene Ziele' : undefined}
                  >
                    Wieder öffnen
                  </button>
                  <IconButton icon={<Trash2 size={14} />} label="Erreichtes Ziel löschen" onClick={() => deleteGoal(goal.id)} />
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
