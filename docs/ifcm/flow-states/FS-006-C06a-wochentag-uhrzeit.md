# FS-006 · C06a – Wochentag und Uhrzeit der Wiederholung (Korrektur-Flow-State zu C06)

| Feld | Wert |
|---|---|
| Zeitraum | 04.11.2026 – 04.11.2026 |
| Chunk | C06 (Erweiterung „C06a“) |
| Ausgewählt von | Entwickler:in – Ergebnis des Alpha-Tests von FS-005 |
| Vorgänger | [FS-005](FS-005-C06-wiederkehrende-plaene.md) |
| Branch / Commits | `ifcm/fs-006-c06a-wochentag-uhrzeit` (enthält C01–C06), Commit `81decff` |
| Status | **bestanden** (Merge: Freigabe offen) |

## 1. Chunk & Ziel
Für eine Wiederholung lassen sich zusätzlich ein **Wochentag** und eine **Uhrzeit** festlegen
(z. B. „wöchentlich, dienstags um 18:00 Uhr“).

## 2. Prompts
### Prompt 1 – 04.11.2026 (Entwickler:in, wörtlich, mit Screenshot der Auswahl „Wöchentlich“)
> Okay, das ist schon ein guter Start. Agiere als erfahrener Programmierer und mache es möglich auch noch den
> Wochentag und eine Uhrzeit, der Wiederholung, hinzuzufügen. Ändere dies also im Cod und Kommentiere es mit CO6a.

Patterns (Richtlinie): 1 Ausgabeformat ✔ (Kommentar-Kennzeichnung „C06a“) · 3 Persona ✔. Keine Rückfragen.
**Annahmen Claude:**
- Wochentag nur bei „wöchentlich“ und „alle 2 Wochen“; monatlich bleibt „gleicher Tag im Monat“.
- Erster Termin = erster gewählter Wochentag am oder nach dem Startdatum; das Datumsfeld heißt bei Serien „Startdatum“.
- Der Wochentag folgt dem Startdatum, bis er selbst gewählt wird.
- Die Uhrzeit ist optional und für **alle** Pläne verfügbar (auch einmalige) – bei Serien gilt sie für jeden Termin.
- Kennzeichnung im Code: `// IFCM FS-006 / C06a`.

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/types.ts` | Plan um `recurrenceWeekday` (0 = Mo … 6 = So) und `time` („HH:MM“) erweitert, beide optional |
| `src/lib/recurrence.ts` | `seriesStart` (erster Termin mit Wochentag), `weekdayOfKey`, `usesWeekday`, `WEEKDAY_NAMES`, `formatTime`, `describeRecurrence` („Wöchentlich, dienstags um 18:00 Uhr“); `occurrencesBetween` beginnt bei `seriesStart` |
| `src/pages/PlanForm.tsx` | Felder „Uhrzeit (optional)“ und „Wochentag“ (nur wöchentlich / alle 2 Wochen); Datumsfeld heißt bei Serien „Startdatum“; Prüfung der Uhrzeit |
| `src/components/PlanCard.tsx` | Badge zeigt Uhrzeit („10.11.2026 · 18:00“), Tooltip mit Rhythmus in Worten |
| `src/pages/PlanDetail.tsx` | „Wöchentlich, dienstags um 18:00 Uhr · nächster Termin 10.11.2026“; einmalig mit Uhrzeit |
| `src/pages/CalendarPage.tsx` | Tagesliste nach Uhrzeit sortiert, Uhrzeit vor dem Plannamen |

Pläne aus C06 ohne Wochentag/Uhrzeit verhalten sich unverändert. Keine neue Abhängigkeit.
**Build/Lint:** grün, 0 Fehler (2 bekannte Warnungen).
**Logiktest (Claude, 12 neue Fälle, Berlin + New York):** Start Mi + Wochentag Di → erster Termin Di 10.11. ✔ ·
dienstags im November ✔ · alle 2 Wochen freitags ✔ · Sonntag ✔ · alte C06-Pläne unverändert ✔ · monatlich
ignoriert den Wochentag ✔ · Enddatum vor erstem Termin ✔ · nächster Termin ✔ · Beschreibungstexte ✔.
**Regression:** alle 13 Tests aus FS-005 weiterhin ✔.
**Oberflächentest (Playwright):** Wochentag folgt dem Startdatum (Mittwoch), dann auf Dienstag geändert ✔ · Detail
„Wöchentlich, dienstags um 18:00 Uhr · nächster Termin 10.11.2026“ ✔ · einmaliger Plan zeigt kein Wochentagsfeld ✔
· Kalender: Termine 10./17./24.11. und 1.12. ✔ · Tagesliste 10.11. nach Uhrzeit sortiert (16:30 vor 18:00) ✔.
Nachweis: [assets/fs006-nachweis.png](../assets/fs006-nachweis.png) (Formular · Detail · Kalender).
Hinweis: Der Testbrowser zeigt Datum/Uhrzeit im US-Format (06:00 PM); auf deutschen Geräten erscheint 18:00.

**Testmöglichkeit:** lokal im Branch `ifcm/fs-006-c06a-wochentag-uhrzeit` – noch nicht auf der Live-Seite.

## 4. Alpha-Test
**Bewertung (Entwickler:in, 04.11.2026):** „Okay, das ist gut.“ → **bestanden**; direkt anschließend Erweiterung C06b (FS-007).

**Guards (Claude):** keine neuen Abhängigkeiten ✔ · Uhrzeit wird auf HH:MM geprüft ✔ · keine personenbezogenen Daten ✔.

## 5. Alpha-Reflexion
Von der Entwickler:in nicht gesondert übermittelt. *Bei Bedarf nachtragen.*

## 6. Abschluss
C06a fertig (04.11.2026). Weiter mit FS-007 (C06b) auf Basis dieses Branches.
