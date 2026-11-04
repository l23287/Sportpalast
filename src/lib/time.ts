// IFCM FS-009 / C07: formatDuration erwartet jetzt SEKUNDEN (vorher Minuten).
// Beispiele: 10 → „10 Sek.“, 90 → „1 Min. 30 Sek.“, 900 → „15 Min.“, 3900 → „1 Std. 5 Min.“
// Teile mit 0 werden weggelassen; 0 Sekunden ergibt „0 Min.“ (z. B. leerer Plan).
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  if (safe === 0) return '0 Min.';
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const parts: string[] = [];
  if (hours) parts.push(`${hours} Std.`);
  if (minutes) parts.push(`${minutes} Min.`);
  if (seconds) parts.push(`${seconds} Sek.`);
  return parts.join(' ');
}

export function formatCountdown(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startOfDay(date: Date): number {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.getTime();
}

export function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return startOfDay(new Date(dateStr)) < startOfDay(new Date());
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
