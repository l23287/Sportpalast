# FS-013 · C09 – Zielsetzungstool

| Feld | Wert |
|---|---|
| Zeitraum | 06.11.2026 – *offen* |
| Chunk | C09 (siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in (Compass Navigator) – Steuerwort „Vorarbeit“, nächster Chunk laut Reihenfolge (… → C03 → **C09**) |
| Vorgänger | – |
| Branch / Commits | `ifcm/fs-013-c09-zielsetzungstool` (enthält C01–C09), Commit `ea1935f` |
| Status | **Ergebnis liegt vor – Alpha-Test offen** |

## 1. Chunk & Ziel
„Ganz neues Zielsetzungstool“ aus der Mindmap: bis zu **3 Kernziele** im Einstellungsbereich eintragen und die Ziele
**motivierend anzeigen**. Skizze: Screen „Deine Ziele“ mit 3 Feldern, darunter „Sportart“ als Kachelraster, in der
Reihenfolge verschiebbar. Kein Feedback-Bezug (eigene Idee), Priorität laut Chunkliste niedrig; Mindmap-Notiz:
„Wissen zur Zielsetzung nötig?!“.

Vorab genannte Prüfpunkte (Claude, 06.11.2026):
1. Fachlich fundiert, aber schlank: Eingabehilfe nach der SMART-Regel (spezifisch, messbar, attraktiv, realistisch,
   terminiert) als kurze Hinweise bzw. Beispielziele – beantwortet die Mindmap-Frage „Wissen zur Zielsetzung nötig?“,
   ohne das Formular zu überladen; höchstens 3 Ziele, je Sportart getrennt (wie C01), optional mit Zieldatum.
2. Motivierend anzeigen, ohne Design zu sprengen: Ziele als eigener Block (Vorschlag: in der Planübersicht unter
   „Heute“ und in den Einstellungen), Ziel als erreicht abhakbar, ggf. Fortschritt/Restzeit bis zum Zieldatum; in der
   Sportfarbe aus C03.
3. Sportart-Kacheln verschiebbar (Skizze): Reihenfolge der Sportarten in den Einstellungen per Ziehen bzw. ↑/↓
   (barrierefrei, auf dem Handy bedienbar) speichern; Datenschutz: Ziele sind Trainer:innen-Ziele, keine
   personenbezogenen Daten von Sportler:innen (Hinweis wie bei den Notizen).

## 2. Prompts
### Prompt 1 – 06.11.2026 (Entwickler:in, wörtlich)
> Ja, grundsätzlich sind die Vorschläge gut und besonders in Punkt 2 stimme ich dir zu. Bitte agiere als erfahrener
> Programmierer und belese dich erst hier: https://karrierebibel.de/smart-methode/ bevor du, den Code, samt
> Dokumentation umsetzt.

Patterns (Richtlinie): 2 Fact-Check ✔ (erst Quelle lesen, dann umsetzen) · 3 Persona ✔ · 1 Ausgabeformat ✔.
**Recherche:** Die Seite war im Netzwerk der Cloud-Umgebung zunächst gesperrt; mit Zustimmung der Entwickler:in
wurde `karrierebibel.de` in der Umgebung „NaviApp“ freigegeben. Zusammenfassung und Abgleich:
[../quellen/smart-methode.md](../quellen/smart-methode.md).
**Annahmen Claude:** SMART-Check als Hinweis (blockiert nicht); Realistisch per Selbsteinschätzung; max. 3 *offene*
Ziele (erreichte zählen nicht mit); Ziele je Sportart; Sportart-Reihenfolge mit ↑/↓ statt Ziehen (barrierefrei,
auf dem Handy zuverlässig); Messgröße und Zieldatum optional.

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/lib/goals.ts` (neu) | SMART-Regeln mit Quellenangabe: `MAX_OPEN_GOALS = 3`, `smartCheck` (S ≥ 5 Wörter, M Messgröße oder Zahl, A ohne Verneinung, R Häkchen, T Datum), `SMART_LABELS` mit Tipps, Beispielziele, `daysUntil`, `formatRemaining`, `timeProgress` |
| `src/types.ts` | Typen `Goal`, `GoalInput` |
| `src/context/GoalsContext.tsx` (neu) | Ziele speichern (lokal), je Sportart filtern, Limit 3 offene Ziele, abhaken/wieder öffnen, bearbeiten, löschen |
| `src/components/GoalForm.tsx` (neu) | Zielformular: Ziel, Messgröße, Zieldatum, Realitäts-Check, SMART-Kacheln live, Tipp, Beispiele, Datenschutz-Hinweis |
| `src/components/GoalsBoard.tsx` (neu) | Anzeige: offene Ziele mit Messgröße, Restzeit, Fortschrittsleiste, Abhaken + Erfolgsmeldung, erreichte Ziele; Hinweis „Anpassen“ bei Überschreitung; Modus Übersicht/Verwalten |
| `src/pages/PlansOverview.tsx` | „Deine Ziele“ unter dem Bereich „Heute“ (ohne Ziele: dezenter Hinweis) |
| `src/pages/Settings.tsx` | Bereich „Deine Ziele“ oben (Skizze) mit Formular; „Reihenfolge ändern“ für Sportarten; Ziele werden beim Löschen einer eigenen Sportart mit gelöscht |
| `src/context/SportContext.tsx` | gespeicherte Sportart-Reihenfolge (`sportOrder`), `moveSport` |
| `src/App.tsx` | `GoalsProvider` eingebunden |
| `README.md` | Funktionsbeschreibung ergänzt |

Kennzeichnung: `// IFCM FS-013 / C09`. Keine neue Abhängigkeit.
**Build/Lint:** grün, 0 Fehler (2 bekannte Warnungen).
**Logiktest (8 Fälle):** vages Ziel nur „A“ ✔ · vollständiges Ziel 5/5 ✔ · Verneinung → A offen ✔ · Zahl → M ✔ ·
Tage/Restzeittexte ✔ · Fortschritt 50 % und Begrenzung ✔.
**Oberflächentest (Playwright):** SMART-Check 1/5 → 4/5 mit Tipp „Realistisch“ → 5/5 ✔ · nach 3 Zielen verschwindet
das Formular mit Hinweis ✔ · Übersicht zeigt 3/3 mit Messgröße und „noch 86 Tage“ ✔ · Abhaken → „Stark! … ist erreicht. 🎉“,
Ziel durchgestrichen in „erreicht“ ✔ · Fußball hat eigene (leere) Ziele ✔ · Fußball viermal nach oben → Platz 1,
nach Neuladen erhalten ✔. Nachweis: [assets/fs013-nachweis.png](../assets/fs013-nachweis.png)
(Formular · Übersicht · Feiern · Reihenfolge)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-013-c09-zielsetzungstool` – noch nicht auf der Live-Seite.

## 4. Alpha-Test – *offen, durch Entwickler:in*
**Guards (Claude):** keine neuen Abhängigkeiten ✔ · Ziele nur lokal gespeichert, Längengrenzen, Text statt HTML ✔ ·
Datenschutz-Hinweis im Formular ✔ · Quelle dokumentiert, Inhalte zusammengefasst statt kopiert (Urheberrecht) ✔ ·
Umgebung: Netzwerkfreigabe `karrierebibel.de` (nur lesend, nach Zustimmung).

## 5. Alpha-Reflexion
*offen*

## 6. Abschluss
*offen*
