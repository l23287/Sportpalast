# FS-005 · C06 – Wiederkehrende Pläne & Übungen

| Feld | Wert |
|---|---|
| Zeitraum | 04.11.2026 – 04.11.2026 |
| Chunk | C06 (siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in (Compass Navigator) – nächster Chunk laut Reihenfolge (… → C05 → **C06**) |
| Vorgänger | – (baut auf dem Kalender aus FS-004 / C05 auf) |
| Branch / Commits | `ifcm/fs-005-c06-wiederkehrende-plaene` (enthält C01, C02, C04, C05, C06), Commit `cbff329` |
| Status | **teilweise bestanden** → Erweiterung in [FS-006](FS-006-C06a-wochentag-uhrzeit.md) |

## 1. Chunk & Ziel
Trainingspläne können sich automatisch wiederholen (Vorschlag Claude: wöchentlich, alle 2 Wochen, monatlich,
optional mit Enddatum) und erscheinen an jedem Termin im Kalender. Bezug: A7 („automatisch Wiederkehrung“),
A6, Mindmap „Wiederkehrende Übungen und Pläne → Kalendertool“.

Vorab genannte Prüfpunkte (Claude, 04.11.2026):
1. Ein Plan, viele Termine: Die Wiederholung wird als Regel am Plan gespeichert, nicht als Kopien. Die Termine
   berechnet `plansByDay` (Andockpunkt aus C05). Alte Pläne ohne Regel bleiben einmalig – keine Migration nötig.
2. „Überfällig“ neu denken: Ein wöchentlicher Plan ist nicht überfällig, nur weil sein Startdatum vorbei ist.
   Übersicht und Detailseite zeigen bei wiederkehrenden Plänen den nächsten Termin statt einer roten Markierung.
3. Korrekt rechnen und begrenzen: Monatsende (z. B. 31. → Monate ohne 31. Tag), Enddatum, Zeitzonen wie in C05;
   der Kalender berechnet nur Termine im sichtbaren Zeitraum, damit nichts endlos läuft.

**Rückfrage an die Entwickler:in (04.11.2026):** Was ist mit „wiederkehrenden Übungen“ gemeint – reicht es, dass
Übungen über wiederkehrende Pläne mitwiederholt werden, oder sollen Übungen selbst einen Rhythmus bekommen?
*Nicht beantwortet* → **Annahme Claude:** Übungen wiederholen sich über den wiederkehrenden Plan mit (Übungen
haben kein eigenes Datum). Kann in einem späteren Flow State geändert werden.

## 2. Prompts
### Prompt 1 – 04.11.2026 (Entwickler:in, wörtlich)
> Grade der Gedanke aus Punkt 2 ist wichtig. Agiere als erfahrener Programmierer und setzte dies, mit den
> entsprechenden Kommentaren im Code, sowie der Dokumentation um

Patterns (Richtlinie): 1 Ausgabeformat ✔ · 3 Persona ✔ · Schwerpunkt gesetzt (Prüfpunkt 2 „Überfällig neu
denken“). **Annahmen Claude:** Rhythmen wöchentlich / alle 2 Wochen / monatlich, optionales Enddatum;
monatlich am 29.–31. → in kürzeren Monaten letzter Tag des Monats; abgelaufene Serie = „Serie beendet“.

## 3. Ergebnis
**Kern (Prüfpunkt 2):** Die Frage „Wann findet der Plan statt – und ist er überfällig?“ beantwortet jetzt **eine**
Funktion, `getPlanSchedule()`. Nur einmalige Pläne können überfällig sein; wiederkehrende zeigen ihren nächsten
Termin (Wiederhol-Symbol, blau) oder „Serie beendet“. Übersicht, Detailseite und Kalender nutzen dieselbe Logik.

| Datei | Änderung |
|---|---|
| `src/types.ts` | Typ `Recurrence` (`none`/`weekly`/`biweekly`/`monthly`); Plan um optionale Felder `recurrence`, `recurrenceEnd` erweitert – alte Pläne bleiben gültig (= einmalig) |
| `src/lib/recurrence.ts` (neu) | `occurrencesBetween` (Termine in einem Zeitraum), `nextOccurrence`, `getPlanSchedule` (zentrale Überfällig-Logik), `RECURRENCE_LABELS`, `formatDateKey` |
| `src/lib/calendar.ts` | `plansByDay` nutzt `occurrencesBetween` → jeder Termin erscheint im Kalender (Andockpunkt aus C05) |
| `src/components/PlanCard.tsx` | Badge: einmalig = Datum (rot wenn überfällig); wiederkehrend = 🔁 nächster Termin; „Serie beendet“ |
| `src/pages/PlanDetail.tsx` | Badge „Wöchentlich · nächster Termin … · bis …“, nie „Überfällig“ bei Serien |
| `src/pages/CalendarPage.tsx` | vergangene Termine von Serien grau statt rot; Rhythmus in der Tagesliste |
| `src/pages/PlanForm.tsx` | Auswahl „Wiederholung“ + „Wiederholen bis (optional)“; Prüfungen: Serie braucht Startdatum, Ende nicht vor Start (deutsche Meldungen, `noValidate`) |
| `README.md` | Funktionsbeschreibung ergänzt |

Alle Code-Änderungen sind mit `// IFCM FS-005 / C06` gekennzeichnet. Keine neue Abhängigkeit.
**Build/Lint:** grün, 0 Fehler (2 bekannte Warnungen).
**Logiktest (Claude, 13 Fälle, Zeitzonen Berlin und New York):** wöchentlich ✔ · über die Zeitumstellung am
25.10. ✔ · alle 2 Wochen ✔ · monatlich am 31. → 28.02./31.03./30.04. ✔ · 29.02. im Schaltjahr ✔ · Enddatum ✔ ·
vor Start keine Termine ✔ · einmalig und alter Plan ohne Regel ✔ · nächster Termin ✔ · Serie mit vergangenem
Start nicht überfällig ✔ · einmaliger vergangener Plan überfällig ✔ · „Serie beendet“ ✔
**Oberflächentest (Playwright):** Fehlermeldungen ohne Datum / Ende vor Start ✔ · Detail „Wöchentlich · nächster
Termin 10.11.2026“ ✔ · Übersicht: Serie blau mit nächstem Termin, einmaliger Altplan rot ✔ · Kalender: vergangene
Serientermine grau, kommende blau ✔. Nachweis: [assets/fs005-nachweis.png](../assets/fs005-nachweis.png)
(Übersicht · Kalender · Detail)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-005-c06-wiederkehrende-plaene` – noch nicht auf der Live-Seite.

## 4. Alpha-Test
**Bewertung (Entwickler:in, 04.11.2026, wörtlich):** „Okay, das ist schon ein guter Start.“ – mit dem Auftrag,
Wochentag und Uhrzeit der Wiederholung zu ergänzen (Screenshot der Auswahl „Wöchentlich“). → **teilweise bestanden**,
Erweiterung als Korrektur-Flow-State **FS-006 (C06a)**.

**Guards (Claude):** keine neuen Abhängigkeiten ✔ · neue gespeicherte Felder nur am Plan (Rhythmus, Enddatum),
keine personenbezogenen Daten ✔ · Terminberechnung begrenzt auf den angefragten Zeitraum (keine Endlosschleife) ✔.

## 5. Alpha-Reflexion
Beobachtung Claude: Wochentag und Uhrzeit wurden in der Chunkbeschreibung nicht genannt – erst im Test fiel auf,
dass Trainer:innen in festen Trainingszeiten denken („dienstags 18 Uhr“). Erkenntnis: Bei Planungsfunktionen
vorab nach dem realen Ablauf im Verein fragen.

## 6. Abschluss
Weiter in FS-006 (C06a) auf Basis dieses Branches.
