import type { ReactNode } from 'react';
import { PrimaryButton } from './PrimaryButton';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Löschen',
  cancelLabel = 'Abbrechen',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-border bg-surface p-6"
        onClick={(event) => event.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <h3 id="confirm-dialog-title" className="font-display text-xl font-bold text-ink">
          {title}
        </h3>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
        <div className="mt-6 flex gap-3">
          <PrimaryButton variant="ghost" className="h-12 flex-1 border border-border" onClick={onCancel}>
            {cancelLabel}
          </PrimaryButton>
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 flex-1 rounded-2xl bg-danger font-semibold text-white transition hover:brightness-110"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
