# FS-017 · C11 – Sportart „Gym“ verbessern

| Feld | Wert |
|---|---|
| Zeitraum | 09.11.2026 – *offen* |
| Chunk | C11 (Chunkliste 2, siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in – Steuerwort „Vorarbeit“, bestätigte Reihenfolge (C15 → **C11**) |
| Vorgänger | – (baut auf C02 „Gym/Fitness“ und C07 „Dauer in Sekunden“ auf) |
| Branch / Commits | *offen* (geplant: `ifcm/fs-017-c11-gym`, abgezweigt vom C15-Branch) |
| Status | **Chunk gewählt – Rückfragen offen** |

## 1. Chunk & Ziel
Die Sportart „Gym/Fitness“ (seit C02, Bezug A2 „gym als Sportart hinzufügen“) soll besser zur Sportart passen. Heute
verhält sich Gym wie jede andere Sportart: Übungen haben nur eine **Dauer** – im Krafttraining wird aber in
**Sätzen, Wiederholungen und Gewicht** geplant.

Vorab genannte Prüfpunkte (Claude, 09.11.2026):
1. Sportartabhängige Übungsangaben ohne Bruch: Kraftübungen bekommen z. B. Sätze × Wiederholungen (+ optional Gewicht
   und Satzpause) als zusätzliche Art der Übung; Dauer-Übungen und alle anderen Sportarten bleiben unverändert;
   bestehende Gym-Übungen behalten ihre Dauer (keine Datenumwandlung nötig).
2. Überall stimmig anzeigen und rechnen: Übungskarte, Planansicht, Bereich „Heute“, Timer (bei Sätzen: Satz-Zähler
   bzw. Pausen-Timer statt Gesamt-Countdown) und Plandauer (geschätzt aus Sätzen × Pausen) müssen die neue Angabe
   verstehen – sonst stimmen Summen und Statistik (C14) nicht.
3. Abgrenzung und Datenschutz: Gewichte sind Vorgaben der Trainer:in für die Übung, kein Trainingstagebuch einzelner
   Sportler:innen (keine personenbezogenen Leistungsdaten); keine Stoppuhr (C13), keine neue Statistik (C14).

**Rückfragen an die Entwickler:in (09.11.2026) – der Chunk ist noch ungenau:** siehe Chat; Antworten werden hier
nachgetragen. *offen*

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
