import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-surface p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 id="modal-title" className="font-display text-xl font-bold text-ink">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-bg-soft text-muted transition hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
