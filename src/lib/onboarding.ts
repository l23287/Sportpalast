const KEY = 'trainerpro:onboarding-seen';

export function hasSeenOnboarding(): boolean {
  return localStorage.getItem(KEY) === '1';
}

export function markOnboardingSeen(): void {
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    // Speicher nicht verfügbar – Onboarding wird beim nächsten Besuch erneut gezeigt.
  }
}
