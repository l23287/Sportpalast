import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  active?: boolean;
}

export function IconButton({ icon, label, active, className = '', ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full border transition shrink-0 ${
        active
          ? 'bg-gradient-to-br from-primary to-primary-dark border-transparent text-white'
          : 'bg-surface border-border text-ink hover:bg-surface-2'
      } ${className}`}
      {...rest}
    >
      {icon}
    </button>
  );
}
