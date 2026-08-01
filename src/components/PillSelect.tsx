import { labelClass } from '../lib/formStyles';

interface PillSelectProps<T extends string> {
  label: string;
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
}

export function PillSelect<T extends string>({ label, options, value, onChange }: PillSelectProps<T>) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`h-11 rounded-2xl border px-5 text-sm font-semibold transition ${
              value === option
                ? 'border-transparent bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_8px_18px_rgba(37,99,235,0.3)]'
                : 'border-border bg-bg-soft text-muted hover:text-ink'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
