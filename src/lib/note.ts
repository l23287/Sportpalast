// IFCM FS-010 / C08 Notizzettel an Übungen: gemeinsame Regeln für Notizen.

/** Maximale Länge einer Notiz (Zeichen) – genug für eine kurze Erinnerung, verhindert riesige Einträge. */
export const MAX_NOTE_LENGTH = 500;

/** Hinweis im Notizfeld (Guards/Datenschutz): keine personenbezogenen Daten, oft trainieren Minderjährige. */
export const NOTE_PRIVACY_HINT = 'Bitte keine Namen oder persönlichen Daten von Sportler:innen eintragen.';

/** Bereinigt eine Notiz vor dem Speichern: Länge begrenzen; nur Leerzeichen = keine Notiz. */
export function cleanNote(note: string): string {
  const limited = note.slice(0, MAX_NOTE_LENGTH);
  return limited.trim() ? limited : '';
}
