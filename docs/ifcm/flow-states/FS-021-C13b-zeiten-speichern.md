# FS-021 · C13b – 10 Zeiten speichern und benennen (Erweiterung zu C13)

| Feld | Wert |
|---|---|
| Zeitraum | 09.11.2026 – 09.11.2026 |
| Chunk | C13 (Erweiterung „C13b“) |
| Ausgewählt von | Entwickler:in – Ergebnis des Alpha-Tests von FS-020 |
| Vorgänger | [FS-020](FS-020-C13a-stoppuhr-menue.md) |
| Branch / Commits | `ifcm/fs-021-c13b-zeiten-speichern` (enthält alle bisherigen Chunks), Commit `9b06669` |
| Status | **bestanden** (Merge: Freigabe offen) |

## 1. Chunk & Ziel
An der (freien) Stoppuhr lassen sich bis zu **10 Zeiten speichern und benennen**; die gespeicherten Zeiten stehen
**direkt unter der Stoppuhr**.

## 2. Prompts
### Prompt 1 – 09.11.2026 (Entwickler:in, wörtlich)
> Okay, gut aber mache es möglich 10 Zeiten zu speichern und zu benennen. Die gespeicherten Zeiten sollen unter der
> Stoppuhr selbst stehen. Bitte Programmiere die ´s als erfahrener Programmierer hinzu und Dokumentiere mit C13b. Also Programmiere

**Vorgehen Claude:** gemäß Regel „erst Fragen, dann programmieren“ zuerst 3 Rückfragen (je Sportart?, was passiert bei
der 11. Zeit?, Benennung und Datenschutz) – Code erst nach den Antworten.

**Rückfragen (Claude):** 1. 10 Plätze je Sportart oder gemeinsam? · 2. 11. Zeit: (a) Speichern gesperrt, Hinweis „erst
löschen“ oder (b) älteste ersetzen? · 3. Benennung frei mit Vorschlag; Hinweis „keine Namen von Sportler:innen“ ok?

**Antwort (Entwickler:in, 09.11.2026, wörtlich):** „Zeit kann der Nutzer selber benennen und bitte Variante a“
→ Frage 2: **(a)**; Frage 3: **freie Benennung durch die Nutzer:in**; Frage 1 erneut nachgefragt.

### Prompt 2 – 09.11.2026 (Entwickler:in, wörtlich)
> ja 10 pro Sportart und jetzt bitte Programmieren

→ Frage 1: **10 je Sportart**. Alle Rückfragen geklärt, erst dann programmiert (Regel aus FS-019).
**Annahmen Claude:** ohne Namen → automatischer Name „Zeit vom TT.MM., hh:mm“; Name max. 60 Zeichen; unverbindlicher Hinweis
„keine Namen von Sportler:innen“ (schränkt die freie Benennung nicht ein); Zwischenzeiten werden mitgespeichert.

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/hooks/useSavedTimes.ts` (neu) | gespeicherte Zeiten (lokal, `savedTimes`), je Sportart gefiltert, neueste zuerst; `MAX_SAVED_TIMES = 10`; `saveTime` (bei 10 gesperrt, Variante a), `renameTime`, `deleteTime` |
| `src/components/SavedTimesList.tsx` (neu) | Liste „Gespeicherte Zeiten (x/10)“: Name, Zeit, Datum, Anzahl Bahnen/Runden …; Zwischenzeiten aufklappen; Umbenennen in der Zeile; Löschen mit Sicherheitsabfrage; zweizeilig fürs Handy |
| `src/components/StopwatchPanel.tsx` | optionaler Speicher-Bereich (`renderSave`) mit Zeit, Zwischenzeiten und `reset` |
| `src/pages/StopwatchPage.tsx` | Feld „Name der Zeit“ (Vorschlag je Sportart) + „Zeit speichern“; bei 10 Zeiten Hinweis statt Speichern; Liste direkt unter der Stoppuhr |
| `README.md` | ergänzt |

Kennzeichnung: `// IFCM FS-021 / C13b`. Keine neue Abhängigkeit.
**Build/Lint:** grün, 0 Fehler. **Oberflächentest (Playwright, Schwimmen):** Platzhalter „z. B. 4 × 50 m Kraul – Gruppe A“ ✔ · Zeit mit
2 Bahnen und Namen gespeichert, Stoppuhr zurück auf 0 ✔ · ohne Namen → „Zeit vom 09.11., 19:08“ ✔ · Bahnen aufklappbar ✔ · Umbenennen ✔ ·
10/10 → Hinweis „lösche zuerst eine Zeit“, kein Speichern-Button ✔ · Löschen mit Abfrage → 9/10, Speichern wieder möglich ✔ · nach
Neuladen erhalten ✔ · Leichtathletik 0/10 (je Sportart getrennt) ✔. Korrektur im Test: Zeilen zweizeilig, damit Namen nicht
abgeschnitten werden. Nachweis: [assets/fs021-nachweis.png](../assets/fs021-nachweis.png)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-021-c13b-zeiten-speichern` – noch nicht auf der Live-Seite.

## 4. Alpha-Test
**Bewertung (Entwickler:in, 09.11.2026):** Steuerwort „Vorarbeit“ (= Ergebnis zufriedenstellend) → **bestanden**

**Guards (Claude):** keine neuen Abhängigkeiten ✔ · nur lokal gespeichert, max. 10 je Sportart, Länge begrenzt ✔ · freie
Namen können Personenbezug enthalten → unverbindlicher Hinweis gegen Namen von Sportler:innen ✔.

## 5. Alpha-Reflexion
Durch die Entwickler:in (Coach); Inhalte liegen bei der Entwickler:in. *Bei Bedarf nachtragen.*
Beobachtung Claude: Mit der Regel „erst fragen“ kam C13b ohne Korrekturschleife durch.

## 6. Abschluss
C13 inkl. C13a und C13b **fertig** (09.11.2026). C12 baut auf diesem Branch auf.
