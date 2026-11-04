# FS-010 · C08 – Notizzettel an Übungen

| Feld | Wert |
|---|---|
| Zeitraum | 04.11.2026 – *offen* |
| Chunk | C08 (siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in (Compass Navigator) – nächster Chunk laut Reihenfolge (… → C07 → **C08**) |
| Vorgänger | – |
| Branch / Commits | `ifcm/fs-010-c08-notizzettel` (enthält C01–C08), Commit `45d233b` |
| Status | **Ergebnis liegt vor – Alpha-Test offen** |

## 1. Chunk & Ziel
Im Timer-Screen öffnet ein Stift-Icon im Kreis einen Notizzettel zur Übung – „wie eine Erinnerung fürs nächste Mal
der Anwendung“ (Mindmap-Skizze: Übung, Kreis mit Stift-Icon, Buttons „Pause“ und „Schließen“). Beim nächsten Start
der Übung ist die Notiz wieder da. Bezug: B4 („Notizen für z. B. Reflexion/Notizen“). Der orange markierte
„Reflexionszettel“ ist ausdrücklich nicht Teil dieser Phase.

Vorab genannte Prüfpunkte (Claude, 04.11.2026):
1. Notiz gehört zur Übung: eine Notiz pro Übung (nicht pro Plan), gespeichert an der Übung, damit sie in jedem
   Plan und beim nächsten Mal wieder erscheint; alte Übungen ohne Notiz bleiben gültig. Sichtbar als Hinweis auf
   der Übungskarte und in der Planansicht.
2. Bedienung im Timer wie in der Skizze: Stift-Icon im Kreis öffnet die Notiz, ohne den Countdown zu stören;
   automatisch speichern, auf dem Handy mit Tastatur gut bedienbar; Design des Timers bleibt erhalten.
3. Abgrenzung und Guards: kein Reflexionszettel (orange); reiner Text mit Längengrenze, nur lokal gespeichert;
   Hinweis im Notizfeld, keine personenbezogenen Daten von Sportler:innen (z. B. Minderjährige) einzutragen.

## 2. Prompts
### Prompt 1 – 04.11.2026 (Entwickler:in, wörtlich)
> Agiere als erfahrener Programmierer und setzte dies, mit den entsprechenden Kommentaren im Code, sowie der
> Dokumentation um

Patterns (Richtlinie): 1 ✔ · 3 Persona ✔ · Kontext aus Chunkbeschreibung und 3 Prüfpunkten. Keine Rückfragen.
**Annahmen Claude:** eine Notiz pro Übung; max. 500 Zeichen; Speichern bei jeder Eingabe; vorhandene Notiz wird
beim Öffnen des Timers als Erinnerung angezeigt (antippen = bearbeiten); Notiz leeren = Notiz löschen; Bearbeitung
nur im Timer (das Übungsformular behält eine vorhandene Notiz unverändert).

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/types.ts` | `Exercise.note?: string` (optional, alte Übungen bleiben gültig) |
| `src/lib/note.ts` (neu) | `MAX_NOTE_LENGTH = 500`, `NOTE_PRIVACY_HINT`, `cleanNote` (kürzen; nur Leerzeichen = keine Notiz) |
| `src/context/AppDataContext.tsx` | `updateExerciseNote(id, note)` – speichert bereinigt, leere Notiz entfernt das Feld |
| `src/components/Timer.tsx` | Stift-Icon im Kreis unter der Zeit (Skizze); Notizfeld mit Zeichenzähler, Datenschutz-Hinweis, automatischem Speichern; geschlossen: Notiz als Erinnerung; Dialog scrollbar (Handy-Tastatur) |
| `src/components/ExerciseCard.tsx` | Notiz gekürzt auf der Übungskarte |
| `src/pages/PlanDetail.tsx` | Notiz unter der Übung in der Planansicht |
| `README.md` | Funktionsbeschreibung ergänzt |

Kennzeichnung: `// IFCM FS-010 / C08`. Keine neue Abhängigkeit. Reflexionszettel (orange) nicht umgesetzt.
**Build/Lint:** grün, 0 Fehler (2 bekannte Warnungen).
**Oberflächentest (Playwright):** Countdown läuft beim Schreiben weiter (01:59 → 01:57) ✔ · Notiz sofort gespeichert ✔
· Notiz in der Planansicht ✔ · beim nächsten Start als Erinnerung sichtbar ✔ · nur Leerzeichen → Notiz entfernt ✔ ·
Begrenzung 500 Zeichen ✔ · Übungskarte zeigt Notiz ✔ · Bearbeiten der Übung über das Formular behält die Notiz ✔.
Nachweis: [assets/fs010-nachweis.png](../assets/fs010-nachweis.png) (Timer mit Notiz · Erinnerung beim nächsten Start · Übungskarte)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-010-c08-notizzettel` – noch nicht auf der Live-Seite.

## 4. Alpha-Test – *offen, durch Entwickler:in*
**Guards (Claude):** keine neuen Abhängigkeiten ✔ · Notiz wird als Text dargestellt (kein HTML) ✔ · Längengrenze ✔ ·
nur lokale Speicherung ✔ · Hinweis gegen personenbezogene Daten im Notizfeld ✔.

## 5. Alpha-Reflexion
*offen*

## 6. Abschluss
*offen*
