# FS-002 · C02 – Mehr Sportarten & eigene Sportart

| Feld | Wert |
|---|---|
| Zeitraum | 03.11.2026 – *offen* |
| Chunk | C02 (siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in (Compass Navigator) – nächster Chunk laut freigegebener Reihenfolge |
| Vorgänger | – (baut fachlich auf FS-001 / C01 auf) |
| Branch / Commits | `ifcm/fs-002-c02-mehr-sportarten` (abgezweigt vom C01-Branch, enthält C01 + C02), Commit `7f1501a` |
| Status | **Ergebnis liegt vor – Alpha-Test offen** |

## 1. Chunk & Ziel
Weitere Sportarten stehen zur Auswahl (z. B. Fußball, Gym/Fitness), und Nutzer:innen können eine eigene
Sportart per Freitextfeld anlegen. Jede neue Sportart ist dank C01 automatisch ein eigener Bereich.
Bezug: A2 („gym als Sportart hinzufügen“), A6, A7 („mehr Sportarten“). Zielbezug: App für alle Sportarten.

Vorab genannte Prüfpunkte (Claude, 03.11.2026):
1. Datenmodell öffnen, ohne C01 zu brechen: `Sport` wird vom festen Typ zu einer erweiterbaren Liste;
   gespeicherte Daten und die Trennung bleiben unverändert.
2. Klare Abgrenzung: keine Farben/Symbole je Sportart (C03), Aufschlagtraining bleibt unverändert (C04);
   neue Sportarten bekommen vorerst ein neutrales Symbol.
3. Eigene Sportart absichern: Name nicht leer, keine Dubletten (auch nicht in anderer Schreibweise),
   sinnvolle Länge; Umgang mit dem Löschen einer eigenen Sportart klären.

## 2. Prompts
### Prompt 1 – 04.11.2026 (Entwickler:in, wörtlich)
> Agiere als erfahrener Programmierer und setzte dies um

Patterns (Richtlinie): 3 Persona ✔ · übrige über den Kontext (Chunkbeschreibung und 3 Prüfpunkte aus der
vorherigen Nachricht). Keine Antwort auf die Merge-Frage zu C01 → wie angekündigt auf dem C01-Branch aufgebaut.

**Annahmen Claude** (als erfahrener Teamkollege getroffen, korrigierbar):
- Vordefinierte Liste: Tischtennis, Beach Volleyball, Badminton, Basketball, Fußball, Gym/Fitness, Handball,
  Leichtathletik, Schwimmen, Tennis, Turnen, Volleyball.
- Eigene Sportart: max. 30 Zeichen, Dubletten unabhängig von Groß-/Kleinschreibung und Leerzeichen verboten;
  nach dem Anlegen wird sie direkt ausgewählt.
- Löschen nur bei eigenen Sportarten; löscht nach Sicherheitsabfrage (mit Anzahl) auch deren Pläne und
  Übungen; war sie aktiv, wird auf Tischtennis gewechselt.
- Neue Sportarten zeigen bis C03 das neutrale Symbol 🏅.

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/types.ts` | `Sport` wird zu `string`; `SPORTS` enthält 12 vordefinierte Sportarten |
| `src/lib/sport.ts` | `sportEmoji()` mit neutralem Fallback; `sportKey()`, `validateSportName()`, `isPredefinedSport()`, `MAX_SPORT_NAME_LENGTH` |
| `src/context/SportContext.tsx` | eigene Sportarten gespeichert (`customSports`), `sports` = vordefiniert + eigene, `addCustomSport`, `removeCustomSport`; Rückfall auf Tischtennis, falls die gespeicherte Sportart nicht mehr existiert |
| `src/context/AppDataContext.tsx` | `countForSport`, `deleteAllForSport` (für das Löschen eigener Sportarten) |
| `src/pages/Settings.tsx` | Auswahl aller Sportarten, Formular „Eigene Sportart hinzufügen“ mit Fehlermeldungen, Liste eigener Sportarten mit Löschen + Sicherheitsabfrage |
| `Sidebar`, `MobileTopBar`, `PlansOverview`, `Statistics` | `sportEmoji(sport)` statt `SPORT_EMOJI[sport]` |

Alle Änderungen sind mit `// IFCM FS-002 / C02` gekennzeichnet. Umfang: 9 Dateien, +228 / −20 Zeilen.
**Build/Lint:** grün, 0 Fehler (2 bekannte Warnungen).
**Automatischer Kurztest (Claude, Playwright):** leerer Name → Fehlermeldung ✔ · „fußball“ → „gibt es bereits“ ✔
· „Hockey“ angelegt und aktiv ✔ · „ hockey “ → Dublette ✔ · Hockey-Bereich leer, eigener Plan nur dort ✔ ·
Fußball zeigt 🏅 ✔ · Löschen von Hockey: Dialog nennt 1 Plan, danach Plan entfernt, Tischtennis aktiv,
Alt-Plan unverändert ✔. Screenshot: [assets/fs002-einstellungen.png](../assets/fs002-einstellungen.png)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-002-c02-mehr-sportarten` (`npm install`, `npm run dev`) –
noch **nicht** auf der Live-Seite.

## 4. Alpha-Test – *offen, durch Entwickler:in*
**Guards (Claude):** keine neuen Abhängigkeiten, keine Secrets ✔ · Eingaben werden geprüft und als Text
(nicht als HTML) dargestellt ✔ · neue lokale Daten: nur Namen eigener Sportarten, keine personenbezogenen Daten ✔.

## 5. Alpha-Reflexion
*offen*

## 6. Abschluss
*offen*
