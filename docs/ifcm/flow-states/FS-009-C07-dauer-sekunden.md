# FS-009 · C07 – Dauer in Sekunden

| Feld | Wert |
|---|---|
| Zeitraum | 04.11.2026 – *offen* |
| Chunk | C07 (siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in (Compass Navigator) – nächster Chunk laut Reihenfolge (… → C06 → **C07**) |
| Vorgänger | – |
| Branch / Commits | *offen* (geplant: `ifcm/fs-009-c07-dauer-sekunden`, abgezweigt vom C06c-Branch) |
| Status | **Chunk gewählt – Prompt offen** |

## 1. Chunk & Ziel
Die Dauer einer Übung kann auch in Sekunden angegeben werden (z. B. 10 Sek. oder 1 Min. 30 Sek.); der Timer-Kreis
zeigt dann z. B. „10 sek“. Bezug: B3 („eine Übung auch nur ein paar Sekunden zu machen“), Mindmap-Skizze „Time-Kreis 10 sek“.

Vorab genannte Prüfpunkte (Claude, 04.11.2026):
1. Datenmodell sauber umstellen, nichts verlieren: Dauer intern in Sekunden speichern; vorhandene Übungen werden
   beim Laden umgerechnet (Minuten × 60). Betroffen sind 9 Dateien (Übungskarte, Formular, Timer, Plan-Karte,
   Detailseite, Plan-Formular, Bereich „Heute“, Statistik) – alle müssen die neue Einheit nutzen.
2. Eingabe und Anzeige verständlich: Formular mit Minuten **und** Sekunden; Anzeige „10 Sek.“, „1 Min. 30 Sek.“,
   „1 Std. 5 Min.“; Summen in Plänen und Statistik bleiben korrekt; Dauer muss größer als 0 sein.
3. Timer passend machen: Countdown startet mit der exakten Sekundenzahl; die Skizze „10 sek“ im Kreis umsetzen;
   Design des Timers erhalten.

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
