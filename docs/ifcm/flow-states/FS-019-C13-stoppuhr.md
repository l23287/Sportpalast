# FS-019 · C13 – Stoppuhr für Sportarten

| Feld | Wert |
|---|---|
| Zeitraum | 09.11.2026 – *offen* |
| Chunk | C13 (Chunkliste 2, siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in – Steuerwort „Vorarbeit“, bestätigte Reihenfolge (C15 → C11 → **C13** → C12 → C14) |
| Vorgänger | – (ergänzt den herunterzählenden Timer aus C07/C11) |
| Branch / Commits | *offen* (geplant: `ifcm/fs-019-c13-stoppuhr`, abgezweigt vom C16-Branch) |
| Status | **Chunk gewählt – Rückfragen offen** |

## 1. Chunk & Ziel
Bisher zählt der Timer nur **herunter** (feste Dauer bzw. Satzpause). Viele Sportarten **messen** aber Zeiten:
50 m Kraul, 60-m-Sprint, ein Zirkel „so schnell wie möglich“. C13 bringt eine **hochzählende Stoppuhr** mit Runden-
bzw. Zwischenzeiten.

Vorab genannte Prüfpunkte (Claude, 09.11.2026):
1. Genau messen, auch wenn das Handy kurz wegschaut: Zeit aus der Systemuhr berechnen (Startzeitpunkt + `Date.now()`),
   nicht durch Hochzählen im Sekundentakt – sonst geht die Stoppuhr im Hintergrund-Tab oder bei Bildschirmsperre
   falsch; Anzeige mit Zehntelsekunden; Start/Stopp, Runde, Zurücksetzen mit großen Tasten für die Halle.
2. Sinnvoll eingebunden: Vorschlag – frei nutzbare Stoppuhr im Übungsbereich (Reiter wie das Aufschlagtraining) und
   optional als dritte Übungsart „Zeit messen“ im Plan/Timer; Design des bestehenden Timers übernehmen.
3. Daten und Abgrenzung: gemessene Zeiten sind Leistungsdaten – wenn sie gespeichert werden, dann **ohne Personenbezug**
   (z. B. nur Bestzeit/letzte Zeit an der Übung), keine Ergebnislisten einzelner Sportler:innen; keine Statistik (C14),
   kein Streak (C12) in diesem Chunk.

**Rückfragen an die Entwickler:in (09.11.2026):** siehe Chat; Antworten werden hier nachgetragen. *offen*

## 2. Prompts
*offen*

## 3. Ergebnis
*offen*

## 4. Alpha-Test
*offen*

## 5. Alpha-Reflexion
*offen*

## 6. Abschluss
*offen*
