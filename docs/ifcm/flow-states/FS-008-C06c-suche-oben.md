# FS-008 · C06c – Suchzeile über dem Bereich „Heute“ (Erweiterung zu C06)

| Feld | Wert |
|---|---|
| Zeitraum | 04.11.2026 – 04.11.2026 |
| Chunk | C06 (Erweiterung „C06c“) |
| Ausgewählt von | Entwickler:in – Ergebnis des Alpha-Tests von FS-007 |
| Vorgänger | [FS-007](FS-007-C06b-heute-bereich.md) |
| Branch / Commits | `ifcm/fs-008-c06c-suche-oben` (enthält C01–C06b), Commit `03f3943` |
| Status | **bestanden** (Merge: Freigabe offen) |

## 1. Chunk & Ziel
Die Suchzeile „Pläne durchsuchen…“ steht über dem Bereich „Heute“ statt darunter.

## 2. Prompts
### Prompt 1 – 04.11.2026 (Entwickler:in, wörtlich, mit Screenshot der Planübersicht)
> Okay, das ist gut. Agiere als erfahrener Programmierer und mache es möglich das die Suchzeile über dem
> gesonderten Bereich erscheint. Ändere dies also im Code und Kommentiere es mit CO6c.

Patterns (Richtlinie): 1 ✔ (Kennzeichnung „C06c“) · 3 Persona ✔ · Screenshot als Kontext. Keine Rückfragen.
**Annahme Claude:** Die Suche filtert weiterhin nur die Planliste unten; der Bereich „Heute“ bleibt immer vollständig.

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/pages/PlansOverview.tsx` | Reihenfolge getauscht: Kopfzeile → **Suche** → Bereich „Heute“ → Planliste; Kommentar `// IFCM FS-008 / C06c` |

**Build/Lint:** grün, 0 Fehler. **Oberflächentest (Playwright):** Suchzeile liegt über dem Bereich „Heute“ ✔ ·
Suche nach „Morgen“ blendet den heutigen Plan im Bereich „Heute“ nicht aus ✔.
Nachweis: [assets/fs008-nachweis.png](../assets/fs008-nachweis.png)

## 4. Alpha-Test
**Bewertung (Entwickler:in, 04.11.2026):** „Die Ergebnisse sind grade echt zufriedenstellend.“ → **bestanden**

**Guards (Claude):** reine Umstellung der Anzeige, keine Daten, keine Abhängigkeiten ✔.

## 5. Alpha-Reflexion
Durchgeführt von der Entwickler:in (Coach) am 04.11.2026; Inhalte liegen bei der Entwickler:in. *Bei Bedarf nachtragen.*

## 6. Abschluss
C06 inkl. C06a–C06c **fertig** (04.11.2026). C07 baut auf diesem Branch auf.
