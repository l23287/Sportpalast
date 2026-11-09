# FS-020 · C13a – Stoppuhr in der Menüzeile, Beschriftung je Sportart (Erweiterung zu C13)

| Feld | Wert |
|---|---|
| Zeitraum | 09.11.2026 – 09.11.2026 |
| Chunk | C13 (Erweiterung „C13a“) |
| Ausgewählt von | Entwickler:in – Ergebnis des Alpha-Tests von FS-019 |
| Vorgänger | [FS-019](FS-019-C13-stoppuhr.md) |
| Branch / Commits | `ifcm/fs-020-c13a-stoppuhr-menue` (enthält alle bisherigen Chunks), Commit `6fbf0ab` |
| Status | **bestanden mit Erweiterungswunsch** → [FS-021](FS-021-C13b-zeiten-speichern.md) |

## 1. Chunk & Ziel
Die Stoppuhr soll für alle Sportarten in der **Menüzeile** stehen – wie früher das Aufschlagtraining (vor C04 eigener
Navigationspunkt) – und ihre **Beschriftung soll sich der Sportart anpassen**.

## 2. Prompts
### Prompt 1 – 09.11.2026 (Entwickler:in, wörtlich)
> Okay, dass war ein guter Anfang aber bitte stelle immer erst die Fragen bevor du programmierst. Bitte mache es für alle
> Sportarten zugänglich, sprich es muss wie das Aufschlagtraining damals in die Menü Zeile und bitte achte darauf das
> sich de Beschriftung anpassen muss (Sportartbedingt). Also Programmiere

**Vorgehen Claude:** gemäß dem Wunsch „erst die Fragen“ zuerst Rückfragen (Menüposition, welche Beschriftungen) – Code
erst nach den Antworten.

**Rückfragen (Claude, 09.11.2026):** 1. Eigener Punkt in der Hauptnavigation (6 Symbole), Reiter im Übungsbereich
entfällt? 2. Beschriftungen je Sportart laut Tabelle (Schwimmen „Zeitmessung“/„Bahn“, Leichtathletik „Zeitmessung“/„Runde“,
Gym „Satz“, Mannschaftssport „Abschnitt“, Rückschlagsport „Ballwechsel“, Turnen „Durchgang“) + Erklärtexte?

### Prompt 2 – 09.11.2026 (Entwickler:in, wörtlich) – Antwort
> Setzte als erfahrener Programmierer um und ergänze es bei allen Sportarten die neu erstellt werden als voreingestellt

→ Vorschläge 1 und 2 bestätigt; **Ergänzung:** neu erstellte (eigene) Sportarten bekommen die Stoppuhr mit
Voreinstellung („Stoppuhr“, „Runde“/„Runden“, allgemeiner Erklärtext).

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/lib/stopwatch.ts` | `StopwatchLabels`, `DEFAULT_STOPWATCH_LABELS` (Voreinstellung für neue Sportarten), Beschriftungen je Sportart, `stopwatchLabelsFor(sport)` |
| `src/lib/nav.ts` | neuer Menüpunkt `/stoppuhr` (Symbol Stoppuhr) mit `labelFor` je Sportart; `navLabel()` |
| `MobileBottomNav.tsx`, `Sidebar.tsx` | Beschriftung über `navLabel(item, sport)` – 6 Menüpunkte |
| `src/App.tsx` | Route `/stoppuhr`; alte Adresse `/uebungen/stoppuhr` leitet weiter |
| `src/pages/ExercisesArea.tsx` | Reiter wieder wie in C04 (nur Tischtennis: „Übungen | Aufschlagtraining“) |
| `src/pages/StopwatchPage.tsx` | Titel und Erklärtext je Sportart, Sportart-Anzeige |
| `src/components/StopwatchPanel.tsx` | Taste und Liste je Sportart („Bahn“, „Satz“, „Ballwechsel“ …) – gilt auch im Timer der Übungsart „Zeit messen“ |
| `src/pages/Settings.tsx` | Hinweis beim Anlegen eigener Sportarten: Stoppuhr mit „Runde“ voreingestellt |
| `README.md` | ergänzt |

Kennzeichnung: `// IFCM FS-020 / C13a`. Keine neue Abhängigkeit.
**Build/Lint:** grün, 0 Fehler. **Oberflächentest (Playwright):** Menü Schwimmen „… Kalender, Zeitmessung, Einstellungen“, Titel
„Zeitmessung“, Taste/Liste „Bahn“/„Bahnen“ ✔ · Gym/Fitness „Stoppuhr“, „Satz“/„Sätze“ ✔ · Tennis „Ballwechsel“ ✔ · neue eigene Sportart
„Kanupolo“: „Stoppuhr“, „Runde“/„Runden“, allgemeiner Text ✔ · alte Adresse → `/stoppuhr` ✔ · Übungsbereich ohne Reiter (Kanupolo),
Tischtennis „Übungen | Aufschlagtraining“ ✔ · Desktop-Seitenleiste 6 Punkte, bei Leichtathletik „Zeitmessung“ ✔.
Nachweis: [assets/fs020-nachweis.png](../assets/fs020-nachweis.png) (Schwimmen · Gym/Fitness · eigene Sportart)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-020-c13a-stoppuhr-menue` – noch nicht auf der Live-Seite.

## 4. Alpha-Test
**Bewertung (Entwickler:in, wörtlich):** „Okay, gut aber mache es möglich 10 Zeiten zu speichern und zu benennen. Die
gespeicherten Zeiten sollen unter der Stoppuhr selbst stehen. Bitte Programmiere die ´s als erfahrener Programmierer
hinzu und Dokumentiere mit C13b. Also Programmiere“ → **bestanden**, Erweiterung **FS-021 (C13b)**.

**Guards (Claude):** keine neuen Abhängigkeiten, keine neuen Daten ✔.

## 5. Alpha-Reflexion
Von der Entwickler:in nicht gesondert übermittelt.

## 6. Abschluss
C13a fertig. Weiter mit FS-021 (C13b) auf Basis dieses Branches.
