interface ImpressumDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ImpressumDialog({ open, onClose }: ImpressumDialogProps) {
  if (!open) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-border bg-surface p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="impressum-dialog-title"
      >
        <h3 id="impressum-dialog-title" className="font-display text-xl font-bold text-ink">
          Impressum
        </h3>
        <div className="mt-3 flex flex-col gap-1 text-sm text-muted">
          <p>Lorelei Hermann</p>
          <p>Rantzaustraße 52</p>
          <p>Ahrensburg</p>
          <p className="mt-2">
            <a href="mailto:hermannlorelei@gmail.com" className="text-accent">
              hermannlorelei@gmail.com
            </a>
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 h-12 w-full rounded-2xl border border-border text-sm font-semibold text-ink transition hover:bg-surface-2"
        >
          Schließen
        </button>
      </div>
    </div>
  );
}
