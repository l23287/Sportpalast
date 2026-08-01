import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Suchen…', className = '' }: SearchInputProps) {
  return (
    <div
      className={`flex h-12 items-center gap-2 rounded-2xl border border-border bg-surface px-4 ${className}`}
    >
      <Search size={18} className="shrink-0 text-muted-2" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-muted-2"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Suche löschen"
          className="shrink-0 text-muted-2 transition hover:text-ink"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
