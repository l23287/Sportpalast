import { Crosshair } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export function ServeTraining() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-ink">Aufschlagtraining</h1>
      </header>

      <EmptyState
        icon={<Crosshair size={28} />}
        title="Bald verfügbar"
        description="Hier entstehen bald gezielte Übungen und Routinen für dein Aufschlagtraining."
      />
    </div>
  );
}
