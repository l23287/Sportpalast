// IFCM FS-013 / C09 Zielsetzungstool: Formular für ein Kernziel mit SMART-Hilfe.
// Jede Eingabe zeigt sofort, welche SMART-Kriterien erkennbar erfüllt sind (S M A R T als Kacheln). Das ist eine
// Hilfe, keine Pflicht: Nur der Zieltext ist erforderlich (siehe lib/goals.ts).
import { useState, type FormEvent } from 'react';
import { Check, Lightbulb, X } from 'lucide-react';
import type { Goal, GoalInput } from '../types';
import { inputClass, labelClass, textareaClass } from '../lib/formStyles';
import {
  GOAL_EXAMPLES,
  GOAL_PRIVACY_HINT,
  MAX_GOAL_MEASURE,
  MAX_GOAL_TEXT,
  SMART_LABELS,
  smartCheck,
  type SmartCheck,
} from '../lib/goals';
import { PrimaryButton } from './PrimaryButton';

interface GoalFormProps {
  goal?: Goal; // vorhanden = bearbeiten
  onSubmit: (input: GoalInput) => string | null; // Fehlermeldung oder null
  onCancel?: () => void;
}

export function GoalForm({ goal, onSubmit, onCancel }: GoalFormProps) {
  const [text, setText] = useState(goal?.text ?? '');
  const [measure, setMeasure] = useState(goal?.measure ?? '');
  const [realistic, setRealistic] = useState(goal?.realistic ?? false);
  const [dueDate, setDueDate] = useState(goal?.dueDate ?? '');
  const [error, setError] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const check = smartCheck({ text, measure, realistic, dueDate: dueDate || null });
  const fulfilled = Object.values(check).filter(Boolean).length;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = onSubmit({ text, measure, realistic, dueDate: dueDate || null });
    if (result) {
      setError(result);
      return;
    }
    if (!goal) {
      // nach dem Anlegen leeren, damit direkt das nächste Ziel formuliert werden kann
      setText('');
      setMeasure('');
      setRealistic(false);
      setDueDate('');
    }
    setError('');
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-2xl border border-border bg-bg-soft p-4">
      <div>
        <label className={labelClass} htmlFor={`goal-text-${goal?.id ?? 'new'}`}>
          Dein Ziel
        </label>
        <textarea
          id={`goal-text-${goal?.id ?? 'new'}`}
          rows={2}
          maxLength={MAX_GOAL_TEXT}
          className={textareaClass}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setError('');
          }}
          placeholder="Was genau willst du bis wann erreichen? Positiv formulieren."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor={`goal-measure-${goal?.id ?? 'new'}`}>
            Woran misst du den Erfolg? (optional)
          </label>
          <input
            id={`goal-measure-${goal?.id ?? 'new'}`}
            maxLength={MAX_GOAL_MEASURE}
            className={inputClass}
            value={measure}
            onChange={(event) => setMeasure(event.target.value)}
            placeholder="z. B. 8 von 10 Aufschlägen im Feld"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`goal-due-${goal?.id ?? 'new'}`}>
            Zieldatum (optional)
          </label>
          <input
            id={`goal-due-${goal?.id ?? 'new'}`}
            type="date"
            className={`${inputClass} [color-scheme:dark]`}
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          checked={realistic}
          onChange={(event) => setRealistic(event.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-primary)]"
        />
        <span>Realitäts-Check: Das Ziel fordert mich heraus, ist mit meiner Zeit, meinem Wissen und meinen Mitteln aber machbar.</span>
      </label>

      {/* SMART-Kacheln: leuchten auf, sobald ein Kriterium erkennbar erfüllt ist */}
      <div>
        <p className="mb-2 text-xs font-semibold text-muted">
          SMART-Check: {fulfilled} von 5 erkennbar erfüllt
        </p>
        <ul className="grid grid-cols-5 gap-1.5" aria-label="SMART-Kriterien">
          {(Object.keys(SMART_LABELS) as (keyof SmartCheck)[]).map((key) => (
            <li
              key={key}
              title={`${SMART_LABELS[key].name}: ${SMART_LABELS[key].hint}`}
              className={`flex flex-col items-center rounded-xl border px-1 py-2 text-center transition ${
                check[key] ? 'border-transparent bg-sport/20 text-ink' : 'border-border text-muted-2'
              }`}
            >
              <span className={`font-display text-lg font-extrabold ${check[key] ? 'text-sport' : ''}`}>{key}</span>
              <span className="text-[10px] leading-tight">{SMART_LABELS[key].name}</span>
              <span className="sr-only">{check[key] ? 'erfüllt' : 'noch offen'}</span>
            </li>
          ))}
        </ul>
        {/* Erster noch offener Punkt als konkreter Tipp */}
        {fulfilled < 5 && text.trim() && (
          <p className="mt-2 text-xs text-muted">
            Tipp ({SMART_LABELS[(Object.keys(check) as (keyof SmartCheck)[]).find((k) => !check[k])!].name}):{' '}
            {SMART_LABELS[(Object.keys(check) as (keyof SmartCheck)[]).find((k) => !check[k])!].hint}
          </p>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowExamples((prev) => !prev)}
          aria-expanded={showExamples}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <Lightbulb size={14} /> {showExamples ? 'Beispiele ausblenden' : 'Beispiele für SMART-Ziele'}
        </button>
        {showExamples && (
          <ul className="mt-2 flex flex-col gap-1.5 text-xs text-muted">
            {GOAL_EXAMPLES.map((example) => (
              <li key={example} className="rounded-xl bg-surface px-3 py-2">„{example}“</li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-[11px] text-muted-2">{GOAL_PRIVACY_HINT}</p>
      {error && <p className="text-sm font-medium text-danger">{error}</p>}

      <div className="flex flex-col gap-2 sm:flex-row">
        <PrimaryButton type="submit" icon={<Check size={18} />}>
          {goal ? 'Ziel speichern' : 'Ziel hinzufügen'}
        </PrimaryButton>
        {onCancel && (
          <PrimaryButton type="button" variant="ghost" icon={<X size={18} />} onClick={onCancel} className="border border-border">
            Abbrechen
          </PrimaryButton>
        )}
      </div>
    </form>
  );
}
