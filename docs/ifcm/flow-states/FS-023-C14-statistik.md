# FS-023 · C14 – Erweiterung der Statistik

| Feld | Wert |
|---|---|
| Zeitraum | 09.11.2026 – *offen* (Alpha-Test) |
| Chunk | C14 (Chunkliste 2, letzter Chunk; siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in – Steuerwort „Vorarbeit“, bestätigte Reihenfolge (… → C12 → **C14**) |
| Vorgänger | – (wertet Daten aus C06–C13 aus) |
| Branch / Commits | `ifcm/fs-023-c14-statistik` (enthält alle bisherigen Chunks), Commit `6bf1c05` |
| Status | **Ergebnis liegt vor – Alpha-Test durch Entwickler:in offen** |

## 1. Chunk & Ziel
Die Statistik-Seite zeigt bisher (Stand Ausgangsversion): Anzahl Pläne und Übungen, Ø Trainingsdauer, Sportart, die
meistgenutzten Übungen (Donut) und Übungen nach Schwierigkeitsgrad. Seitdem sind viele neue Daten hinzugekommen
(Wiederholungen/Kalender, Satz-Übungen, Bestzeiten, gespeicherte Zeiten, Streak, Ziele), die noch nirgends ausgewertet werden.

**Befund Claude:** Für Auswertungen „über die Zeit“ (z. B. Trainingszeit pro Woche) speichert die App bisher nur, **an
welchen Tagen** etwas absolviert wurde (Streak, C12) – nicht **was** und **wie lange**. Solche Auswertungen bräuchten ein
kleines Protokoll absolvierter Übungen (ohne Personenbezug).

Vorab genannte Prüfpunkte (Claude, 09.11.2026):
1. Auswerten, was es wirklich gibt: Kennzahlen nur aus vorhandenen Daten berechnen – wo Daten fehlen (z. B. echte
   Trainingszeit), entweder ehrlich weglassen oder ein schlankes Protokoll absolvierter Übungen ergänzen; alte Daten
   bleiben gültig; je Sportart (C01) bzw. gesamt, wo es passt (Streak).
2. Lesbar und im Design: wenige, aussagekräftige Diagramme statt Zahlenflut; vorhandene Diagrammbausteine (Donut,
   Linie) wiederverwenden, Sportfarbe (C03), mobil gut lesbar, Diagramme zusätzlich als Text für Screenreader.
3. Daten und Abgrenzung: nur Daten der Trainer:in, keine Auswertung einzelner Sportler:innen; gespeicherte Zeiten mit
   freien Namen (C13b) nur aggregiert; kein Umbau anderer Bereiche in diesem Chunk.

**Rückfragen an die Entwickler:in (09.11.2026):** Umfang der Auswertungen, ab jetzt ein Protokoll absolvierter Übungen
anlegen, je Sportart oder gesamt.

**Antwort (Entwickler:in, 09.11.2026, wörtlich):** „Programmiere mal so wie du es für richtig hältst, ich verbessere dann,
so kommen wir dieses mal besser voran.“ → Die Entwickler:in überlässt Claude die Entscheidungen; Verbesserungen folgen im
Alpha-Test (bewusste Abweichung von der Regel „erst fragen“, von der Entwickler:in selbst freigegeben).

## 2. Prompts
Siehe Antwort oben (wörtlich). **Entscheidungen Claude (statt Rückfragen):**
1. **Alle vorgeschlagenen Auswertungen** umgesetzt: absolvierte Übungen und Trainingszeit pro Woche, Aktivität der letzten
   8 Wochen, Übungen nach Art und Muskelgruppe, Bestzeiten und gespeicherte Zeiten, Ziele, Termine diesen Monat.
2. **Neues Aktivitätsprotokoll ab jetzt** (`activityLog`): beim Abschluss einer Übung wird ein Eintrag gespeichert (Datum,
   Sportart, Übung, Sekunden, Art). Ältere Trainings lassen sich nicht nachträglich rekonstruieren; die Wochenbalken füllen
   sich daher ab dem ersten Training nach dem Update.
3. **Je Sportart** (wie C01) für alle Zahlen – außer **Aktivität und Streak**, die wie in C12 über alle Sportarten zählen;
   die Seite sagt das oben ausdrücklich.

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/context/StreakContext.tsx` | `ActivityEntry`, `log`, `logCompletedExercise()` (Protokolleintrag + aktiver Tag), max. 1500 Einträge |
| `src/components/Timer.tsx` | protokolliert: Countdown bis 0 (Gesamtdauer), letzter Satz (Übungsdauer), übernommene Messzeit |
| `src/lib/statsExtra.ts` (neu) | `weekStartKey` (Montag), `isoWeek` (KW), `weeklyTraining()`, `activityGrid()`, `countBy()`; UTC-Tagesrechnung |
| `src/components/StatsCharts.tsx` (neu) | `WeeklyBars` (Sportfarbe, Hover/Fokus-Zeile, KW-Beschriftung, Tabelle für Screenreader), `ActivityGrid` (8×7 mit Legende), `BarList` |
| `src/pages/Statistics.tsx` | 4 neue Kacheln, 6 neue Abschnitte; Kacheln zweispaltig auch auf dem Handy; vorhandene Diagramme bleiben |
| `src/components/StatTile.tsx` | Silbentrennung statt Umbruch mitten im Wort („Schwim-men“) |

Kennzeichnung: `// IFCM FS-023 / C14`. Keine neue Abhängigkeit. **Build:** grün · **Lint:** keine neuen Warnungen.
**Logiktest (6 Fälle):** Wochenbeginn Montag, ISO-KW (inkl. Jahreswechsel), Wochensummen je Sportart, Raster 8×7 mit
Zukunftstagen, Monatsgrenze, `countBy` mit fester Reihenfolge ✔.
**Oberflächentest (Playwright, Testdaten Schwimmen):** Streak 2 Tage/Rekord 2 ✔ · Balken KW 41–46, Hover zeigt Woche ✔ ·
Screenreader-Tabelle 6 Zeilen ✔ · Termine diesen Monat 4, nächstes 10.11.2026 ✔ · Bestzeit 0:38,4, Zeiten 2/10, schnellste
0:39,9 ✔ · Ziele 1 offen ✔ · mobil ohne Überlauf ✔. Nachweis: [assets/fs023-nachweis.png](../assets/fs023-nachweis.png)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-023-c14-statistik` – noch nicht auf der Live-Seite.

## 4. Alpha-Test
*offen* – Verbesserungen durch die Entwickler:in angekündigt.

**Guards (Claude):** keine neuen Abhängigkeiten ✔ · Protokoll ohne Personenbezug (keine Sportler:innen, freie Zeit-Namen
aus C13b nur gezählt) und auf 1500 Einträge begrenzt ✔ · alte Daten unverändert gültig ✔ · Diagramme auch als Text ✔.

## 5. Alpha-Reflexion
*offen*

## 6. Abschluss
*offen*
