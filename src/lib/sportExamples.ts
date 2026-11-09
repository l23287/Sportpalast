// IFCM FS-018 / C16 (Zwischen-Chunk) Sportartgerechte Vorschläge:
// Alle Beispieltexte („z. B. …“) in Formularen stammten aus der Tischtennis-Zeit (z. B. „Vorhand-Rückhand-Wechsel“
// auch bei Gym/Fitness oder Schwimmen). Hier stehen passende Vorschläge je Sportart an EINER Stelle;
// eigene Sportarten bekommen neutrale Vorschläge (NEUTRAL_EXAMPLES).
import type { Sport } from '../types';

export interface SportExamples {
  exerciseName: string; // Platzhalter „Name“ im Übungsformular
  exerciseGoal: string; // Platzhalter „Ziel“ im Übungsformular
  planName: string; // Platzhalter „Name“ im Plan-Formular
  note: string; // Platzhalter im Notizzettel (Timer)
  goalMeasure: string; // Platzhalter „Woran misst du den Erfolg?“ im Zielformular
  goals: [string, string]; // Beispielziele (SMART) im Zielformular
}

const EXAMPLES: Record<string, SportExamples> = {
  Tischtennis: {
    exerciseName: 'Vorhand-Rückhand-Wechsel',
    exerciseGoal: 'Schlagpräzision',
    planName: 'Techniktraining U14',
    note: 'Abstand zur Platte verkürzen, lieber 2 Durchgänge …',
    goalMeasure: '8 von 10 Aufschlägen im Feld',
    goals: [
      'Bis zum 31.01. spielen 8 von 10 Kindern meiner U12 den Aufschlag sicher ins Feld, indem wir jede Einheit 10 Minuten Aufschläge üben.',
      'Bis Ende März beherrscht meine Gruppe den Vorhand-Topspin gegen Unterschnitt in 7 von 10 Versuchen.',
    ],
  },
  'Beach Volleyball': {
    exerciseName: 'Pritschen in Zweiergruppen',
    exerciseGoal: 'Ballkontrolle',
    planName: 'Annahme & Zuspiel',
    note: 'Mehr Sand-Lauftraining vorab, Pausen kürzen …',
    goalMeasure: '7 von 10 Annahmen ans Netz',
    goals: [
      'Bis Ende Mai bringen meine Spieler:innen 7 von 10 Annahmen präzise zum Zuspieler, indem wir jede Einheit 15 Minuten Annahme üben.',
      'Bis zum Saisonstart schlagen alle 8 von 10 Aufschlägen ins Feld.',
    ],
  },
  Badminton: {
    exerciseName: 'Clear-Drop-Kombination',
    exerciseGoal: 'Beinarbeit',
    planName: 'Feldabdeckung & Clear',
    note: 'Ausgangsposition früher einnehmen …',
    goalMeasure: '8 von 10 Clears bis zur Grundlinie',
    goals: [
      'Bis Ende Februar spielen meine Jugendlichen 8 von 10 Clears bis an die hintere Grundlinie.',
      'Bis zum Turnier im April beherrscht die Gruppe den Rückhand-Aufschlag kurz in 7 von 10 Versuchen.',
    ],
  },
  Basketball: {
    exerciseName: 'Korbleger links und rechts',
    exerciseGoal: 'Abschlusssicherheit',
    planName: 'Wurftraining U16',
    note: 'Mehr Wiederholungen mit der schwachen Hand …',
    goalMeasure: '7 von 10 Freiwürfen',
    goals: [
      'Bis Ende Januar treffen meine Spieler:innen 7 von 10 Freiwürfen, indem wir jede Einheit 50 Würfe üben.',
      'Bis zum Saisonende beherrscht das Team zwei feste Spielzüge gegen Mann-Verteidigung.',
    ],
  },
  Fußball: {
    exerciseName: 'Passdreieck mit Torabschluss',
    exerciseGoal: 'Passgenauigkeit',
    planName: 'Torschuss & Passspiel U13',
    note: 'Kleinere Felder, mehr Ballkontakte …',
    goalMeasure: '8 von 10 Pässen kommen an',
    goals: [
      'Bis zur Winterpause spielen meine Spieler:innen im Passdreieck 8 von 10 Pässen genau, indem wir zweimal pro Woche 15 Minuten üben.',
      'Bis Ende März kann die Mannschaft Standardsituationen in drei festen Varianten ausführen.',
    ],
  },
  'Gym/Fitness': {
    exerciseName: 'Kniebeugen',
    exerciseGoal: 'Beinkraft',
    planName: 'Ganzkörper A',
    note: 'Gewicht nächstes Mal um 2,5 kg erhöhen …',
    goalMeasure: '3 × 10 Kniebeugen mit 60 kg',
    goals: [
      'Bis Ende Februar schaffe ich 3 × 10 Kniebeugen mit 60 kg in sauberer Technik, indem ich zweimal pro Woche trainiere.',
      'Bis zum Sommer trainiert meine Gruppe dreimal pro Woche nach einem festen Ganzkörperplan.',
    ],
  },
  Handball: {
    exerciseName: 'Sprungwurf aus dem Rückraum',
    exerciseGoal: 'Wurfkraft',
    planName: 'Abwehr 6:0 & Gegenstoß',
    note: 'Abwehrbeine tiefer, schneller verschieben …',
    goalMeasure: '6 von 10 Würfen aufs Tor',
    goals: [
      'Bis Ende Januar bringen meine Rückraumspieler:innen 6 von 10 Sprungwürfen aufs Tor.',
      'Bis zum Rückrundenstart beherrscht das Team die 6:0-Abwehr mit sicherem Verschieben.',
    ],
  },
  Leichtathletik: {
    exerciseName: 'Steigerungsläufe 60 m',
    exerciseGoal: 'Grundschnelligkeit',
    planName: 'Sprint & Sprung',
    note: 'Längere Pausen zwischen den Läufen …',
    goalMeasure: '60 m in unter 9,0 Sekunden',
    goals: [
      'Bis zum Hallensportfest im Februar laufen meine Athlet:innen die 60 m im Schnitt 0,2 Sekunden schneller.',
      'Bis Ende April beherrscht die Gruppe den Weitsprung-Anlauf mit festem Absprungpunkt.',
    ],
  },
  Schwimmen: {
    exerciseName: '4 × 50 m Kraul',
    exerciseGoal: 'Ausdauer im Wasser',
    planName: 'Technik Kraul & Wenden',
    note: 'Mehr auf die Atmung zu beiden Seiten achten …',
    goalMeasure: '200 m Kraul ohne Pause',
    goals: [
      'Bis zu den Osterferien schwimmen alle Kinder meiner Gruppe 200 m Kraul ohne Pause.',
      'Bis Ende Januar beherrscht die Gruppe die Rollwende in 8 von 10 Versuchen.',
    ],
  },
  Tennis: {
    exerciseName: 'Vorhand cross aus der Grundlinie',
    exerciseGoal: 'Länge und Platzierung',
    planName: 'Grundlinienspiel & Aufschlag',
    note: 'Treffpunkt weiter vor dem Körper …',
    goalMeasure: '7 von 10 ersten Aufschlägen im Feld',
    goals: [
      'Bis zur Sommersaison bringen meine Spieler:innen 7 von 10 ersten Aufschlägen ins Feld.',
      'Bis Ende März halten wir im Grundlinienduell 15 Ballwechsel cross ohne Fehler.',
    ],
  },
  Turnen: {
    exerciseName: 'Handstand an der Wand',
    exerciseGoal: 'Körperspannung',
    planName: 'Boden & Sprung',
    note: 'Mehr Hilfestellung beim Abrollen …',
    goalMeasure: '30 Sekunden Handstand an der Wand',
    goals: [
      'Bis zum Wettkampf im März halten alle Turner:innen 30 Sekunden Handstand an der Wand.',
      'Bis Ende Februar zeigt die Gruppe eine Bodenkür mit Rad, Rolle und Handstand-Abrollen.',
    ],
  },
  Volleyball: {
    exerciseName: 'Baggern über das Netz',
    exerciseGoal: 'Annahmesicherheit',
    planName: 'Annahme & Angriff U16',
    note: 'Mehr Spielformen statt Reihenübungen …',
    goalMeasure: '7 von 10 Annahmen zum Zuspieler',
    goals: [
      'Bis zum Rückrundenstart bringt mein Team 7 von 10 Annahmen präzise zum Zuspieler.',
      'Bis Ende März schlagen alle Spieler:innen 8 von 10 Aufschlägen von oben ins Feld.',
    ],
  },
};

/** Neutrale Vorschläge für eigene Sportarten (C02) – keine sportartspezifischen Begriffe. */
export const NEUTRAL_EXAMPLES: SportExamples = {
  exerciseName: 'Aufwärmspiel',
  exerciseGoal: 'Koordination',
  planName: 'Training Gruppe A',
  note: 'Mehr Pausen, Übung früher erklären …',
  goalMeasure: '8 von 10 Versuchen gelingen',
  goals: [
    'Bis Ende Februar gelingt die Hauptübung meiner Gruppe in 8 von 10 Versuchen, indem wir sie jede Einheit 10 Minuten üben.',
    'Ich plane bis Ende Dezember jede Woche beide Trainingseinheiten spätestens zwei Tage vorher vollständig in TrainerPro.',
  ],
};

/** Passende Vorschläge für eine Sportart (eigene Sportarten → neutral). */
export function examplesFor(sport: Sport): SportExamples {
  return EXAMPLES[sport] ?? NEUTRAL_EXAMPLES;
}
