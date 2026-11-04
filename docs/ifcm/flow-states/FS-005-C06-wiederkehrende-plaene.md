# FS-005 · C06 – Wiederkehrende Pläne & Übungen

| Feld | Wert |
|---|---|
| Zeitraum | 04.11.2026 – *offen* |
| Chunk | C06 (siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in (Compass Navigator) – nächster Chunk laut Reihenfolge (… → C05 → **C06**) |
| Vorgänger | – (baut auf dem Kalender aus FS-004 / C05 auf) |
| Branch / Commits | *offen* (geplant: `ifcm/fs-005-c06-wiederkehrende-plaene`, abgezweigt vom C05-Branch) |
| Status | **Chunk gewählt – Rückfrage offen** |

## 1. Chunk & Ziel
Trainingspläne können sich automatisch wiederholen (Vorschlag Claude: wöchentlich, alle 2 Wochen, monatlich,
optional mit Enddatum) und erscheinen an jedem Termin im Kalender. Bezug: A7 („automatisch Wiederkehrung“),
A6, Mindmap „Wiederkehrende Übungen und Pläne → Kalendertool“.

Vorab genannte Prüfpunkte (Claude, 04.11.2026):
1. Ein Plan, viele Termine: Die Wiederholung wird als Regel am Plan gespeichert, nicht als Kopien. Die Termine
   berechnet `plansByDay` (Andockpunkt aus C05). Alte Pläne ohne Regel bleiben einmalig – keine Migration nötig.
2. „Überfällig“ neu denken: Ein wöchentlicher Plan ist nicht überfällig, nur weil sein Startdatum vorbei ist.
   Übersicht und Detailseite zeigen bei wiederkehrenden Plänen den nächsten Termin statt einer roten Markierung.
3. Korrekt rechnen und begrenzen: Monatsende (z. B. 31. → Monate ohne 31. Tag), Enddatum, Zeitzonen wie in C05;
   der Kalender berechnet nur Termine im sichtbaren Zeitraum, damit nichts endlos läuft.

**Rückfrage an die Entwickler:in (04.11.2026):** Was ist mit „wiederkehrenden Übungen“ gemeint – reicht es, dass
Übungen über wiederkehrende Pläne mitwiederholt werden, oder sollen Übungen selbst einen Rhythmus bekommen? *offen*

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
