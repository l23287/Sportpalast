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

**Rückfragen (Claude, 09.11.2026):** 1. Was zählt als Training? (a) „Training erledigt“ abhaken, (b) Timer/Stoppuhr benutzt,
(c) App geöffnet · 2. Tage oder Wochen? · 3. Je Sportart oder insgesamt, abschaltbar?

**Antwort (Entwickler:in, 09.11.2026, wörtlich):** „Nein zählt die Tage an denen eine Übungszeit vollständig durch gelaufen
ist oder eine neu Übung erstellt wurde. Bitte Programmiere“
→ Frage 1: **Tag zählt, wenn eine Übungszeit vollständig abgelaufen ist ODER eine neue Übung erstellt wurde**; Frage 2: **Tage**.
Noch offen (gemäß Regel „erst fragen“ nachgefragt): Frage 3 sowie, was bei Satz-Übungen (C11) und „Zeit messen“ (C13) als
„vollständig durchgelaufen“ gilt. Noch kein Code.

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
