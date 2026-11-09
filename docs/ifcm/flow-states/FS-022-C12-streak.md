# FS-022 · C12 – Streak einführen

| Feld | Wert |
|---|---|
| Zeitraum | 09.11.2026 – *offen* |
| Chunk | C12 (Chunkliste 2, siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in – Steuerwort „Vorarbeit“, bestätigte Reihenfolge (… → C13 → **C12** → C14) |
| Vorgänger | – |
| Branch / Commits | `ifcm/fs-022-c12-streak` (enthält alle bisherigen Chunks), Commit `50b5726` |
| Status | **Ergebnis liegt vor – Alpha-Test offen** |

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

**Nachfrage (Claude):** Satz-Übung = alle Sätze geschafft, „Zeit messen“ = Zeit übernommen, freie Stoppuhr zählt nicht?
Ein Streak je Sportart und abschaltbar?
**Antwort (Entwickler:in, 09.11.2026, wörtlich):** „nein ein gesamt streak nicht pro Sportart und das sind alles Kriterien.
Programmiere jetzt“ → **ein Gesamt-Streak**; Kriterien wie vorgeschlagen bestätigt. Alle Fragen geklärt → programmiert.

## 2. Prompts
Siehe Rückfragen und Antworten oben (Prompts wörtlich). **Annahme Claude:** Schalter „Streak anzeigen“ (Standard an) wie
vorgeschlagen und nicht abgelehnt; gezählt wird auch bei ausgeblendeter Anzeige.

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/lib/streak.ts` (neu) | `computeStreak(days, today)`: aktuelle Serie (endet heute oder gestern – „heute offen“ unterbricht nicht), Rekord, „heute aktiv“; UTC-Tagesrechnung |
| `src/context/StreakContext.tsx` (neu) | aktive Tage (nur Datums-Schlüssel, max. 800), `recordActivity()` (je Tag einmal), Schalter `streakEnabled` |
| `src/components/StreakBadge.tsx` (neu) | Anzeige „x Tage in Folge · Heute geschafft ✓ / Heute noch offen“ + Rekord; ohne Serie „Starte deine Serie“ |
| `src/components/Timer.tsx` | zählt: Countdown bis 0, letzter Satz geschafft, „Zeit übernehmen“ |
| `src/pages/Exercises.tsx` | zählt: neue Übung erstellt (nicht beim Bearbeiten) |
| `src/pages/PlansOverview.tsx` | Streak oben in der Übersicht |
| `src/pages/Settings.tsx` | aufklappbarer Bereich „Streak“ mit Kurzinfo und Schalter |
| `src/App.tsx`, `README.md` | `StreakProvider`; Beschreibung |

Kennzeichnung: `// IFCM FS-022 / C12`. Keine neue Abhängigkeit. Die freie Stoppuhr zählt bewusst nicht.
**Build/Lint:** grün, 0 Fehler. **Logiktest (8 Fälle):** leer, heute, 3 Tage, bis gestern (heute offen), Lücke → 0, älterer
Rekord, Doppelte/unsortiert, über Zeitumstellung ✔.
**Oberflächentest (Playwright):** „Starte deine Serie“ ✔ · freie Stoppuhr zählt nicht ✔ · neue Übung → „1 Tag · Heute geschafft“ ✔ ·
5 Tage bis gestern → „Heute noch offen“ ✔ · Countdown läuft → noch nicht gezählt, nach Ablauf gezählt → „6 Tage“ ✔ ·
abgebrochener Countdown zählt nicht ✔ · Satz-Übung erst nach letztem Satz ✔ · „Zeit messen“ erst beim Übernehmen ✔ ·
Schalter aus → keine Anzeige, Zählung bleibt ✔. Nachweis: [assets/fs022-nachweis.png](../assets/fs022-nachweis.png)
Vorgemerkt (nicht Teil von C12): Plankarte zeigt „1 Übungen“ (Einzahl fehlt, besteht seit der Ausgangsversion).

**Testmöglichkeit:** lokal im Branch `ifcm/fs-022-c12-streak` – noch nicht auf der Live-Seite.

## 4. Alpha-Test – *offen, durch Entwickler:in*
**Guards (Claude):** keine neuen Abhängigkeiten ✔ · gespeichert werden nur Datums-Schlüssel, keine Übungen, Uhrzeiten oder
Personen ✔ · positive Formulierung ohne Druck ✔.

## 5. Alpha-Reflexion
*offen*

## 6. Abschluss
*offen*
