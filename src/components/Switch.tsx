// IFCM FS-016 / C15: barrierefreier Ein/Aus-Schalter (role="switch"), z. B. für „Ziele verwenden“.
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string; // sichtbare Beschriftung, zugleich Name für Screenreader
  description?: string;
}

export function Switch({ checked, onChange, label, description }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-4 rounded-2xl border border-border bg-bg-soft px-4 py-3 text-left transition hover:border-primary/60"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted">{description}</span>}
      </span>
      {/* Schiene + Knopf; „An“ in Primärblau, Zustand zusätzlich als Text (nicht nur über Farbe erkennbar) */}
      <span className="flex shrink-0 items-center gap-2 text-xs font-semibold text-muted">
        {checked ? 'An' : 'Aus'}
        <span
          aria-hidden="true"
          className={`relative h-7 w-12 rounded-full transition ${checked ? 'bg-primary' : 'bg-surface-2'}`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-6' : 'left-1'}`}
          />
        </span>
      </span>
    </button>
  );
}
