import { useMemo, useState } from 'react';
import { Dumbbell, Plus } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { SearchInput } from '../components/SearchInput';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ExerciseCard } from '../components/ExerciseCard';
import { ExerciseFormModal } from '../components/ExerciseFormModal';
import type { Exercise, ExerciseInput } from '../types';

export function Exercises() {
  const { exercises, settings, addExercise, updateExercise, deleteExercise } = useAppData();
  const [query, setQuery] = useState('');
  const [modalExercise, setModalExercise] = useState<Exercise | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filteredExercises = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return exercises;
    return exercises.filter((exercise) => exercise.name.toLowerCase().includes(q));
  }, [exercises, query]);

  const pendingDeleteExercise = exercises.find((exercise) => exercise.id === pendingDeleteId);

  function openCreateModal() {
    setModalExercise(null);
    setModalOpen(true);
  }

  function openEditModal(exercise: Exercise) {
    setModalExercise(exercise);
    setModalOpen(true);
  }

  function handleSubmit(input: ExerciseInput) {
    if (modalExercise) {
      updateExercise(modalExercise.id, input);
    } else {
      addExercise(input);
    }
    setModalOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold text-ink">Übungen</h1>
        <PrimaryButton icon={<Plus size={18} />} onClick={openCreateModal}>
          Neue Übung
        </PrimaryButton>
      </header>

      <SearchInput value={query} onChange={setQuery} placeholder="Übungen durchsuchen…" className="max-w-md" />

      {filteredExercises.length === 0 ? (
        <EmptyState
          icon={<Dumbbell size={28} />}
          title={exercises.length === 0 ? 'Noch keine Übungen' : 'Keine Treffer'}
          description={
            exercises.length === 0
              ? 'Lege deine erste Übung an und baue dir eine eigene Übungsdatenbank auf.'
              : 'Für deine Suche wurden keine Übungen gefunden.'
          }
          action={
            exercises.length === 0 ? (
              <PrimaryButton icon={<Plus size={18} />} onClick={openCreateModal}>
                Übung erstellen
              </PrimaryButton>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onEdit={() => openEditModal(exercise)}
              onDelete={() => setPendingDeleteId(exercise.id)}
            />
          ))}
        </div>
      )}

      <ExerciseFormModal
        open={modalOpen}
        currentSport={settings.sport}
        exercise={modalExercise}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(pendingDeleteExercise)}
        title="Übung löschen?"
        description={
          pendingDeleteExercise
            ? `„${pendingDeleteExercise.name}“ wird unwiderruflich gelöscht und aus allen Plänen entfernt.`
            : undefined
        }
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteExercise(pendingDeleteId);
          setPendingDeleteId(null);
        }}
      />
    </div>
  );
}
