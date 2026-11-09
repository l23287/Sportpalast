# Chunkliste

> **Chunkliste 1 (C01–C10): vollständig abgearbeitet am 09.11.2026.** Chunkliste 2 (C11–C15) siehe unten.

Gepflegt vom Compass Navigator; Claude hält den Status aktuell. Immer nur **ein** Chunk `in Arbeit`.

> **Status: freigegeben von der Entwickler:in am 03.11.2026** (Vorschlag Claude, unverändert übernommen).
> Grundlage: alle 🟦 blau markierten Punkte der Brainstorm-Mindmap (blau = umsetzen). 🟧 orange markierte
> Punkte sind in dieser Phase der Weiterentwicklung nicht relevant (siehe unten).
> Querschnittsregel für alle Chunks: **Design erhalten** (A3).

| ID | Titel | Inhalt (aus der Skizze) | Bezug | Priorität | Status | Flow States |
|---|---|---|---|---|---|---|
| C01 | Sportart-Trennung | Übungen und Pläne gehören zu einer Sportart; beim Wechsel der Sportart erscheinen nur deren Inhalte; bestehende Daten werden Tischtennis zugeordnet | A1, B5 | hoch (Fundament) | fertig (Merge offen) | [FS-001](flow-states/FS-001-C01-sportart-trennung.md) |
| C02 | Mehr Sportarten & eigene Sportart | Liste weiterer Sportarten (z. B. Fußball, Gym/Fitness); eigene Sportart per Freitextfeld anlegen | A2, A6, A7 | hoch | fertig (Merge offen) | [FS-002](flow-states/FS-002-C02-mehr-sportarten.md) |
| C03 | Farben & Symbole je Sportart | Symbole und Farbakzente passen sich der gewählten Sportart an | A1 | mittel | fertig (Merge offen) | [FS-012](flow-states/FS-012-C03-farben-symbole.md) |
| C04 | Aufschlagtraining nur bei Tischtennis | Aufschlagtraining verschwindet aus der Navigation und wird bei Tischtennis in den Übungsbereich integriert; Platz in der Navigation wird frei | B5 | hoch | fertig (Merge offen) | [FS-003](flow-states/FS-003-C04-aufschlagtraining.md) |
| C05 | Kalendertool | Kalender-Icon im frei gewordenen Navigationsplatz; Kalenderansicht mit den geplanten Trainings | A7 | hoch | fertig (Merge offen) | [FS-004](flow-states/FS-004-C05-kalendertool.md) |
| C06 | Wiederkehrende Pläne & Übungen | Trainingspläne wiederholen sich automatisch (z. B. wöchentlich) und erscheinen im Kalender | A6, A7 | hoch | fertig (Merge offen) | [FS-005](flow-states/FS-005-C06-wiederkehrende-plaene.md), [FS-006](flow-states/FS-006-C06a-wochentag-uhrzeit.md), [FS-007](flow-states/FS-007-C06b-heute-bereich.md), [FS-008](flow-states/FS-008-C06c-suche-oben.md) |
| C07 | Dauer in Sekunden | Übungsdauer auch in Sekunden; Timer-Kreis zeigt z. B. „10 sek“ | B3 | mittel | fertig (Merge offen) | [FS-009](flow-states/FS-009-C07-dauer-sekunden.md) |
| C08 | Notizzettel an Übungen | Stift-Icon im Timer-Screen öffnet eine Notiz zur Übung, als Erinnerung fürs nächste Mal; Buttons „Pause“ und „Schließen“ | B4 | mittel | fertig (Merge offen) | [FS-010](flow-states/FS-010-C08-notizzettel.md), [FS-011](flow-states/FS-011-C08a-notizen-heute.md) |
| C09 | Zielsetzungstool | Bis zu 3 Kernziele im Einstellungsbereich eintragen; motivierende Anzeige der Ziele; Sportarten als Kacheln, in der Reihenfolge verschiebbar | neu (eigene Idee) | niedrig | fertig (Merge offen) | [FS-013](flow-states/FS-013-C09-zielsetzungstool.md), [FS-014](flow-states/FS-014-C09a-smart-erklaerung-ausklappen.md) |
| C10 | Einführung in die App | Neue Einführung in die Funktionen, gestaltet mit Claude Design; zuletzt, damit sie alle neuen Funktionen zeigt | B2 | hoch | fertig (Merge offen) | [FS-015](flow-states/FS-015-C10-einfuehrung.md) |

**Empfohlene Reihenfolge:** C01 → C02 → C04 → C05 → C06 → C07 → C08 → C03 → C09 → C10
(C01 ist Voraussetzung für C02/C03; C04 macht den Platz für C05 frei; C06 baut auf C05 auf.)

## Chunkliste 2 (ab 09.11.2026)

> **Status: vorgegeben von der Entwickler:in am 09.11.2026** (Compass Navigator); **Reihenfolge C15 → C11 → C13 → C12 → C14
> (Vorschlag Claude) am 09.11.2026 bestätigt**. IDs im Format der ersten Liste
> (Vorgabe „C011 … C015“ → C11 … C15). Inhalte: Kurzbeschreibung = Vorschlag Claude, wird je Chunk in der
> „Vorarbeit“ genauer geklärt.

| ID | Titel (Vorgabe) | Inhalt (Vorschlag Claude) | Bezug | Priorität | Status | Flow States |
|---|---|---|---|---|---|---|
| C11 | Sportart „Gym“ verbessern | Gym/Fitness passend zur Sportart: z. B. Sätze × Wiederholungen und Gewicht statt nur Dauer | A2 (Gym fehlte) | hoch (2.) | fertig (Merge offen) | [FS-017](flow-states/FS-017-C11-gym.md) |
| C12 | Streak einführen | Serie aufeinanderfolgender Trainings/Wochen als Motivation, sichtbar in der Übersicht | neu | mittel (4.) | fertig (Merge offen) | [FS-022](flow-states/FS-022-C12-streak.md) |
| C13 | Stoppuhr für Sportarten | Hochzählende Stoppuhr (mit Runden/Zwischenzeiten) zusätzlich zum herunterzählenden Timer, z. B. für Schwimmen, Leichtathletik | neu | mittel (3.) | fertig (Merge offen) | [FS-019](flow-states/FS-019-C13-stoppuhr.md), [FS-020](flow-states/FS-020-C13a-stoppuhr-menue.md), [FS-021](flow-states/FS-021-C13b-zeiten-speichern.md) |
| C14 | Erweiterung der Statistik | Mehr Auswertungen, z. B. absolvierte Trainings, Trainingszeit pro Woche, Ziele, Streak | neu | mittel (5.) | in Arbeit | [FS-023](flow-states/FS-023-C14-statistik.md) |
| C16 | Sportartgerechte Vorschläge (Zwischen-Chunk) | Beispieltexte in Formularen passend zur Sportart | Befund Entwickler:in beim Test von C11 | hoch (eingeschoben) | fertig (Merge offen) | [FS-018](flow-states/FS-018-C16-sportart-vorschlaege.md) |
| C15 | Ziel-Funktion nicht verpflichtend | Zieltool (C09) ein- und ausschaltbar; ausgeschaltet keine Ziel-Hinweise in der Übersicht | Rückmeldung zu C09 | hoch (1.) | fertig (Merge offen) | [FS-016](flow-states/FS-016-C15-ziele-optional.md) |

## Nicht in dieser Phase (🟧 orange in der Mindmap)
| Thema | Bezug | Grund laut Mindmap |
|---|---|---|
| Anwesenheitslisten | B1 | Datenverarbeitung Minderjähriger → späteres To-do |
| Reflexionszettel | B4 | orange markiert |
| Fotos/Videos zu Übungen | B3, B5 | Speicherplatz im Browser |
| Digitale Zähltafel / Wettkampf | B4 | sehr aufwendig, Datenschutz |
| Gemeinsame Pläne, Übungs-Workshop | A8, B5 | nicht in der Mindmap; bräuchten ein Backend (kein Budget) |

## Vorgemerkt außerhalb der Chunks (Befunde)
| Befund | Gefunden in | Status |
|---|---|---|
| Seitenpasswort im Klartext als Kommentar in `src/lib/siteGate.ts` (Guard IT-Security) | FS-001 | offen |
| `package-lock.json` nicht synchron mit `package.json` (`npm ci` schlägt fehl) | FS-001 | offen |
| `formatDate`/`isOverdue` lesen Datum als UTC (Fehlanzeige nur westlich von UTC möglich) | FS-004 | offen |
| Plankarte: „1 Übungen“ statt „1 Übung“ (seit Ausgangsversion) | FS-022 | offen |
