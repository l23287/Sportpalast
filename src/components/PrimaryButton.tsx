import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'solid' | 'accent' | 'ghost' | 'danger';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  fullWidth?: boolean;
  pill?: boolean;
}

const variantClasses: Record<Variant, string> = {
  solid:
    'text-white bg-gradient-to-br from-primary to-primary-dark shadow-[0_10px_25px_rgba(37,99,235,0.35)] hover:brightness-110 active:brightness-95',
  accent:
    'text-[#04263f] bg-gradient-to-br from-accent to-accent-dark shadow-[0_10px_25px_rgba(56,189,248,0.3)] hover:brightness-110 active:brightness-95',
  ghost: 'text-muted bg-transparent hover:bg-surface hover:text-ink',
  danger: 'text-danger bg-transparent hover:bg-danger/10',
};

export function PrimaryButton({
  variant = 'solid',
  icon,
  fullWidth,
  pill,
  className = '',
  children,
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 h-14 ${pill ? 'rounded-full' : 'rounded-2xl'} px-6 font-semibold transition disabled:opacity-50 disabled:pointer-events-none ${
        fullWidth ? 'w-full' : ''
      } ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
