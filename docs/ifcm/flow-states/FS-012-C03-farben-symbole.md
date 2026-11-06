# FS-012 · C03 – Farben & Symbole je Sportart

| Feld | Wert |
|---|---|
| Zeitraum | 04.11.2026 – 06.11.2026 |
| Chunk | C03 (siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in (Compass Navigator) – nächster Chunk laut Reihenfolge (… → C08 → **C03**) |
| Vorgänger | – (baut auf C02 auf: neue Sportarten zeigen bisher das neutrale 🏅) |
| Branch / Commits | `ifcm/fs-012-c03-farben-symbole` (enthält C01–C08 und C03), Commit `b058b2b` |
| Status | **bestanden** (Merge: Freigabe offen) |

## 1. Chunk & Ziel
Symbole und Farbakzente passen sich der gewählten Sportart an. Bezug: A1 („Individuelles Design (Symbole etc.)“),
Mindmap „Mehr Sportarten → Farben/Symbole passend zur Sportart“.

Vorab genannte Prüfpunkte (Claude, 04.11.2026):
1. Ein Symbol für jede Sportart: passende Emojis für alle 12 vordefinierten Sportarten (z. B. ⚽ 🏀 🎾 🏸 🏊);
   Volleyball und Beach Volleyball unterscheiden sich über die Farbe; eigene Sportarten bekommen ein wählbares
   Symbol (Vorschlag: kleine Auswahl beim Anlegen) statt immer 🏅.
2. Farben nur als Akzent, Design erhalten (A3): je Sportart eine Akzentfarbe für Sportart-Abzeichen, Bereich
   „Heute“ und kleine Hervorhebungen – Hauptbuttons und Grundlayout bleiben im bekannten Blau; Kontrast auf dem
   dunklen Hintergrund prüfen; zentral über eine CSS-Variable.
3. Darstellung und Rechte: Emojis kommen aus der Schrift des Geräts (sehen auf Android/iOS/Windows leicht anders
   aus, keine Lizenzkosten); keine neuen Bildpakete oder Icon-Bibliotheken; Logo und Markenfarben bleiben unverändert.

## 2. Prompts
### Prompt 1 – 04.11.2026 (Entwickler:in, wörtlich)
> Agiere als erfahrener Programmierer und setzte dies, mit den entsprechenden Kommentaren im Code, sowie der
> Dokumentation um

Patterns (Richtlinie): 1 ✔ · 3 Persona ✔ · Kontext aus Chunkbeschreibung und 3 Prüfpunkten. Keine Rückfragen.
**Annahmen Claude:** Symbol- und Farbzuordnung siehe Tabelle; Tischtennis behält das bisherige Himmelblau;
Rot bleibt „überfällig“ vorbehalten; Farbe eigener Sportarten wird aus dem Namen berechnet (nicht wählbar),
Symbol ist aus 16 Vorschlägen wählbar; Sportfarbe nur in Abzeichen, Bereich „Heute“ und Auswahl – Buttons und
Navigation bleiben blau. Hinweis: Die Design-Regel in `index.css` („Akzente ausschließlich in einer Dunkelblau-Skala“)
wird damit für den Sportart-Akzent bewusst erweitert.

## 3. Ergebnis
| Sportart | Symbol | Farbe | Kontrast auf Hintergrund / Fläche |
|---|---|---|---|
| Tischtennis | 🏓 | `#38bdf8` | 8,9 / 7,4 |
| Beach Volleyball | 🏐 | `#facc15` | 12,5 / 10,3 |
| Badminton | 🏸 | `#e879f9` | 7,8 / 6,4 |
| Basketball | 🏀 | `#fb923c` | 8,5 / 7,0 |
| Fußball | ⚽ | `#4ade80` | 11,0 / 9,1 |
| Gym/Fitness | 🏋️ | `#a78bfa` | 7,0 / 5,8 |
| Handball | 🤾 | `#f472b6` | 7,2 / 6,0 |
| Leichtathletik | 🏃 | `#fbbf24` | 11,5 / 9,5 |
| Schwimmen | 🏊 | `#2dd4bf` | 10,3 / 8,5 |
| Tennis | 🎾 | `#a3e635` | 12,7 / 10,5 |
| Turnen | 🤸 | `#818cf8` | 6,4 / 5,3 |
| Volleyball | 🏐 | `#93c5fd` | 10,6 / 8,8 |

Alle Werte ≥ 4,5:1 (WCAG AA für Text); schlechtester Wert 5,3 (Turnen auf Fläche).

| Datei | Änderung |
|---|---|
| `src/lib/sport.ts` | `SPORT_EMOJI` für alle 12 Sportarten, `SPORT_COLORS`, `CUSTOM_SPORT_EMOJIS` (16 Vorschläge), `sportColor()` (eigene Sportarten: stabile Farbe aus dem Namen), `sportEmoji()` mit eigenen Symbolen |
| `src/context/SportContext.tsx` | eigene Symbole gespeichert (`customSportEmojis`, getrennt von `customSports` → keine Datenumwandlung); `emoji`, `color`, `emojiFor`, `colorFor`; setzt CSS-Variable `--color-sport`; Symbol wird beim Löschen der Sportart mit entfernt |
| `src/index.css` | Theme-Farbe `--color-sport` (Standard Tischtennis) → Tailwind-Klassen `text-sport`, `bg-sport/15`, `border-sport/40` |
| `src/components/PillSelect.tsx` | optionale eigene Beschriftung (`renderOption`) |
| `src/pages/Settings.tsx` | Sportarten mit Symbol + Farbpunkt; Symbolauswahl beim Anlegen eigener Sportarten; eigene Sportarten mit Symbol in der Liste |
| `MobileTopBar`, `Sidebar` | Sportart-Abzeichen in der Sportfarbe |
| `TodayTraining` | Bereich „Heute“ mit Rahmen, Verlauf und Icon in der Sportfarbe |
| `PlansOverview`, `Statistics` | Symbol aus dem Context (inkl. eigener Sportarten) |
| `README.md` | Funktionsbeschreibung ergänzt |

Kennzeichnung: `// IFCM FS-012 / C03`. Keine neue Abhängigkeit, keine Bilddateien.
**Build/Lint:** grün, 0 Fehler (2 bekannte Warnungen).
**Oberflächentest (Playwright):** Tischtennis 🏓 + `#38bdf8` ✔ · Fußball ⚽ + `#4ade80`, Icon im Bereich „Heute“ grün ✔ ·
bestehende eigene Sportart „Hockey“ ohne Symbol → 🏅 + berechnete Farbe ✔ · neue Sportart „Kanupolo“ mit 🛶 angelegt,
Symbol gespeichert ✔ · nach Löschen Symbol entfernt, Farbe zurück auf Tischtennis ✔.
Nachweis: [assets/fs012-nachweis.png](../assets/fs012-nachweis.png) (Tischtennis · Fußball · Einstellungen)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-012-c03-farben-symbole` – noch nicht auf der Live-Seite.

## 4. Alpha-Test
**Bewertung (Entwickler:in, 06.11.2026):** Steuerwort „Vorarbeit“ (= Ergebnis zufriedenstellend) → **bestanden**

**Guards (Claude):** keine neuen Abhängigkeiten, keine Bild-/Icon-Pakete (keine Lizenzfragen) ✔ · Logo und
Markenfarben unverändert ✔ · neue lokale Daten nur Symbole eigener Sportarten ✔.

## 5. Alpha-Reflexion
Durchgeführt von der Entwickler:in (Coach); Inhalte liegen bei der Entwickler:in. *Bei Bedarf nachtragen.*

## 6. Abschluss
C03 **fertig** (06.11.2026). C09 baut auf diesem Branch auf.
