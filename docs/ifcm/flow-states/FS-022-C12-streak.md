# FS-022 · C12 – Streak einführen

| Feld | Wert |
|---|---|
| Zeitraum | 09.11.2026 – *offen* |
| Chunk | C12 (Chunkliste 2, siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in – Steuerwort „Vorarbeit“, bestätigte Reihenfolge (… → C13 → **C12** → C14) |
| Vorgänger | – |
| Branch / Commits | *offen* (geplant: `ifcm/fs-022-c12-streak`, abgezweigt vom C13b-Branch) |
| Status | **Chunk gewählt – Rückfragen offen, noch kein Code** |

## 1. Chunk & Ziel
Ein **Streak** (Serie) zeigt, wie viele Trainings bzw. Zeiträume in Folge geschafft wurden – als Motivation, sichtbar
in der Planübersicht. **Befund Claude:** Die App weiß bisher nicht, ob ein Training *stattgefunden* hat – Pläne haben nur
Termine. Für einen Streak braucht es daher zuerst ein „Training absolviert“.

Vorab genannte Prüfpunkte (Claude, 09.11.2026):
1. Datengrundlage schaffen: absolvierte Trainings als eigene, kleine Einträge (Datum, Plan, Sportart) speichern – sie sind
   die Grundlage für den Streak und später für die Statistik (C14); alte Daten bleiben unverändert.
2. Fair zählen: passender Zeitraum (Tage oder Wochen), wiederkehrende Pläne (wöchentliches Vereinstraining darf eine Tages-
   Serie nicht „brechen“), heute noch offen ≠ unterbrochen, Datum ohne Zeitzonen-Fehler (wie C05).
3. Motivation ohne Druck: positive Anzeige (Serie + Rekord), keine Schuldgefühle bei Pause/Ferien; ggf. abschaltbar wie die
   Ziele (C15); nur Daten der Trainer:in, keine Anwesenheit oder Leistungen einzelner Sportler:innen.

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
