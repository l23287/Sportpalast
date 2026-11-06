import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SPORTS, type Sport } from '../types';
import { DEFAULT_SPORT, NEUTRAL_SPORT_EMOJI, sportColor, sportEmoji, sportKey, validateSportName } from '../lib/sport';
import { loadJSON, saveJSON } from '../lib/storage';

interface SportContextValue {
  sport: Sport;
  setSport: (sport: Sport) => void;
  // IFCM FS-002 / C02: alle wählbaren Sportarten = vordefinierte + eigene
  sports: Sport[];
  // IFCM FS-002 / C02: nur die selbst angelegten Sportarten
  customSports: Sport[];
  // IFCM FS-002 / C02: legt eine eigene Sportart an und wählt sie direkt aus.
  // Rückgabe: Fehlermeldung oder null bei Erfolg.
  // IFCM FS-012 / C03: optional mit selbst gewähltem Symbol
  addCustomSport: (name: string, emoji?: string) => string | null;
  // IFCM FS-002 / C02: entfernt eine eigene Sportart aus der Liste (Daten löscht der AppDataContext)
  removeCustomSport: (name: Sport) => void;
  // IFCM FS-013 / C09: Reihenfolge der Sportart-Kacheln ändern (Skizze „verschiebbar in Reihenfolge“)
  moveSport: (name: Sport, direction: -1 | 1) => void;
  // IFCM FS-012 / C03: Symbol und Akzentfarbe – für die aktuelle Sportart und für jede beliebige
  emoji: string;
  color: string;
  emojiFor: (sport: Sport) => string;
  colorFor: (sport: Sport) => string;
}

const SportContext = createContext<SportContextValue | null>(null);

export function SportProvider({ children }: { children: ReactNode }) {
  // IFCM FS-002 / C02: eigene Sportarten werden wie alle anderen Daten lokal im Browser gespeichert
  const [customSports, setCustomSports] = useState<Sport[]>(() => loadJSON<Sport[]>('customSports', []));
  const [storedSport, setSport] = useState<Sport>(() => loadJSON<Sport>('sport', DEFAULT_SPORT));
  // IFCM FS-012 / C03: gewählte Symbole eigener Sportarten (Name → Emoji), getrennt gespeichert, damit die
  // Liste `customSports` aus C02 unverändert bleibt (keine Datenumwandlung nötig)
  const [customSportEmojis, setCustomSportEmojis] = useState<Record<string, string>>(() =>
    loadJSON<Record<string, string>>('customSportEmojis', {}),
  );

  // IFCM FS-013 / C09: gespeicherte Reihenfolge der Sportarten. Nicht enthaltene (z. B. neue) Sportarten
  // kommen in ihrer natürlichen Reihenfolge ans Ende – so bleibt die Liste ohne Umwandlung gültig.
  const [sportOrder, setSportOrder] = useState<Sport[]>(() => loadJSON<Sport[]>('sportOrder', []));
  useEffect(() => saveJSON('sportOrder', sportOrder), [sportOrder]);

  const sports = useMemo(() => {
    const all = [...SPORTS, ...customSports];
    const rank = (s: Sport) => {
      const index = sportOrder.indexOf(s);
      return index === -1 ? sportOrder.length + all.indexOf(s) : index;
    };
    return [...all].sort((a, b) => rank(a) - rank(b));
  }, [customSports, sportOrder]);

  // IFCM FS-002 / C02: Sicherheitsnetz – ist die gespeicherte Sportart nicht (mehr) in der Liste
  // (z. B. gelöschte eigene Sportart), wird auf die Standard-Sportart zurückgefallen.
  const sport = sports.includes(storedSport) ? storedSport : DEFAULT_SPORT;

  useEffect(() => saveJSON('sport', sport), [sport]);
  useEffect(() => saveJSON('customSports', customSports), [customSports]);
  useEffect(() => saveJSON('customSportEmojis', customSportEmojis), [customSportEmojis]);

  // IFCM FS-012 / C03: Akzentfarbe der aktuellen Sportart als CSS-Variable --color-sport setzen.
  // Alle Tailwind-Klassen wie `text-sport`, `bg-sport/15`, `border-sport/40` folgen damit automatisch der Sportart.
  const color = sportColor(sport);
  useEffect(() => {
    document.documentElement.style.setProperty('--color-sport', color);
  }, [color]);

  const value = useMemo<SportContextValue>(
    () => ({
      sport,
      setSport,
      sports,
      customSports,
      addCustomSport: (name, emoji) => {
        const error = validateSportName(name, sports);
        if (error) return error;
        const cleaned = name.trim().replace(/\s+/g, ' ');
        setCustomSports((prev) => [...prev, cleaned]);
        // IFCM FS-012 / C03: gewähltes Symbol merken (das neutrale 🏅 muss nicht gespeichert werden)
        if (emoji && emoji !== NEUTRAL_SPORT_EMOJI) setCustomSportEmojis((prev) => ({ ...prev, [cleaned]: emoji }));
        setSport(cleaned); // neue Sportart direkt als eigenen Bereich öffnen
        return null;
      },
      removeCustomSport: (name) => {
        setCustomSports((prev) => prev.filter((s) => sportKey(s) !== sportKey(name)));
        // IFCM FS-012 / C03: Symbol der gelöschten Sportart ebenfalls entfernen
        setCustomSportEmojis((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => key !== name)));
        if (sportKey(sport) === sportKey(name)) setSport(DEFAULT_SPORT);
      },
      // IFCM FS-013 / C09: eine Position nach oben (-1) oder unten (+1); gespeichert wird die komplette Reihenfolge
      moveSport: (name, direction) => {
        const index = sports.indexOf(name);
        const target = index + direction;
        if (index === -1 || target < 0 || target >= sports.length) return;
        const next = [...sports];
        [next[index], next[target]] = [next[target], next[index]];
        setSportOrder(next);
      },
      // IFCM FS-012 / C03
      emoji: sportEmoji(sport, customSportEmojis),
      color,
      emojiFor: (target) => sportEmoji(target, customSportEmojis),
      colorFor: sportColor,
    }),
    [sport, sports, customSports, customSportEmojis, color],
  );

  return <SportContext.Provider value={value}>{children}</SportContext.Provider>;
}

export function useSport(): SportContextValue {
  const ctx = useContext(SportContext);
  if (!ctx) throw new Error('useSport must be used within SportProvider');
  return ctx;
}
