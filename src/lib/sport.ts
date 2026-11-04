import type { Sport } from '../types';
import { SPORTS } from '../types';

// IFCM FS-002 / C02: Symbole gibt es (wie bisher) nur für die zwei ursprünglichen Sportarten.
// Passende Symbole für alle Sportarten sind Thema von C03 – bis dahin bekommen neue Sportarten ein
// neutrales Symbol (siehe sportEmoji).
export const SPORT_EMOJI: Record<string, string> = {
  Tischtennis: '🏓',
  'Beach Volleyball': '🏐',
};

// IFCM FS-002 / C02: neutrales Symbol für alle Sportarten ohne eigenes Symbol
export const NEUTRAL_SPORT_EMOJI = '🏅';

// IFCM FS-002 / C02: liefert das Symbol einer Sportart, sonst das neutrale Symbol
export function sportEmoji(sport: Sport): string {
  return SPORT_EMOJI[sport] ?? NEUTRAL_SPORT_EMOJI;
}

// IFCM FS-002 / C02: maximale Länge eines eigenen Sportartnamens (passt in Kopfzeile und Auswahl-Buttons)
export const MAX_SPORT_NAME_LENGTH = 30;

// IFCM FS-002 / C02: Vergleichsschlüssel, damit „fußball“, „Fußball“ und „ Fußball “ als gleich gelten
export function sportKey(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase('de-DE');
}

// IFCM FS-002 / C02: Prüft den Namen einer neuen eigenen Sportart.
// Rückgabe: Fehlermeldung (string) oder null, wenn der Name gültig ist.
export function validateSportName(name: string, existing: Sport[]): string | null {
  const cleaned = name.trim().replace(/\s+/g, ' ');
  if (!cleaned) return 'Bitte gib einen Namen für die Sportart ein.';
  if (cleaned.length > MAX_SPORT_NAME_LENGTH) {
    return `Der Name darf höchstens ${MAX_SPORT_NAME_LENGTH} Zeichen lang sein.`;
  }
  if (existing.some((sport) => sportKey(sport) === sportKey(cleaned))) {
    return 'Diese Sportart gibt es bereits.';
  }
  return null;
}

// IFCM FS-002 / C02: vordefinierte Sportarten können nicht gelöscht werden
export function isPredefinedSport(sport: Sport): boolean {
  return SPORTS.includes(sport);
}

export const DEFAULT_SPORT: Sport = 'Tischtennis';

// IFCM FS-001 / C01 Sportart-Trennung: Daten aus der Zeit vor der Sportart-Trennung (ohne Feld `sport`)
// stammen aus der ursprünglichen Tischtennis-App und werden deshalb Tischtennis zugeordnet.
export const LEGACY_SPORT: Sport = 'Tischtennis';

// IFCM FS-001 / C01: Ergänzt bei gespeicherten Einträgen ohne Sportart die Sportart LEGACY_SPORT.
// Einträge, die bereits eine Sportart haben, bleiben unverändert (auch künftige eigene Sportarten aus C02).
export function withSport<T extends { sport?: Sport }>(items: T[]): (T & { sport: Sport })[] {
  return items.map((item) => (item.sport ? (item as T & { sport: Sport }) : { ...item, sport: LEGACY_SPORT }));
}
