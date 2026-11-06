const KEY = 'trainerpro:onboarding-seen';

// IFCM FS-015 / C10: Version der Einführung. Bisher wurde nur „1“ (gesehen) gespeichert. Mit der neuen Einführung
// gilt eine Person erst als „durch“, wenn sie Version 2 gesehen hat – so bekommen auch bestehende Nutzer:innen
// (z. B. die Testgruppen) die neue Einführung nach dem Update genau EINMAL automatisch zu sehen.
export const ONBOARDING_VERSION = '2';

export function hasSeenOnboarding(): boolean {
  try {
    return localStorage.getItem(KEY) === ONBOARDING_VERSION; // IFCM FS-015 / C10: Version statt nur „1“
  } catch {
    return true; // Speicher nicht verfügbar: lieber nicht bei jedem Aufruf die Einführung erzwingen
  }
}

export function markOnboardingSeen(): void {
  try {
    localStorage.setItem(KEY, ONBOARDING_VERSION); // IFCM FS-015 / C10
  } catch {
    // Speicher nicht verfügbar – Onboarding wird beim nächsten Besuch erneut gezeigt.
  }
}
