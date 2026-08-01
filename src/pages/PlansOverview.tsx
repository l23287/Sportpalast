import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { SearchInput } from '../components/SearchInput';
import { PlanCard } from '../components/PlanCard';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SPORT_EMOJI } from '../lib/sport';

export function PlansOverview() {
  const { plans, exercises, deletePlan } = useAppData();
  const { account } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filteredPlans = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return plans;
    return plans.filter((plan) => plan.name.toLowerCase().includes(q));
  }, [plans, query]);

  const pendingDeletePlan = plans.find((plan) => plan.id === pendingDeleteId);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-muted-2">
          {SPORT_EMOJI} Willkommen zurück, {account?.name ?? 'Trainer:in'}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-extrabold text-ink">Trainingspläne</h1>
          <PrimaryButton icon={<Plus size={18} />} onClick={() => navigate('/plaene/neu')}>
            Neuer Plan
          </PrimaryButton>
        </div>
      </header>

      <SearchInput value={query} onChange={setQuery} placeholder="Pläne durchsuchen…" className="max-w-md" />

      {filteredPlans.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={28} />}
          title={plans.length === 0 ? 'Noch keine Trainingspläne' : 'Keine Treffer'}
          description={
            plans.length === 0
              ? 'Erstelle deinen ersten Trainingsplan und stelle Übungen aus deinem Pool zusammen.'
              : 'Für deine Suche wurden keine Pläne gefunden.'
          }
          action={
            plans.length === 0 ? (
              <PrimaryButton icon={<Plus size={18} />} onClick={() => navigate('/plaene/neu')}>
                Neuen Plan erstellen
              </PrimaryButton>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              exercises={exercises}
              onEdit={() => navigate(`/plaene/${plan.id}/bearbeiten`)}
              onDelete={() => setPendingDeleteId(plan.id)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDeletePlan)}
        title="Plan löschen?"
        description={
          pendingDeletePlan ? `„${pendingDeletePlan.name}“ wird unwiderruflich gelöscht.` : undefined
        }
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deletePlan(pendingDeleteId);
          setPendingDeleteId(null);
        }}
      />
    </div>
  );
}
