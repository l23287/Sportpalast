import { useMemo, useState } from 'react';
import { Crosshair, Flag, Play, Ruler, Tag, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { IconButton } from '../components/IconButton';
import { PillSelect } from '../components/PillSelect';
import { StatTile } from '../components/StatTile';
import { LineChart } from '../components/LineChart';
import { ServeSessionCard } from '../components/ServeSessionCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { computeServeProgress, computeServeSessionSummary } from '../lib/serveStats';
import { inputClass, labelClass } from '../lib/formStyles';
import { SERVE_LENGTHS, SERVE_PLACEMENTS, type ServeLength, type ServePlacement, type ServeSession } from '../types';

type Phase = 'idle' | 'goal' | 'active' | 'results';

export function ServeTraining() {
  const { serveSessions, startServeSession, addServeAttempt, endServeSession, deleteServeSession } = useAppData();

  const activeSession = serveSessions.find((session) => session.endedAt === null) ?? null;

  const [phase, setPhase] = useState<Phase>(activeSession ? 'active' : 'idle');
  const [length, setLength] = useState<ServeLength | null>(null);
  const [placement, setPlacement] = useState<ServePlacement | null>(null);
  const [type, setType] = useState('');
  const [viewSessionId, setViewSessionId] = useState<string | null>(null);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const completedSessions = useMemo(
    () => serveSessions.filter((session) => session.endedAt !== null),
    [serveSessions],
  );
  const viewSession = serveSessions.find((session) => session.id === viewSessionId) ?? null;
  const pendingDeleteSession = serveSessions.find((session) => session.id === pendingDeleteId);

  function openGoalPhase() {
    setLength(null);
    setPlacement(null);
    setType('');
    setPhase('goal');
  }

  function handleStartSession() {
    if (!length || !placement) return;
    startServeSession({ length, placement, type: type.trim() });
    setPhase('active');
  }

  function handleEndSession() {
    if (!activeSession) return;
    if (activeSession.attempts.length === 0) {
      deleteServeSession(activeSession.id);
      setPhase('idle');
      return;
    }
    endServeSession(activeSession.id);
    setViewSessionId(activeSession.id);
    setPhase('results');
  }

  function handleDiscardSession() {
    if (!activeSession) return;
    if (activeSession.attempts.length > 0) {
      setDiscardConfirmOpen(true);
      return;
    }
    deleteServeSession(activeSession.id);
    setPhase('idle');
  }

  function confirmDiscard() {
    if (!activeSession) return;
    deleteServeSession(activeSession.id);
    setDiscardConfirmOpen(false);
    setPhase('idle');
  }

  function backToOverview() {
    setViewSessionId(null);
    setPhase('idle');
  }

  if (phase === 'goal') {
    return (
      <GoalPhase
        length={length}
        placement={placement}
        type={type}
        onLengthChange={setLength}
        onPlacementChange={setPlacement}
        onTypeChange={setType}
        onCancel={() => setPhase('idle')}
        onStart={handleStartSession}
      />
    );
  }

  if (phase === 'active' && activeSession) {
    return (
      <ActivePhase
        session={activeSession}
        onGood={() => addServeAttempt(activeSession.id, 'gut')}
        onBad={() => addServeAttempt(activeSession.id, 'schlecht')}
        onEnd={handleEndSession}
        onDiscard={handleDiscardSession}
        discardConfirmOpen={discardConfirmOpen}
        onConfirmDiscard={confirmDiscard}
        onCancelDiscard={() => setDiscardConfirmOpen(false)}
      />
    );
  }

  if (phase === 'results' && viewSession) {
    return <ResultsPhase session={viewSession} onDone={backToOverview} onRestart={openGoalPhase} />;
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold text-ink">Aufschlagtraining</h1>
        <PrimaryButton icon={<Play size={18} />} onClick={openGoalPhase}>
          Session starten
        </PrimaryButton>
      </header>

      {completedSessions.length === 0 ? (
        <EmptyState
          icon={<Crosshair size={28} />}
          title="Noch keine Session"
          description="Leg ein Ziel fest, bewerte jeden Aufschlag und sieh danach deinen Verlauf."
          action={
            <PrimaryButton icon={<Play size={18} />} onClick={openGoalPhase}>
              Session starten
            </PrimaryButton>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {completedSessions.map((session) => (
            <ServeSessionCard
              key={session.id}
              session={session}
              onView={() => {
                setViewSessionId(session.id);
                setPhase('results');
              }}
              onDelete={() => setPendingDeleteId(session.id)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDeleteSession)}
        title="Session löschen?"
        description="Diese Aufschlagtraining-Session wird unwiderruflich gelöscht."
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteServeSession(pendingDeleteId);
          setPendingDeleteId(null);
        }}
      />
    </div>
  );
}

interface GoalPhaseProps {
  length: ServeLength | null;
  placement: ServePlacement | null;
  type: string;
  onLengthChange: (value: ServeLength) => void;
  onPlacementChange: (value: ServePlacement) => void;
  onTypeChange: (value: string) => void;
  onCancel: () => void;
  onStart: () => void;
}

function GoalPhase({
  length,
  placement,
  type,
  onLengthChange,
  onPlacementChange,
  onTypeChange,
  onCancel,
  onStart,
}: GoalPhaseProps) {
  const canStart = Boolean(length && placement);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-ink">Ziel festlegen</h1>
        <p className="mt-1 text-sm text-muted">
          Was nimmst du dir für diese Session vor? Länge und Platzierung geben dir eine klare Zielvision.
        </p>
      </header>

      <div className="flex flex-col gap-6 rounded-3xl border border-border bg-surface p-5">
        <PillSelect label="Länge" options={SERVE_LENGTHS} value={length} onChange={onLengthChange} />
        <PillSelect label="Platzierung" options={SERVE_PLACEMENTS} value={placement} onChange={onPlacementChange} />
        <div>
          <label className={labelClass} htmlFor="serve-type">
            Aufschlagart <span className="text-muted-2">(optional)</span>
          </label>
          <input
            id="serve-type"
            className={inputClass}
            value={type}
            onChange={(event) => onTypeChange(event.target.value)}
            placeholder="z. B. Pendelaufschlag Unterschnitt"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <PrimaryButton variant="ghost" className="w-full border border-border md:flex-1" onClick={onCancel}>
          Abbrechen
        </PrimaryButton>
        <PrimaryButton icon={<Play size={18} />} className="w-full md:flex-1" disabled={!canStart} onClick={onStart}>
          Session starten
        </PrimaryButton>
      </div>
    </div>
  );
}

interface ActivePhaseProps {
  session: ServeSession;
  onGood: () => void;
  onBad: () => void;
  onEnd: () => void;
  onDiscard: () => void;
  discardConfirmOpen: boolean;
  onConfirmDiscard: () => void;
  onCancelDiscard: () => void;
}

function ActivePhase({
  session,
  onGood,
  onBad,
  onEnd,
  onDiscard,
  discardConfirmOpen,
  onConfirmDiscard,
  onCancelDiscard,
}: ActivePhaseProps) {
  const { total, good, bad, successRate } = computeServeSessionSummary(session);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-2">Aktive Session</p>
          <h1 className="font-display text-3xl font-extrabold text-ink">Aufschlagtraining</h1>
        </div>
        <IconButton icon={<X size={16} />} label="Session verwerfen" onClick={onDiscard} />
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-surface p-5">
        <span className="text-sm font-medium text-muted">Dein Ziel:</span>
        <span className="inline-flex items-center gap-1.5 rounded-2xl bg-primary-soft px-3 py-1.5 text-sm font-semibold text-accent">
          <Ruler size={14} /> {session.length}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-2xl bg-primary-soft px-3 py-1.5 text-sm font-semibold text-accent">
          <Crosshair size={14} /> {session.placement}
        </span>
        {session.type && (
          <span className="inline-flex items-center gap-1.5 rounded-2xl bg-primary-soft px-3 py-1.5 text-sm font-semibold text-accent">
            <Tag size={14} /> {session.type}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile icon={<ThumbsUp size={20} />} label="Gut" value={good} />
        <StatTile icon={<ThumbsDown size={20} />} label="Schlecht" value={bad} />
        <StatTile icon={<Crosshair size={20} />} label="Gesamt" value={total} />
        <StatTile icon={<Flag size={20} />} label="Quote" value={total === 0 ? '–' : `${successRate}%`} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={onGood}
          className="flex h-24 items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-accent to-accent-dark text-lg font-bold text-[#04263f] shadow-[0_10px_25px_rgba(56,189,248,0.3)] transition hover:brightness-110 active:brightness-95"
        >
          <ThumbsUp size={24} /> Aufschlag war gut
        </button>
        <button
          type="button"
          onClick={onBad}
          className="flex h-24 items-center justify-center gap-3 rounded-3xl bg-danger text-lg font-bold text-white shadow-[0_10px_25px_rgba(248,113,113,0.3)] transition hover:brightness-110 active:brightness-95"
        >
          <ThumbsDown size={24} /> Aufschlag war schlecht
        </button>
      </div>

      {session.attempts.length > 0 && (
        <div className="flex flex-wrap gap-2 rounded-3xl border border-border bg-surface p-5">
          {session.attempts.map((attempt, index) => (
            <span
              key={attempt.id}
              title={`Aufschlag ${index + 1}: ${attempt.result === 'gut' ? 'Gut' : 'Schlecht'}`}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                attempt.result === 'gut' ? 'bg-accent/20 text-accent' : 'bg-danger/20 text-danger'
              }`}
            >
              {index + 1}
            </span>
          ))}
        </div>
      )}

      <PrimaryButton icon={<Flag size={18} />} onClick={onEnd}>
        Session beenden
      </PrimaryButton>

      <ConfirmDialog
        open={discardConfirmOpen}
        title="Session verwerfen?"
        description="Alle bisher erfassten Aufschläge dieser Session gehen verloren."
        confirmLabel="Verwerfen"
        onConfirm={onConfirmDiscard}
        onCancel={onCancelDiscard}
      />
    </div>
  );
}

interface ResultsPhaseProps {
  session: ServeSession;
  onDone: () => void;
  onRestart: () => void;
}

function ResultsPhase({ session, onDone, onRestart }: ResultsPhaseProps) {
  const { total, good, bad, successRate } = computeServeSessionSummary(session);
  const progress = useMemo(() => computeServeProgress(session.attempts), [session.attempts]);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header>
        <p className="text-sm font-medium text-muted-2">Session-Ergebnis</p>
        <h1 className="font-display text-3xl font-extrabold text-ink">Aufschlagtraining</h1>
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-surface p-5">
        <span className="text-sm font-medium text-muted">Ziel war:</span>
        <span className="inline-flex items-center gap-1.5 rounded-2xl bg-primary-soft px-3 py-1.5 text-sm font-semibold text-accent">
          <Ruler size={14} /> {session.length}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-2xl bg-primary-soft px-3 py-1.5 text-sm font-semibold text-accent">
          <Crosshair size={14} /> {session.placement}
        </span>
        {session.type && (
          <span className="inline-flex items-center gap-1.5 rounded-2xl bg-primary-soft px-3 py-1.5 text-sm font-semibold text-accent">
            <Tag size={14} /> {session.type}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile icon={<Crosshair size={20} />} label="Gesamt" value={total} />
        <StatTile icon={<ThumbsUp size={20} />} label="Gut" value={good} />
        <StatTile icon={<ThumbsDown size={20} />} label="Schlecht" value={bad} />
        <StatTile icon={<Flag size={20} />} label="Erfolgsquote" value={`${successRate}%`} />
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-bold text-ink">Verlauf der Erfolgsquote</h2>
        <LineChart points={progress} />
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <PrimaryButton variant="ghost" className="w-full border border-border md:flex-1" onClick={onDone}>
          Fertig
        </PrimaryButton>
        <PrimaryButton icon={<Play size={18} />} className="w-full md:flex-1" onClick={onRestart}>
          Neue Session
        </PrimaryButton>
      </div>
    </div>
  );
}
