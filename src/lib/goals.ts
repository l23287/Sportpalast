// IFCM FS-013 / C09 Zielsetzungstool: Regeln und Hilfsfunktionen für Ziele nach der SMART-Methode.
//
// Grundlage (gelesen am 06.11.2026): karrierebibel.de/smart-methode – SMART = Spezifisch, Messbar, Attraktiv,
// Realistisch, Terminiert; Empfehlung „auf maximal drei Kernziele fokussieren“; Praxistipps: Aufschreiben,
// Visualisieren, Kontrollieren, Anpassen, Feiern. Die Methode geht auf Peter Drucker („Management by Objectives“) zurück.
// Die Prüfung unten ist bewusst nur ein HINWEIS (Heuristik): Die Kriterien lassen sich laut Quelle unterschiedlich
// auslegen, deshalb blockiert die App kein Ziel, sondern zeigt, welche Kriterien schon erkennbar erfüllt sind.
import type { Goal } from '../types';

/** Höchstens 3 offene Kernziele je Sportart (Quelle: „maximal drei Kernziele“; Mindmap: „max. 3 Kernziele“). */
export const MAX_OPEN_GOALS = 3;
export const MAX_GOAL_TEXT = 140;
export const MAX_GOAL_MEASURE = 80;

/** Datenschutz-Hinweis wie bei den Notizen (C08): Ziele sind Ziele der Trainer:innen. */
export const GOAL_PRIVACY_HINT = 'Bitte keine Namen oder persönlichen Daten von Sportler:innen eintragen.';

// IFCM FS-018 / C16: Beispielziele je Sportart stehen jetzt in lib/sportExamples.ts (examplesFor(sport).goals).

export interface SmartCheck {
  S: boolean; // Spezifisch
  M: boolean; // Messbar
  A: boolean; // Attraktiv
  R: boolean; // Realistisch
  T: boolean; // Terminiert
}

export const SMART_LABELS: Record<keyof SmartCheck, { name: string; hint: string }> = {
  S: { name: 'Spezifisch', hint: 'Was genau soll bis wann von wem erreicht werden? Konkret statt vage.' },
  M: { name: 'Messbar', hint: 'Woran erkennst du den Erfolg? Zahl, Anzahl, Zeit oder Ersatzgröße angeben.' },
  A: { name: 'Attraktiv', hint: 'Positiv formulieren („Ich möchte …“ statt „Ich will nicht mehr …“).' },
  R: { name: 'Realistisch', hint: 'Herausfordernd, aber mit Zeit, Know-how und Mitteln machbar? Ehrlich prüfen.' },
  T: { name: 'Terminiert', hint: 'Ein Zieldatum setzen – die Deadline spornt an und ist Kontrollpunkt.' },
};

type GoalDraft = Pick<Goal, 'text' | 'measure' | 'realistic' | 'dueDate'>;

// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
// IFCM FS-014 / C09a: Validierung der SMART-Kriterien – ausführlich erklärt
//
// Grundsatz: Eine App kann nicht „verstehen“, ob ein Ziel wirklich spezifisch oder realistisch ist. Jede Prüfung
// unten ist daher eine einfache, nachvollziehbare REGEL (Heuristik), die typische Merkmale eines guten Ziels
// erkennt. Ergebnis ist true („erkennbar erfüllt“) oder false („noch offen“). Die Kacheln im Formular zeigen das an;
// ein Ziel wird NIE wegen eines offenen Kriteriums abgelehnt (Quelle: Kriterien sind unterschiedlich auslegbar).
// Jede Prüfung ist eine eigene Funktion, damit sie einzeln getestet und später verfeinert werden kann.
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Zerlegt einen Text in Wörter (Folgen von Buchstaben/Ziffern, inkl. Umlaute und ß). */
function words(text: string): string[] {
  return text.match(/[\p{L}\p{N}]+/gu) ?? [];
}

/** Mindestzahl an Wörtern für „spezifisch“. */
const MIN_SPECIFIC_WORDS = 5;

/**
 * S – Spezifisch
 * Regel: Das Ziel hat mindestens 5 Wörter.
 * Warum: Vage Ziele sind fast immer sehr kurz („Besser werden“, „Mehr Kondition“ – 2 Wörter). Ein spezifisches Ziel
 *        beantwortet „Was genau soll bis wann von wem erreicht werden?“ und braucht dafür zwangsläufig mehr Wörter
 *        („Meine U12 spielt den Aufschlag sicher ins Feld“ – 8 Wörter).
 * Grenze: Ein langer, aber schwammiger Satz wird ebenfalls als erfüllt erkannt. Deshalb zeigt der Tipp zusätzlich
 *         die Leitfrage der Quelle.
 */
export function checkSpecific(text: string): boolean {
  return words(text).length >= MIN_SPECIFIC_WORDS;
}

/** Zahlwörter, die eine Menge ausdrücken („zwei Einheiten pro Woche“). „ein/eine“ fehlt bewusst – zu häufig als Artikel. */
const NUMBER_WORDS = new Set([
  'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf',
  'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'hundert', 'hälfte', 'doppelt', 'verdoppeln',
]);

/**
 * M – Messbar
 * Regel: erfüllt, wenn (a) das Feld „Woran misst du den Erfolg?“ ausgefüllt ist ODER (b) im Ziel eine Ziffer
 *        („8 von 10“, „3×“, „20 %“) ODER (c) ein Zahlwort („zwei Einheiten“) vorkommt.
 * Warum: Laut Quelle muss man rückblickend feststellen können, ob das Ziel erreicht ist – das gelingt mit Zahlen,
 *        Mengen, Zeiten oder einer ausdrücklich genannten Ersatzgröße (dafür das eigene Feld).
 * Grenze: Eine Zahl, die nur ein Datum ist („bis 2027“), zählt ebenfalls – das Datum gehört eigentlich zu „T“.
 */
export function checkMeasurable(text: string, measure: string): boolean {
  if (measure.trim().length > 0) return true; // (a)
  if (/\d/.test(text)) return true; // (b)
  return words(text).some((word) => NUMBER_WORDS.has(word.toLocaleLowerCase('de-DE'))); // (c)
}

/** Verneinungen bzw. Vermeidungswörter, die auf ein negativ formuliertes Ziel hindeuten. */
const NEGATIVE_WORDS = new Set(['nicht', 'kein', 'keine', 'keinen', 'keinem', 'keiner', 'nie', 'niemals', 'nichts', 'aufhören', 'vermeiden', 'weniger']);

/**
 * A – Attraktiv
 * Regel: Das Ziel ist ausgefüllt und weder Ziel noch Messgröße enthalten ein Verneinungs-/Vermeidungswort
 *        (nicht, kein…, nie, niemals, nichts, aufhören, vermeiden, weniger).
 * Warum: Die Quelle empfiehlt positive Formulierungen: „Ich möchte finanziell unabhängig werden“ motiviert mehr als
 *        „Ich will nicht mehr arm sein“. Ob ein Ziel jemanden persönlich reizt, kann die App nicht prüfen – die
 *        Formulierung schon.
 * Technik: Verglichen werden ganze Wörter (über words()), daher löst „Nichtschwimmer“ oder „Keiler“ KEINEN
 *          Treffer aus – anders als eine einfache Textsuche.
 * Grenze: Doppelte Verneinungen oder Formulierungen wie „ohne Fehler“ werden nicht erkannt.
 */
export function checkAttractive(text: string, measure: string): boolean {
  if (text.trim().length === 0) return false;
  return !words(`${text} ${measure}`).some((word) => NEGATIVE_WORDS.has(word.toLocaleLowerCase('de-DE')));
}

/**
 * R – Realistisch
 * Regel: Die Trainer:in hat den „Realitäts-Check“ selbst abgehakt.
 * Warum: Ob Zeit, Wissen und Mittel reichen, weiß nur die Person selbst – die Quelle empfiehlt dafür eine „ehrliche
 *        Bestandsaufnahme“. Eine automatische Bewertung wäre geraten; das bewusste Abhaken zwingt zum Nachdenken.
 */
export function checkRealistic(realistic: boolean): boolean {
  return realistic;
}

/**
 * T – Terminiert
 * Regel: Ein Zieldatum ist gesetzt.
 * Warum: „Jedes Ziel braucht eine Deadline“ (Quelle) – als Kontrollpunkt und Ansporn. Das Datum speist auch die
 *        Restzeit („noch 10 Tage“) und die Fortschrittsleiste.
 * Hinweis: Ein Datum in der Vergangenheit verhindert das Speichern nicht (z. B. beim Nachtragen); in der Anzeige
 *          erscheint dann „überschritten“ mit dem Hinweis, das Ziel anzupassen.
 */
export function checkTimeBound(dueDate: string | null): boolean {
  return Boolean(dueDate);
}

/** Fasst die fünf Einzelprüfungen zusammen (Grundlage für die S-M-A-R-T-Kacheln im Formular). */
export function smartCheck(goal: GoalDraft): SmartCheck {
  return {
    S: checkSpecific(goal.text),
    M: checkMeasurable(goal.text, goal.measure),
    A: checkAttractive(goal.text, goal.measure),
    R: checkRealistic(goal.realistic),
    T: checkTimeBound(goal.dueDate),
  };
}

function keyToUtc(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Tage von heute bis zum Zieldatum (negativ = überschritten). */
export function daysUntil(dueKey: string, todayKey: string): number {
  return Math.round((keyToUtc(dueKey) - keyToUtc(todayKey)) / 86_400_000);
}

/** Text zur Restzeit, z. B. „noch 12 Tage“, „heute fällig“, „seit 3 Tagen überschritten“. */
export function formatRemaining(dueKey: string, todayKey: string): string {
  const days = daysUntil(dueKey, todayKey);
  if (days > 1) return `noch ${days} Tage`;
  if (days === 1) return 'noch 1 Tag';
  if (days === 0) return 'heute fällig';
  return days === -1 ? 'seit 1 Tag überschritten' : `seit ${-days} Tagen überschritten`;
}

/**
 * Anteil der verstrichenen Zeit zwischen Anlegen und Zieldatum (0–1) für die Fortschrittsleiste.
 * Idee aus der Quelle (Goal-Gradient-Effekt): Je sichtbarer die nahende Deadline, desto stärker der Ansporn.
 */
export function timeProgress(createdAtIso: string, dueKey: string, todayKey: string): number {
  const createdKey = createdAtIso.slice(0, 10);
  const total = keyToUtc(dueKey) - keyToUtc(createdKey);
  if (total <= 0) return 1;
  return Math.min(1, Math.max(0, (keyToUtc(todayKey) - keyToUtc(createdKey)) / total));
}
