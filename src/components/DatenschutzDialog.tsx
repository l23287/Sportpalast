interface DatenschutzDialogProps {
  open: boolean;
  onClose: () => void;
}

export function DatenschutzDialog({ open, onClose }: DatenschutzDialogProps) {
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
        aria-labelledby="datenschutz-dialog-title"
      >
        <h3 id="datenschutz-dialog-title" className="font-display text-xl font-bold text-ink">
          Datenschutz
        </h3>
        <div className="mt-3 flex flex-col gap-3 text-sm text-muted">
          <p>Diese Website ist ein privates, nicht-kommerzielles Testprojekt.</p>
          <p>
            Es werden keine personenbezogenen Daten an einen Server übertragen oder von uns gespeichert. Alle
            Eingaben (z. B. Trainingspläne, Übungen) verbleiben ausschließlich lokal im Speicher deines Browsers
            auf deinem eigenen Gerät.
          </p>
          <p>Es findet kein Tracking, keine Analyse-Software und keine Cookies zu Werbezwecken statt.</p>
          <p>
            Da es sich um ein privates Testprojekt handelt, wird keine Gewähr für eine vollständige
            DSGVO-Konformität übernommen. Bei Fragen wende dich an{' '}
            <a href="mailto:hermannlorelei@gmail.com" className="text-accent">
              hermannlorelei@gmail.com
            </a>
            .
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
