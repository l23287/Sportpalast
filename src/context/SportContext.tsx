import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SPORTS, type Sport } from '../types';
import { DEFAULT_SPORT, sportKey, validateSportName } from '../lib/sport';
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
  addCustomSport: (name: string) => string | null;
  // IFCM FS-002 / C02: entfernt eine eigene Sportart aus der Liste (Daten löscht der AppDataContext)
  removeCustomSport: (name: Sport) => void;
}

const SportContext = createContext<SportContextValue | null>(null);

export function SportProvider({ children }: { children: ReactNode }) {
  // IFCM FS-002 / C02: eigene Sportarten werden wie alle anderen Daten lokal im Browser gespeichert
  const [customSports, setCustomSports] = useState<Sport[]>(() => loadJSON<Sport[]>('customSports', []));
  const [storedSport, setSport] = useState<Sport>(() => loadJSON<Sport>('sport', DEFAULT_SPORT));

  const sports = useMemo(() => [...SPORTS, ...customSports], [customSports]);

  // IFCM FS-002 / C02: Sicherheitsnetz – ist die gespeicherte Sportart nicht (mehr) in der Liste
  // (z. B. gelöschte eigene Sportart), wird auf die Standard-Sportart zurückgefallen.
  const sport = sports.includes(storedSport) ? storedSport : DEFAULT_SPORT;

  useEffect(() => saveJSON('sport', sport), [sport]);
  useEffect(() => saveJSON('customSports', customSports), [customSports]);

  const value = useMemo<SportContextValue>(
    () => ({
      sport,
      setSport,
      sports,
      customSports,
      addCustomSport: (name) => {
        const error = validateSportName(name, sports);
        if (error) return error;
        const cleaned = name.trim().replace(/\s+/g, ' ');
        setCustomSports((prev) => [...prev, cleaned]);
        setSport(cleaned); // neue Sportart direkt als eigenen Bereich öffnen
        return null;
      },
      removeCustomSport: (name) => {
        setCustomSports((prev) => prev.filter((s) => sportKey(s) !== sportKey(name)));
        if (sportKey(sport) === sportKey(name)) setSport(DEFAULT_SPORT);
      },
    }),
    [sport, sports, customSports],
  );

  return <SportContext.Provider value={value}>{children}</SportContext.Provider>;
}

export function useSport(): SportContextValue {
  const ctx = useContext(SportContext);
  if (!ctx) throw new Error('useSport must be used within SportProvider');
  return ctx;
}
