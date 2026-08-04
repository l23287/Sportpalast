import type { ReactNode } from 'react';

interface OnboardingIllustrationProps {
  hero: ReactNode;
  accents: [ReactNode, ReactNode, ReactNode];
}

const ACCENT_STYLES = [
  '-left-2 top-2 -rotate-6',
  'right-2 top-10 rotate-6',
  'left-12 -bottom-1 -rotate-3',
];

const CONFETTI = [
  'left-6 top-0 h-2 w-2 rounded-full bg-white/70',
  'right-10 top-4 h-3 w-3 rotate-12 rounded-sm bg-sun/70',
  'right-0 top-28 h-2 w-2 rounded-full bg-white/50',
  'left-0 bottom-16 h-2.5 w-2.5 -rotate-12 rounded-sm bg-accent/70',
  'right-16 bottom-2 h-1.5 w-1.5 rounded-full bg-white/60',
  'left-24 top-4 h-1.5 w-1.5 rounded-full bg-white/50',
];

export function OnboardingIllustration({ hero, accents }: OnboardingIllustrationProps) {
  return (
    <div className="relative mx-auto h-56 w-full max-w-[280px]">
      {CONFETTI.map((cls) => (
        <span key={cls} className={`absolute ${cls}`} aria-hidden="true" />
      ))}

      <svg viewBox="0 0 280 224" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <ellipse cx="140" cy="192" rx="78" ry="13" fill="black" opacity="0.18" />
        <polygon points="140,54 210,92 140,130 70,92" fill="var(--color-sun)" />
        <polygon points="70,92 140,130 140,186 70,148" fill="var(--color-accent)" />
        <polygon points="140,130 210,92 210,148 140,186" fill="var(--color-accent-dark)" />
      </svg>

      <div className="absolute left-1/2 top-[34%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-white text-primary-dark shadow-[0_15px_30px_rgba(8,15,45,0.35)]">
        {hero}
      </div>

      {accents.map((accent, index) => (
        <div
          key={ACCENT_STYLES[index]}
          className={`absolute flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-white backdrop-blur-sm ${ACCENT_STYLES[index]}`}
        >
          {accent}
        </div>
      ))}
    </div>
  );
}
