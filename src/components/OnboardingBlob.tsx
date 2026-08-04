import type { ReactNode } from 'react';

interface OnboardingBlobProps {
  hero: ReactNode;
  accents: [ReactNode, ReactNode, ReactNode];
}

const ACCENT_STYLES = ['-left-3 top-6 -rotate-6', '-right-2 top-2 rotate-6', 'right-3 -bottom-2 -rotate-3'];

export function OnboardingBlob({ hero, accents }: OnboardingBlobProps) {
  return (
    <div className="relative mx-auto h-60 w-60 shrink-0">
      <div className="absolute inset-8 rounded-full bg-primary opacity-30 blur-[55px]" aria-hidden="true" />

      <div
        className="animate-blob-float absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary-soft to-surface-2"
        aria-hidden="true"
      />
      <div className="absolute inset-5 rounded-[2rem] border border-border/50" aria-hidden="true" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_20px_45px_rgba(37,99,235,0.4)]">
          {hero}
        </div>
      </div>

      {accents.map((accent, index) => (
        <div
          key={ACCENT_STYLES[index]}
          className={`absolute flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface text-accent shadow-[0_10px_20px_rgba(0,0,0,0.3)] ${ACCENT_STYLES[index]}`}
        >
          {accent}
        </div>
      ))}
    </div>
  );
}
