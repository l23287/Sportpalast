import type { ReactNode } from 'react';

interface OnboardingBlobProps {
  icon: ReactNode;
}

export function OnboardingBlob({ icon }: OnboardingBlobProps) {
  return (
    <div className="relative mx-auto flex h-56 w-56 shrink-0 items-center justify-center">
      <div className="absolute inset-4 rounded-full bg-primary opacity-40 blur-[50px]" aria-hidden="true" />
      <div className="animate-blob-float absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 180deg, var(--color-primary), var(--color-accent), var(--color-sun), var(--color-primary-dark), var(--color-primary))',
          }}
        />
        <div className="absolute inset-[16px] rounded-full bg-bg" />
      </div>
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-surface text-accent shadow-[0_0_30px_rgba(59,130,246,0.35)]">
        {icon}
      </div>
    </div>
  );
}
