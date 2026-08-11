import type { SVGProps } from "react";
import { useSport } from "../context/SportContext";

/**
 * TrainerPro Bildmarke.
 * - <TrainerProMark /> : farbige Marke (Verlauf)
 * - <TrainerProMark mono /> : einfarbig, nimmt currentColor
 */
export function TrainerProMark({ mono = false, ...props }: SVGProps<SVGSVGElement> & { mono?: boolean }) {
  const id = mono ? undefined : "tp";
  return (
    <svg viewBox="12 14 82 66" role="img" aria-label="TrainerPro" {...props}>
      {!mono && (
        <defs>
          <linearGradient id={`${id}-light`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7dd3fc" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id={`${id}-deep`} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
      )}
      <polygon points="34,18 62,18 57,34 26,44" fill={mono ? "currentColor" : `url(#${id}-light)`} />
      <polygon points="26,44 57,34 44,78 16,78" fill={mono ? "currentColor" : `url(#${id}-deep)`} />
      <polygon points="70,18 84,18 66,78 52,78" fill={mono ? "currentColor" : `url(#${id}-bar)`} />
      <circle cx="90" cy="26" r="6.5" fill={mono ? "currentColor" : "#7dd3fc"} />
    </svg>
  );
}

/** Horizontale Wortmarke: Bildmarke + Schriftzug (Kanit 900 italic). */
export function TrainerProLockup({ tagline = true }: { tagline?: boolean }) {
  const { sport } = useSport();
  return (
    <span className="inline-flex items-center gap-4">
      <TrainerProMark className="h-12 w-auto" />
      <span className="flex flex-col gap-1">
        <span
          className="relative text-white leading-none"
          style={{ fontFamily: "Kanit, sans-serif", fontStyle: "italic", fontWeight: 900, fontSize: "2rem", letterSpacing: "0.005em" }}
        >
          TRAINERPRO
        </span>
        {tagline && (
          <span className="text-[10px] tracking-[0.26em] text-[#a1b1d1]">
            {sport.toUpperCase()} · TRAINING
          </span>
        )}
      </span>
    </span>
  );
}
