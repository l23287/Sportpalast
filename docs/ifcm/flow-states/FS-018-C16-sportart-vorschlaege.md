# FS-018 · C16 – Sportartgerechte Vorschläge (Zwischen-Chunk)

| Feld | Wert |
|---|---|
| Zeitraum | 09.11.2026 – 09.11.2026 |
| Chunk | C16 (Zwischen-Chunk, außerhalb der geplanten Reihenfolge eingeschoben) |
| Ausgewählt von | Entwickler:in – Befund während des Tests von C11 |
| Vorgänger | [FS-017](FS-017-C11-gym.md) (C11, Alpha-Test noch offen) |
| Branch / Commits | `ifcm/fs-018-c16-sportart-vorschlaege` (enthält C01–C11, C15), Commit `1eaf6ad` |
| Status | **bestanden** (Merge: Freigabe offen) |

## 1. Chunk & Ziel
Die Vorschläge (Beispieltexte „z. B. …“) passen in vielen Sportarten nicht zur Sportart – sie stammen aus der
Tischtennis-Zeit (z. B. „Vorhand-Rückhand-Wechsel“ oder „8 von 10 Aufschlägen im Feld“ auch bei Gym/Fitness).

## 2. Prompts
### Prompt 1 – 09.11.2026 (Entwickler:in, wörtlich)
> Okay zwischen Chuck. Die Vorschläge passen in vielen Sportarten nicht zu er Sportart siehe Bild. Bitte Programmiere

Steuerwort „Programmieren“. **Hinweis:** Das genannte Bild ist im Chat nicht angekommen. **Annahme Claude:** Gemeint
sind alle Beispieltexte in den Formularen; ohne eigene „Vorarbeit“ direkt umgesetzt (Zwischen-Chunk). Nummer C16
als nächste freie Chunk-Nummer.

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/lib/sportExamples.ts` (neu) | Vorschläge je Sportart an einer Stelle: Übungsname, Übungsziel, Planname, Notiz, Messgröße, 2 SMART-Beispielziele – für alle 12 Sportarten; neutrale Vorschläge für eigene Sportarten; `examplesFor(sport)` |
| `src/components/ExerciseFormModal.tsx` | Platzhalter „Name“ und „Ziel“ je Sportart |
| `src/pages/PlanForm.tsx` | Platzhalter „Name“ je Sportart |
| `src/components/Timer.tsx` | Platzhalter im Notizzettel je Sportart |
| `src/components/GoalForm.tsx` | Messgröße und Beispielziele je Sportart |
| `src/lib/goals.ts` | feste Tischtennis-Beispielziele entfernt (jetzt in `sportExamples.ts`) |
| `README.md` | ergänzt |

Beispiele: Gym/Fitness „Kniebeugen“, „Beinkraft“, „Ganzkörper A“, „3 × 10 Kniebeugen mit 60 kg“ · Schwimmen „4 × 50 m Kraul“,
„200 m Kraul ohne Pause“ · Fußball „Passdreieck mit Torabschluss“ · eigene Sportart (Hockey) „Aufwärmspiel“, „Koordination“.
Unverändert: Aufschlagtraining (nur Tischtennis) und allgemeine Platzhalter (z. B. Zielgruppe „U14, Fortgeschrittene“).
Kennzeichnung: `// IFCM FS-018 / C16`. Keine neue Abhängigkeit.
**Build/Lint:** grün, 0 Fehler. **Prüfung:** alle 12 Sportarten haben Vorschläge ✔. **Oberflächentest (Playwright):**
Gym/Fitness, Schwimmen, Fußball und eigene Sportart „Hockey“ zeigen jeweils passende Platzhalter in Übungs-, Plan- und
Zielformular sowie passende Beispielziele ✔. Nachweis: [assets/fs018-nachweis.png](../assets/fs018-nachweis.png)
(Übungsformular Schwimmen · Zielformular Gym/Fitness)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-018-c16-sportart-vorschlaege` – noch nicht auf der Live-Seite.

## 4. Alpha-Test
**Bewertung (Entwickler:in, 09.11.2026):** Steuerwort „Vorarbeit“ (= Ergebnis zufriedenstellend; C11 und C16 gemeinsam im C16-Branch getestet) → **bestanden**

**Guards (Claude):** keine neuen Abhängigkeiten, keine Daten ✔ · Beispieltexte selbst formuliert, keine Personennamen ✔.

## 5. Alpha-Reflexion
Durch die Entwickler:in (Coach); Inhalte liegen bei der Entwickler:in. *Bei Bedarf nachtragen.*

## 6. Abschluss
C16 **fertig** (09.11.2026). C13 baut auf diesem Branch auf.
