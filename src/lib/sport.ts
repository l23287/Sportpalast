import type { Sport } from '../types';
import { SPORTS } from '../types';

// IFCM FS-012 / C03 Farben & Symbole: Symbol für JEDE vordefinierte Sportart (vorher nur Tischtennis und
// Beach Volleyball). Emojis kommen aus der Schrift des Geräts – keine Bilddateien, keine Lizenzkosten.
export const SPORT_EMOJI: Record<string, string> = {
  Tischtennis: '🏓',
  'Beach Volleyball': '🏐',
  Badminton: '🏸',
  Basketball: '🏀',
  Fußball: '⚽',
  'Gym/Fitness': '🏋️',
  Handball: '🤾',
  Leichtathletik: '🏃',
  Schwimmen: '🏊',
  Tennis: '🎾',
  Turnen: '🤸',
  Volleyball: '🏐',
};

// IFCM FS-012 / C03: Akzentfarbe je Sportart. Nur für Akzente (Sportart-Abzeichen, Bereich „Heute“) –
// Hauptbuttons und Layout bleiben im bekannten Blau (Design-Lob A3). Alle Farben sind helle 300/400-Töne,
// damit sie auf dem dunklen Hintergrund (#0a0f1c) gut lesbar sind (Kontrast ≥ 4,5:1, siehe Protokoll FS-012).
// Rot ist bewusst ausgelassen – es ist für „überfällig“ reserviert.
export const SPORT_COLORS: Record<string, string> = {
  Tischtennis: '#38bdf8', // Himmelblau – entspricht dem bisherigen Akzent der App
  'Beach Volleyball': '#facc15', // Sand-Gelb (unterscheidet sich so von Volleyball, gleiches Symbol 🏐)
  Badminton: '#e879f9',
  Basketball: '#fb923c',
  Fußball: '#4ade80', // Rasengrün
  'Gym/Fitness': '#a78bfa',
  Handball: '#f472b6',
  Leichtathletik: '#fbbf24',
  Schwimmen: '#2dd4bf', // Wasser-Türkis
  Tennis: '#a3e635',
  Turnen: '#818cf8',
  Volleyball: '#93c5fd',
};

// IFCM FS-012 / C03: Auswahl an Symbolen für EIGENE Sportarten (beim Anlegen wählbar).
export const CUSTOM_SPORT_EMOJIS = ['🏅', '🏑', '🏒', '🥋', '🚴', '⛳', '🥊', '🧗', '🏇', '⛷️', '🛹', '🏉', '🥏', '🤺', '🛶', '🏄'];

// IFCM FS-012 / C03: Farbpalette für eigene Sportarten – die Farbe wird stabil aus dem Namen berechnet,
// damit eine Sportart immer dieselbe Farbe hat, ohne dass sie gespeichert werden muss.
const CUSTOM_SPORT_COLORS = ['#38bdf8', '#4ade80', '#fbbf24', '#a78bfa', '#f472b6', '#2dd4bf', '#fb923c', '#818cf8'];

/** IFCM FS-012 / C03: Akzentfarbe einer Sportart (vordefiniert oder aus dem Namen berechnet). */
export function sportColor(sport: Sport): string {
  const fixed = SPORT_COLORS[sport];
  if (fixed) return fixed;
  let hash = 0;
  for (const char of sportKey(sport)) hash = (hash * 31 + char.codePointAt(0)!) >>> 0;
  return CUSTOM_SPORT_COLORS[hash % CUSTOM_SPORT_COLORS.length];
}

// IFCM FS-002 / C02: neutrales Symbol für alle Sportarten ohne eigenes Symbol
export const NEUTRAL_SPORT_EMOJI = '🏅';

// IFCM FS-002 / C02: liefert das Symbol einer Sportart, sonst das neutrale Symbol
// IFCM FS-012 / C03: zusätzlich das selbst gewählte Symbol einer eigenen Sportart (customEmojis)
export function sportEmoji(sport: Sport, customEmojis: Record<string, string> = {}): string {
  return SPORT_EMOJI[sport] ?? customEmojis[sport] ?? NEUTRAL_SPORT_EMOJI;
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

// IFCM FS-003 / C04: Sportarten mit Aufschlagtraining. Vorerst nur Tischtennis (Feedback B5: „im Fußball gibt
// es ja gar keinen Aufschlag“). Als Liste angelegt, damit später weitere Sportarten ergänzt werden können.
export const SERVE_TRAINING_SPORTS: Sport[] = ['Tischtennis'];

// IFCM FS-003 / C04: Hat die Sportart ein Aufschlagtraining?
export function hasServeTraining(sport: Sport): boolean {
  return SERVE_TRAINING_SPORTS.includes(sport);
}
