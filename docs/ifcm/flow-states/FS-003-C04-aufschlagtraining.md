# FS-003 · C04 – Aufschlagtraining nur bei Tischtennis

| Feld | Wert |
|---|---|
| Zeitraum | 04.11.2026 – *offen* |
| Chunk | C04 (siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in (Compass Navigator) – nächster Chunk laut freigegebener Reihenfolge (C01 → C02 → **C04**) |
| Vorgänger | – (baut auf FS-001/FS-002 auf) |
| Branch / Commits | `ifcm/fs-003-c04-aufschlagtraining` (enthält C01 + C02 + C04), Commit `b1ba0d0` |
| Status | **Ergebnis liegt vor – Alpha-Test offen** |

## 1. Chunk & Ziel
Das Aufschlagtraining verschwindet als eigener Navigationspunkt. Bei Tischtennis wird es in den Übungsbereich
integriert, bei allen anderen Sportarten ist es nicht sichtbar. Der frei gewordene Platz in der Navigation ist
für das Kalendertool (C05) vorgesehen. Bezug: B5 („im Fußball gibt es ja gar keinen Aufschlag“), Mindmap-Skizze
„Platz wird durch Aufschlagtraining frei → bei Tischtennis in Übungsbereich integrieren“.

Vorab genannte Prüfpunkte (Claude, 04.11.2026):
1. Nichts geht verloren: gespeicherte Aufschlag-Einheiten und ihre Auswertung bleiben erhalten; alte Links auf
   `/aufschlagtraining` führen sinnvoll weiter statt ins Leere.
2. Integration nur bei Tischtennis, im bestehenden Design: im Übungsbereich als zweiter Reiter
   („Übungen | Aufschlagtraining“); bei anderen Sportarten keine Spur davon – auch nicht über die direkte Adresse.
3. Saubere Abgrenzung zu C05: Der Kalender kommt noch nicht; die Navigation hat vorübergehend 4 statt 5 Punkte
   und muss auf Handy und Desktop trotzdem stimmig aussehen.

## 2. Prompts
### Prompt 1 – 04.11.2026 (Entwickler:in, wörtlich)
> Agiere als erfahrener Programmierer und setzte dies im Programmcode um

Patterns (Richtlinie): 3 Persona ✔ · Kontext aus Chunkbeschreibung und 3 Prüfpunkten. Keine Rückfragen nötig.
**Annahme Claude:** Integration als zweiter Reiter „Übungen | Aufschlagtraining“ oben im Übungsbereich
(Vorschlag aus der Chunkbeschreibung, nicht widersprochen).

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/lib/nav.ts` | Navigationspunkt „Aufschlagtraining“ entfernt → 4 Punkte, Platz für C05 |
| `src/lib/sport.ts` | `SERVE_TRAINING_SPORTS = ['Tischtennis']`, `hasServeTraining(sport)` |
| `src/pages/ExercisesArea.tsx` (neu) | Rahmen des Übungsbereichs: Reiter „Übungen \| Aufschlagtraining“ nur bei Tischtennis; `ServeTrainingGuard` leitet bei anderen Sportarten zurück zu `/uebungen` |
| `src/App.tsx` | `/uebungen` als Bereich mit Unterseiten (`index` = Übungen, `aufschlagtraining` = Aufschlagtraining mit Schutz); alte Adresse `/aufschlagtraining` leitet nach `/uebungen/aufschlagtraining` weiter |

Unverändert: `ServeTraining.tsx`, `Exercises.tsx` und alle gespeicherten Aufschlag-Einheiten.
Alle Änderungen sind mit `// IFCM FS-003 / C04` gekennzeichnet.
**Build/Lint:** grün, 0 Fehler (2 bekannte Warnungen).
**Automatischer Kurztest (Claude, Playwright):** Navigation mobil und Desktop: 4 Punkte ✔ · Tischtennis: Reiter
sichtbar, Aufschlagtraining öffnet sich, „Übungen“ in der Navigation bleibt markiert ✔ · gespeicherte Einheit
weiterhin sichtbar ✔ · alter Link `/aufschlagtraining` → `/uebungen/aufschlagtraining` ✔ · Fußball: kein Reiter,
direkte Adresse führt zu `/uebungen` ✔. Nachweis: [assets/fs003-nachweis.png](../assets/fs003-nachweis.png)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-003-c04-aufschlagtraining` – noch nicht auf der Live-Seite.

## 4. Alpha-Test – *offen, durch Entwickler:in*
**Guards (Claude):** keine neuen Abhängigkeiten, keine neuen Daten, keine Secrets ✔.
Hinweis außerhalb von C04: Der Einführungstext im Onboarding spricht noch von Tischtennis („Einheit am Tisch“) → Thema von C10.

## 5. Alpha-Reflexion
*offen*

## 6. Abschluss
*offen*
