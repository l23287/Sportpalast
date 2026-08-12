import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { BlobBackground } from './BlobBackground';
import { IconButton } from './IconButton';
import { TrainerProLockup } from './Logo';

interface LegalLayoutProps {
  title: string;
  children: ReactNode;
}

export function LegalLayout({ title, children }: LegalLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-dvh flex-col px-6 py-6">
      <BlobBackground />

      <IconButton icon={<ChevronLeft size={18} />} label="Zurück" onClick={() => navigate(-1)} />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-8">
        <div className="mb-8">
          <TrainerProLockup tagline={false} />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-ink">{title}</h1>
        <div className="mt-6 flex flex-col gap-5 pb-16">{children}</div>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2 rounded-3xl border border-border bg-surface p-5 text-sm leading-relaxed text-muted">
      <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}
