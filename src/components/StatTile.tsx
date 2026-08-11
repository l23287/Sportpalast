import type { ReactNode } from 'react';

interface StatTileProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

export function StatTile({ icon, label, value }: StatTileProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border bg-surface p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-accent">
        {icon}
      </div>
      <div>
        <p className="font-display text-2xl font-extrabold text-ink break-words">{value}</p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}
