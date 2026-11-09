# FS-019 · C13 – Stoppuhr für Sportarten

| Feld | Wert |
|---|---|
| Zeitraum | 09.11.2026 – *offen* |
| Chunk | C13 (Chunkliste 2, siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in – Steuerwort „Vorarbeit“, bestätigte Reihenfolge (C15 → C11 → **C13** → C12 → C14) |
| Vorgänger | – (ergänzt den herunterzählenden Timer aus C07/C11) |
| Branch / Commits | `ifcm/fs-019-c13-stoppuhr` (enthält C01–C11, C15, C16, C13), Commit `fd82a56` |
| Status | **Ergebnis liegt vor – Alpha-Test offen** |

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

**Rückfragen an die Entwickler:in (09.11.2026):** 1. Wo? (a) freie Stoppuhr als Reiter, (b) Übungsart „Zeit messen“,
(c) beides · 2. Für welche Sportarten? · 3. Zeiten speichern (Bestzeit/letzte Zeit ohne Personenbezug) oder nur anzeigen?
**Antwort:** nicht beantwortet – Entwickler:in gibt direkt „Programmieren“ → Vorschläge von Claude als Annahmen umgesetzt.

## 2. Prompts
### Prompt 1 – 09.11.2026 (Entwickler:in, wörtlich)
> Programmieren

**Annahmen Claude (Rückfragen unbeantwortet):** 1 → (c) beides; 2 → alle Sportarten; 3 → Bestzeit und letzte Zeit je
Übung speichern, ohne Personenbezug; freie Stoppuhr speichert nichts. „Zeit messen“-Übungen behalten eine geplante
Dauer für Plansummen.

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/hooks/useStopwatch.ts` (neu) | Stoppuhr-Logik: Zeit = gemessene Zeit + (jetzt − Start) aus der Systemuhr, Intervall nur zum Neuzeichnen; Start/Stopp/Runde/Zurücksetzen |
| `src/lib/stopwatch.ts` (neu) | `formatStopwatch` („0:38,4“, Zehntel abgeschnitten), `lapDurations`, `isNewBest` (kleiner = besser) |
| `src/components/StopwatchPanel.tsx` (neu) | Anzeige (`role="timer"`), große Tasten, Rundenliste mit „schnellste“, optional „Zeit übernehmen“ |
| `src/pages/StopwatchPage.tsx` (neu), `ExercisesArea.tsx`, `App.tsx` | Reiter „Stoppuhr“ für alle Sportarten (`/uebungen/stoppuhr`); Aufschlagtraining weiter nur Tischtennis |
| `src/types.ts`, `ExerciseFormModal.tsx` | dritte Übungsart „Zeit messen“; Felder `bestTimeMs`, `lastTimeMs`; geplante Dauer für Plansummen |
| `src/context/AppDataContext.tsx` | `recordExerciseTime` (letzte Zeit, Bestzeit) |
| `src/components/Timer.tsx` | bei „Zeit messen“ Stoppuhr-Dialog mit „Zeit übernehmen“, Meldung „Neue Bestzeit 🎉“, Bestzeit/letzte Zeit, Hinweis „ohne Namen“ |
| `ExerciseCard.tsx`, `lib/strength.ts` | Anzeige „Zeit messen · Bestzeit 0:00,7“ auf Karte und in Plänen |
| `README.md` | ergänzt |

Kennzeichnung: `// IFCM FS-019 / C13`. Keine neue Abhängigkeit.
**Build/Lint:** grün, 0 Fehler. **Logiktest (7 Fälle):** Formatierung inkl. Stunden und Zehntel-Abschneiden ✔ · Rundenzeiten ✔ ·
Bestzeit-Vergleich ✔. **Oberflächentest (Playwright):** Reiter „Übungen | Stoppuhr“ (Schwimmen) bzw. + „Aufschlagtraining“
(Tischtennis) ✔ · Start, 2 Runden, Stopp – Zeit bleibt stehen, schnellste Runde markiert ✔ · **Genauigkeit:** Systemuhr um
60 s vorgestellt (wie gedrosselter Hintergrund-Tab) → Anzeige 1:00,2 ✔ · Übung „Zeit messen“: Legende „Geplante Dauer“ ✔ ·
3 Läufe: 1,2 s „Neue Bestzeit“, 1,8 s „Zeit gespeichert“, 0,7 s „Neue Bestzeit“ ✔ · gespeichert Bestzeit = letzte Zeit = 747 ms ✔ ·
Plan zeigt „Zeit messen · Bestzeit 0:00,7“ ✔. Nachweis: [assets/fs019-nachweis.png](../assets/fs019-nachweis.png)
(freie Stoppuhr · Übung im Timer · Übungskarte)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-019-c13-stoppuhr` – noch nicht auf der Live-Seite.

## 4. Alpha-Test – *offen, durch Entwickler:in*
**Guards (Claude):** keine neuen Abhängigkeiten ✔ · gespeicherte Zeiten nur an der Übung, ohne Personenbezug, Hinweis im
Dialog ✔ · freie Stoppuhr speichert nichts ✔.

## 5. Alpha-Reflexion
*offen*

## 6. Abschluss
*offen*
