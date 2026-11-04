# FS-009 · C07 – Dauer in Sekunden

| Feld | Wert |
|---|---|
| Zeitraum | 04.11.2026 – *offen* |
| Chunk | C07 (siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in (Compass Navigator) – nächster Chunk laut Reihenfolge (… → C06 → **C07**) |
| Vorgänger | – |
| Branch / Commits | `ifcm/fs-009-c07-dauer-sekunden` (enthält C01–C07), Commit `0bead06` |
| Status | **Ergebnis liegt vor – Alpha-Test offen** |

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
### Prompt 1 – 04.11.2026 (Entwickler:in, wörtlich)
> Agiere als erfahrener Programmierer und setzte dies, mit den entsprechenden Kommentaren im Code, sowie der
> Dokumentation um

Patterns (Richtlinie): 1 ✔ · 3 Persona ✔ · Kontext aus Chunkbeschreibung und 3 Prüfpunkten. Keine Rückfragen.
**Annahmen Claude:** zwei Eingabefelder (Min. + Sek., Sekunden 0–59); Höchstdauer 24 Std. pro Übung; „sek“-Anzeige
im Timer nur bei Übungen unter 1 Minute, sonst wie bisher mm:ss.

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/types.ts` | `Exercise.durationMinutes` → `durationSeconds` |
| `src/lib/duration.ts` (neu) | `migrateExerciseDurations` (Minuten × 60, altes Feld entfernt, mehrfach ausführbar), `splitSeconds`, `MAX_EXERCISE_SECONDS` |
| `src/context/AppDataContext.tsx` | Migration beim Laden der Übungen |
| `src/lib/time.ts` | `formatDuration` erwartet Sekunden: „10 Sek.“, „1 Min. 30 Sek.“, „1 Std. 5 Min.“ |
| `src/components/ExerciseFormModal.tsx` | Felder „Min.“ und „Sek.“; Prüfungen (ganzzahlig, Sek. 0–59, > 0, ≤ 24 Std.), deutsche Meldungen (`noValidate`), Meldung verschwindet beim Korrigieren |
| `src/components/Timer.tsx` | Countdown mit exakten Sekunden; unter 1 Min. Anzeige „10 sek“ (Mindmap-Skizze); Gesamtdauer formatiert |
| `src/lib/stats.ts` | Durchschnittsdauer in Sekunden |
| `PlanCard`, `PlanDetail`, `PlanForm`, `ExerciseCard`, `TodayTraining` | Summen und Anzeige in Sekunden |
| `README.md` | Funktionsbeschreibung ergänzt |

Kennzeichnung: `// IFCM FS-009 / C07`. Keine neue Abhängigkeit.
**Build/Lint:** grün, 0 Fehler (2 bekannte Warnungen).
**Logiktest (11 Fälle):** Formatierung 10 s / 90 s / 900 s / 3600 s / 3900 s / 3661 s / 0 ✔ · Migration Minuten,
bereits Sekunden, fehlender Wert ✔ · Aufteilung 90 s → 1 Min. 30 Sek. ✔
**Oberflächentest (Playwright):** alte Übung (15 Min.) wird zu `durationSeconds: 900` umgerechnet und weiter als
„15 Min.“ angezeigt ✔ · 0/0 → „Die Dauer muss größer als 0 sein“ ✔ · 75 Sek. → Fehlermeldung ✔ · neue Übung
„Sprint“ 10 Sek. ✔ · Plan-Summe „15 Min. 10 Sek.“ (Detail, Bereich „Heute“, Statistik-Durchschnitt) ✔ · Timer
kurz „9 sek“ nach 1 s, Gesamtdauer „10 Sek.“ ✔ · Timer lang „15:00“ ✔.
Nachweis: [assets/fs009-nachweis.png](../assets/fs009-nachweis.png) (Formular · Timer). Die im Formular-Bild
sichtbare alte Fehlermeldung wurde danach behoben (verschwindet jetzt beim Korrigieren).

**Testmöglichkeit:** lokal im Branch `ifcm/fs-009-c07-dauer-sekunden` – noch nicht auf der Live-Seite.

## 4. Alpha-Test – *offen, durch Entwickler:in*
**Guards (Claude):** keine neuen Abhängigkeiten ✔ · Datenmigration verlustfrei und wiederholbar ✔ · Eingaben auf
gültige Zahlen und Höchstdauer geprüft ✔.

## 5. Alpha-Reflexion
*offen*

## 6. Abschluss
*offen*
