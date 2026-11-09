// IFCM FS-021 / C13b: gespeicherte Stoppuhr-Zeiten – bis zu 10 je Sportart, frei benannt.
// Gespeichert lokal im Browser (Schlüssel „savedTimes“), wie alle anderen Daten. Die Liste enthält ALLE Sportarten;
// nach außen gibt der Hook nur die Zeiten der aktuellen Sportart heraus (gleiches Prinzip wie C01).
import { useEffect, useMemo, useState } from 'react';
import { useSport } from '../context/SportContext';
import { generateId } from '../lib/id';
import { loadJSON, saveJSON } from '../lib/storage';

export interface SavedTime {
  id: string;
  sport: string;
  name: string; // frei von der Nutzer:in vergeben
  timeMs: number; // Gesamtzeit
  splits: number[]; // Zwischenzeiten (für die Runden/Bahnen/…)
  createdAt: string;
}

/** Höchstens so viele Zeiten je Sportart (Wunsch der Entwickler:in). */
export const MAX_SAVED_TIMES = 10;
export const MAX_TIME_NAME = 60;

/** Name aufbereiten; leer → automatischer Name mit Datum und Uhrzeit. */
function cleanName(name: string, createdAt: Date): string {
  const trimmed = name.trim().replace(/\s+/g, ' ').slice(0, MAX_TIME_NAME);
  if (trimmed) return trimmed;
  return `Zeit vom ${createdAt.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}, ${createdAt.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;
}

export function useSavedTimes() {
  const { sport } = useSport();
  const [all, setAll] = useState<SavedTime[]>(() => loadJSON<SavedTime[]>('savedTimes', []));
  useEffect(() => saveJSON('savedTimes', all), [all]);

  // neueste zuerst, nur aktuelle Sportart
  const times = useMemo(
    () => all.filter((t) => t.sport === sport).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [all, sport],
  );
  const isFull = times.length >= MAX_SAVED_TIMES;

  return {
    times,
    isFull,
    /** Variante a: bei 10 Zeiten ist Speichern gesperrt (Rückgabe false) – nichts wird überschrieben. */
    saveTime: (name: string, timeMs: number, splits: number[]): boolean => {
      if (isFull || timeMs <= 0) return false;
      const now = new Date();
      setAll((prev) => [
        ...prev,
        { id: generateId(), sport, name: cleanName(name, now), timeMs, splits, createdAt: now.toISOString() },
      ]);
      return true;
    },
    renameTime: (id: string, name: string) =>
      setAll((prev) =>
        prev.map((t) => (t.id === id ? { ...t, name: cleanName(name, new Date(t.createdAt)) } : t)),
      ),
    deleteTime: (id: string) => setAll((prev) => prev.filter((t) => t.id !== id)),
  };
}
