# Chunkliste

Gepflegt vom Compass Navigator; Claude hält den Status aktuell. Immer nur **ein** Chunk `in Arbeit`.

> **Status: freigegeben von der Entwickler:in am 03.11.2026** (Vorschlag Claude, unverändert übernommen).
> Grundlage: alle 🟦 blau markierten Punkte der Brainstorm-Mindmap (blau = umsetzen). 🟧 orange markierte
> Punkte sind in dieser Phase der Weiterentwicklung nicht relevant (siehe unten).
> Querschnittsregel für alle Chunks: **Design erhalten** (A3).

| ID | Titel | Inhalt (aus der Skizze) | Bezug | Priorität | Status | Flow States |
|---|---|---|---|---|---|---|
| C01 | Sportart-Trennung | Übungen und Pläne gehören zu einer Sportart; beim Wechsel der Sportart erscheinen nur deren Inhalte; bestehende Daten werden Tischtennis zugeordnet | A1, B5 | hoch (Fundament) | in Arbeit | [FS-001](flow-states/FS-001-C01-sportart-trennung.md) |
| C02 | Mehr Sportarten & eigene Sportart | Liste weiterer Sportarten (z. B. Fußball, Gym/Fitness); eigene Sportart per Freitextfeld anlegen | A2, A6, A7 | hoch | offen | – |
| C03 | Farben & Symbole je Sportart | Symbole und Farbakzente passen sich der gewählten Sportart an | A1 | mittel | offen | – |
| C04 | Aufschlagtraining nur bei Tischtennis | Aufschlagtraining verschwindet aus der Navigation und wird bei Tischtennis in den Übungsbereich integriert; Platz in der Navigation wird frei | B5 | hoch | offen | – |
| C05 | Kalendertool | Kalender-Icon im frei gewordenen Navigationsplatz; Kalenderansicht mit den geplanten Trainings | A7 | hoch | offen | – |
| C06 | Wiederkehrende Pläne & Übungen | Trainingspläne wiederholen sich automatisch (z. B. wöchentlich) und erscheinen im Kalender | A6, A7 | hoch | offen | – |
| C07 | Dauer in Sekunden | Übungsdauer auch in Sekunden; Timer-Kreis zeigt z. B. „10 sek“ | B3 | mittel | offen | – |
| C08 | Notizzettel an Übungen | Stift-Icon im Timer-Screen öffnet eine Notiz zur Übung, als Erinnerung fürs nächste Mal; Buttons „Pause“ und „Schließen“ | B4 | mittel | offen | – |
| C09 | Zielsetzungstool | Bis zu 3 Kernziele im Einstellungsbereich eintragen; motivierende Anzeige der Ziele; Sportarten als Kacheln, in der Reihenfolge verschiebbar | neu (eigene Idee) | niedrig | offen | – |
| C10 | Einführung in die App | Neue Einführung in die Funktionen, gestaltet mit Claude Design; zuletzt, damit sie alle neuen Funktionen zeigt | B2 | hoch | offen | – |

**Empfohlene Reihenfolge:** C01 → C02 → C04 → C05 → C06 → C07 → C08 → C03 → C09 → C10
(C01 ist Voraussetzung für C02/C03; C04 macht den Platz für C05 frei; C06 baut auf C05 auf.)

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
