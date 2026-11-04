# FS-007 · C06b – Bereich „Heute“ in der Trainingsplan-Übersicht (Erweiterung zu C06)

| Feld | Wert |
|---|---|
| Zeitraum | 04.11.2026 – *offen* |
| Chunk | C06 (Erweiterung „C06b“) |
| Ausgewählt von | Entwickler:in – im Anschluss an den bestandenen Alpha-Test von FS-006 |
| Vorgänger | [FS-006](FS-006-C06a-wochentag-uhrzeit.md) |
| Branch / Commits | `ifcm/fs-007-c06b-heute-bereich` (enthält C01–C06a), Commit `df7196f` |
| Status | **Ergebnis liegt vor – Alpha-Test offen** |

## 1. Chunk & Ziel
Die Übungen, die am jeweiligen Tag anstehen, erscheinen direkt oben in der Trainingsplan-Übersicht in einem
gesonderten Bereich. Zielbezug: Entlastung bei Organisation und Durchführung – auf einen Blick sehen, was heute ansteht.

## 2. Prompts
### Prompt 1 – 04.11.2026 (Entwickler:in, wörtlich)
> Okay, das ist gut. Agiere als erfahrener Programmierer und mache es möglich das die Übungen, welche an dem
> jeweiligen Tag anstehen direkt oben bei den Trainingsplänen erscheinen, in einem gesonderten Bereich. Ändere
> dies also im Code und Kommentiere es mit CO6b.

Patterns (Richtlinie): 1 Ausgabeformat ✔ (Kennzeichnung „C06b“) · 3 Persona ✔. Keine Rückfragen.
**Annahmen Claude:**
- „Jeweiliger Tag“ = heute. Der Bereich zeigt alle Pläne mit Termin heute (einmalig oder Wiederholung), sortiert
  nach Uhrzeit, jeweils mit ihren Übungen in der geplanten Reihenfolge und Dauer.
- Steht heute nichts an, nennt der Bereich den nächsten Termin (bis 60 Tage voraus); gibt es gar keine Termine,
  wird der Bereich ausgeblendet und die Übersicht sieht aus wie bisher.
- Nur Pläne der aktuellen Sportart (C01).

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/components/TodayTraining.tsx` (neu) | Bereich „Heute“: heutige Termine über `plansByDay` (gleiche Logik wie Kalender, inkl. Wiederholungen), sortiert nach Uhrzeit; je Plan Uhrzeit, Name, Gesamtdauer, nummerierte Übungsliste; Link zum Plan; sonst „Nächster Termin“ |
| `src/pages/PlansOverview.tsx` | Bereich zwischen Kopfzeile und Suche eingebunden |
| `README.md` | Funktionsbeschreibung ergänzt |

Kennzeichnung im Code: `// IFCM FS-007 / C06b`. Keine neue Abhängigkeit, keine neuen gespeicherten Daten.
**Build/Lint:** grün, 0 Fehler (2 bekannte Warnungen).
**Oberflächentest (Playwright, heute = Mi 04.11.2026):** wöchentlicher Mittwochsplan (Start 07.10.) und einmaliger
Plan heute erscheinen, sortiert 16:30 vor 18:00, mit Übungen 1–3 und Dauer ✔ · Plan anderer Sportart heute nicht
sichtbar ✔ · Plan von morgen nicht im Bereich ✔ · ohne heutigen Termin: „Nächster Termin: Morgen-Plan am
05.11.2026, 17:00 Uhr“ ✔ · ohne datierte Pläne kein Bereich ✔ · Korrektur während des Tests: Einzahl „1 Übung“
und auf dem Handy nur Pfeil statt „Zum Plan“, damit Plannamen nicht abgeschnitten werden.
Nachweis: [assets/fs007-nachweis.png](../assets/fs007-nachweis.png)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-007-c06b-heute-bereich` – noch nicht auf der Live-Seite.

## 4. Alpha-Test – *offen, durch Entwickler:in*
**Guards (Claude):** keine neuen Abhängigkeiten, keine neuen Daten ✔.

## 5. Alpha-Reflexion
*offen*

## 6. Abschluss
*offen*
