import type { Sport } from '../types';

export const SPORT_EMOJI: Record<Sport, string> = {
  Tischtennis: '🏓',
  'Beach Volleyball': '🏐',
};

export const DEFAULT_SPORT: Sport = 'Tischtennis';

// IFCM FS-001 / C01 Sportart-Trennung: Daten aus der Zeit vor der Sportart-Trennung (ohne Feld `sport`)
// stammen aus der ursprünglichen Tischtennis-App und werden deshalb Tischtennis zugeordnet.
export const LEGACY_SPORT: Sport = 'Tischtennis';

// IFCM FS-001 / C01: Ergänzt bei gespeicherten Einträgen ohne Sportart die Sportart LEGACY_SPORT.
// Einträge, die bereits eine Sportart haben, bleiben unverändert (auch künftige eigene Sportarten aus C02).
export function withSport<T extends { sport?: Sport }>(items: T[]): (T & { sport: Sport })[] {
  return items.map((item) => (item.sport ? (item as T & { sport: Sport }) : { ...item, sport: LEGACY_SPORT }));
}
