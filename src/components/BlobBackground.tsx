export function BlobBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="animate-blob-float absolute -top-16 -left-10 h-72 w-72 rounded-full bg-primary opacity-45 blur-[60px]" />
      <div
        className="animate-blob-float absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-accent opacity-45 blur-[60px]"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="animate-blob-float absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-sun opacity-45 blur-[60px]"
        style={{ animationDelay: '4s' }}
      />
    </div>
  );
}
