import type { ReactNode } from 'react';

interface OnboardingBlobProps {
  hero: ReactNode;
  accents: [ReactNode, ReactNode, ReactNode];
}

const ACCENT_STYLES = ['-left-2 top-10 -rotate-6', '-right-1 top-0 rotate-6', 'right-6 -bottom-3 -rotate-3'];

export function OnboardingBlob({ hero, accents }: OnboardingBlobProps) {
  return (
    <div className="relative mx-auto h-64 w-64 shrink-0">
      <div className="absolute inset-10 rounded-full bg-primary opacity-30 blur-[55px]" aria-hidden="true" />

      <svg viewBox="0 0 256 256" className="animate-blob-float absolute inset-0" aria-hidden="true">
        <path
          d="M 22 200 C 12 88 68 8 140 12 C 197 15 233 68 233 146"
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity="0.55"
          strokeWidth="2.5"
          strokeDasharray="1 9"
          strokeLinecap="round"
        />
        <circle cx="233" cy="146" r="5" fill="var(--color-accent)" />
      </svg>

      <div
        className="absolute top-[202px] left-1/2 h-11 w-7 -translate-x-1/2 rounded-t-md rounded-b-2xl bg-gradient-to-b from-surface-2 to-bg-soft"
        aria-hidden="true"
      />

      <div
        className="absolute inset-x-8 top-6 h-48 rounded-full shadow-[0_25px_50px_rgba(8,15,30,0.55)] ring-[6px] ring-bg-soft"
        style={{
          background:
            'linear-gradient(115deg, var(--color-primary) 0%, var(--color-primary-dark) 47%, var(--color-accent-dark) 53%, var(--color-accent) 100%)',
        }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bg/25 text-white backdrop-blur-sm">
            {hero}
          </div>
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
