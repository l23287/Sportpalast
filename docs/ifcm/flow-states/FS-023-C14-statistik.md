# FS-023 · C14 – Erweiterung der Statistik

| Feld | Wert |
|---|---|
| Zeitraum | 09.11.2026 – *offen* |
| Chunk | C14 (Chunkliste 2, letzter Chunk; siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in – Steuerwort „Vorarbeit“, bestätigte Reihenfolge (… → C12 → **C14**) |
| Vorgänger | – (wertet Daten aus C06–C13 aus) |
| Branch / Commits | *offen* (geplant: `ifcm/fs-023-c14-statistik`, abgezweigt vom C12-Branch) |
| Status | **Chunk gewählt – Rückfragen offen, noch kein Code** |

## 1. Chunk & Ziel
Die Statistik-Seite zeigt bisher (Stand Ausgangsversion): Anzahl Pläne und Übungen, Ø Trainingsdauer, Sportart, die
meistgenutzten Übungen (Donut) und Übungen nach Schwierigkeitsgrad. Seitdem sind viele neue Daten hinzugekommen
(Wiederholungen/Kalender, Satz-Übungen, Bestzeiten, gespeicherte Zeiten, Streak, Ziele), die noch nirgends ausgewertet werden.

**Befund Claude:** Für Auswertungen „über die Zeit“ (z. B. Trainingszeit pro Woche) speichert die App bisher nur, **an
welchen Tagen** etwas absolviert wurde (Streak, C12) – nicht **was** und **wie lange**. Solche Auswertungen bräuchten ein
kleines Protokoll absolvierter Übungen (ohne Personenbezug).

Vorab genannte Prüfpunkte (Claude, 09.11.2026):
1. Auswerten, was es wirklich gibt: Kennzahlen nur aus vorhandenen Daten berechnen – wo Daten fehlen (z. B. echte
   Trainingszeit), entweder ehrlich weglassen oder ein schlankes Protokoll absolvierter Übungen ergänzen; alte Daten
   bleiben gültig; je Sportart (C01) bzw. gesamt, wo es passt (Streak).
2. Lesbar und im Design: wenige, aussagekräftige Diagramme statt Zahlenflut; vorhandene Diagrammbausteine (Donut,
   Linie) wiederverwenden, Sportfarbe (C03), mobil gut lesbar, Diagramme zusätzlich als Text für Screenreader.
3. Daten und Abgrenzung: nur Daten der Trainer:in, keine Auswertung einzelner Sportler:innen; gespeicherte Zeiten mit
   freien Namen (C13b) nur aggregiert; kein Umbau anderer Bereiche in diesem Chunk.

**Rückfragen an die Entwickler:in (09.11.2026):** siehe Chat; Code erst nach den Antworten. *offen*

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
