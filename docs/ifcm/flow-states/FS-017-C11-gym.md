# FS-017 · C11 – Sportart „Gym“ verbessern

| Feld | Wert |
|---|---|
| Zeitraum | 09.11.2026 – 09.11.2026 |
| Chunk | C11 (Chunkliste 2, siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in – Steuerwort „Vorarbeit“, bestätigte Reihenfolge (C15 → **C11**) |
| Vorgänger | – (baut auf C02 „Gym/Fitness“ und C07 „Dauer in Sekunden“ auf) |
| Branch / Commits | `ifcm/fs-017-c11-gym` (enthält C01–C10, C15, C11), Commit `40e236e` |
| Status | **bestanden** (Merge: Freigabe offen) |

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

**Rückfragen an die Entwickler:in (09.11.2026)** – auf deren Wunsch („stelle Fragen, falls mein Chunk zu ungenau ist“):
1. Was heißt „verbessern“? (a) Sätze × Wiederholungen + Gewicht, (b) Satz- und Pausen-Timer, (c) Muskelgruppen, (d) anderes
2. Nur für Gym/Fitness oder für jede Sportart mit Krafttraining?
3. Gewicht als festes Vorgabe-Gewicht pro Übung (nicht pro Person)?

**Antwort (Entwickler:in, 09.11.2026, wörtlich):** „Das ist gut: a) Übungen in Sätzen × Wiederholungen und mit Gewicht
statt nur mit Dauer · b) ein Satz- und Pausen-Timer im Training, z. B. „Satz 2 von 3“ und danach 90 Sekunden Pause ·
c) Übungen nach Muskelgruppen ordnen, z. B. Beine, Brust oder Rücken. Aber bedenke, dass das Gewicht schnell anpassbar
sein soll, da der Muskel ja wächst.“ → a, b, c; Frage 2 nicht beantwortet (siehe Annahmen); Frage 3: Vorgabe-Gewicht,
dafür **schnell anpassbar**.

## 2. Prompts
### Prompt 1 – 09.11.2026 (Entwickler:in, wörtlich)
> Im folgenden werden wir diesen Prompt: "Agiere als erfahrener Programmierer und setzte dies, mit den entsprechenden
> Kommentaren im Code, sowie der Dokumentation um" durch Programmieren ersetzten. Also Programmieren

Neues Steuerwort **„Programmieren“** (in Skill, `CLAUDE.md`, README festgehalten). Patterns (Richtlinie): 6 Abkürzung ✔ · 1, 3 über die
Definition des Steuerworts · 4 Rückfragen ✔ (vorab gestellt und beantwortet).
**Annahmen Claude:**
- Frage 2 offen → die Art „Sätze × Wdh.“ und Muskelgruppen sind in **jeder** Sportart wählbar (Athletiktraining);
  nur in **Gym/Fitness** startet eine neue Übung standardmäßig als Satz-Übung.
- Schnell anpassbar = **+/− in 2,5-kg-Schritten** direkt auf der Übungskarte und im Timer, sofort gespeichert.
- Geschätzte Dauer einer Satz-Übung = Sätze × Wdh. × 3 Sek. + (Sätze − 1) × Satzpause – damit Plansummen,
  „Heute“ und Statistik ohne Umbau stimmen.
- Satzpause automatisch; „Nächster Satz“ überspringt sie; nach dem letzten Satz keine Pause.

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/types.ts` | `ExerciseFormat` (`duration`/`sets`), `MuscleGroup`; Übung um optionale `format`, `sets`, `reps`, `weightKg`, `restSeconds`, `muscleGroup` erweitert (alte Übungen gültig) |
| `src/lib/strength.ts` (neu) | Muskelgruppen, Grenzen, `estimateSetsSeconds`, `exerciseSummary` („3 × 12 · 42,5 kg“), `stepWeight` (±2,5 kg, 0–500), `defaultFormatFor` |
| `src/components/ExerciseFormModal.tsx` | Umschalter „Dauer / Sätze × Wdh.“; Felder Sätze, Wiederholungen, Gewicht (Komma erlaubt), Satzpause; Muskelgruppe; Prüfungen; Anzeige der geschätzten Dauer |
| `src/components/WeightStepper.tsx` (neu) | Gewicht −/+ mit Sofort-Speicherung und Ansage für Screenreader |
| `src/context/AppDataContext.tsx` | `updateExerciseWeight` |
| `src/components/ExerciseCard.tsx` | Sätze × Wdh., Satzpause, Muskelgruppe, Gewicht-Stepper |
| `src/pages/Exercises.tsx` | Abschnitte je Muskelgruppe (mit Anzahl), „Ohne Muskelgruppe“ zuletzt; ohne Muskelgruppen wie bisher |
| `src/components/Timer.tsx` | Satz- und Pausen-Timer: „Satz x von n“, „Satz geschafft“, Pausen-Countdown, „Nächster Satz“, Fortschrittsring nach Sätzen, Gewicht-Stepper (live) |
| `PlanDetail`, `PlanForm`, `TodayTraining` | Übungen zeigen `exerciseSummary` |
| `README.md` | ergänzt |

Kennzeichnung: `// IFCM FS-017 / C11`. Keine neue Abhängigkeit.
**Build/Lint:** grün, 0 Fehler (2 bekannte Warnungen).
**Logiktest (10 Fälle):** Schätzung 3×12/90 s = 288 s, 1 Satz ohne Pause ✔ · Kurzbeschreibungen mit/ohne Gewicht und
alte Übung ✔ · Gewicht +2,5, nicht unter 0, ohne Wert ✔ · Standard-Art Gym vs. Tischtennis ✔ · Formatierung ✔.
**Oberflächentest (Playwright, Gym/Fitness):** neue Übungen starten als „Sätze × Wdh.“ ✔ · Abschnitte „Beine (1)“, „Brust (1)“ ✔ ·
+ auf der Karte 40 → 42,5 kg gespeichert ✔ · Plan „8 Min. gesamt“, Übung „3 × 12 · 42,5 kg“ ✔ · Timer „Satz 1 von 3 / 12 Wdh.“ ✔ ·
+ im Timer → 45 kg ✔ · „Satz geschafft“ → Pause 3 Sek. → automatisch Satz 2 ✔ · Pause überspringen → Satz 3 ✔ ·
nach Satz 3 „Übung abgeschlossen“ ✔ · Planansicht zeigt danach 45 kg ✔ · Tischtennis: neue Übung standardmäßig „Dauer“ ✔.
Nachweis: [assets/fs017-nachweis.png](../assets/fs017-nachweis.png) (Formular · Übungen nach Muskelgruppen · Timer Satz · Timer Pause)
Nach dem Screenshot: Button „Pause überspringen“ in „Nächster Satz“ umbenannt (einzeilig auf dem Handy).

**Testmöglichkeit:** lokal im Branch `ifcm/fs-017-c11-gym` – noch nicht auf der Live-Seite.

## 4. Alpha-Test
**Bewertung (Entwickler:in, 09.11.2026):** Steuerwort „Vorarbeit“ (= Ergebnis zufriedenstellend; C11 und C16 gemeinsam im C16-Branch getestet) → **bestanden**

**Guards (Claude):** keine neuen Abhängigkeiten ✔ · Gewicht ist Vorgabe der Trainer:in an der Übung, keine
Leistungsdaten einzelner Personen ✔ · Eingabegrenzen (Sätze ≤ 20, Wdh. ≤ 100, Gewicht ≤ 500 kg, Pause ≤ 600 s) ✔.

## 5. Alpha-Reflexion
Durch die Entwickler:in (Coach); Inhalte liegen bei der Entwickler:in. *Bei Bedarf nachtragen.*

## 6. Abschluss
C11 **fertig** (09.11.2026). Abnahme gemeinsam mit C16 im C16-Branch.
