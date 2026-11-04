# FS-004 · C05 – Kalendertool

| Feld | Wert |
|---|---|
| Zeitraum | 04.11.2026 – 04.11.2026 |
| Chunk | C05 (siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in (Compass Navigator) – nächster Chunk laut Reihenfolge (C01 → C02 → C04 → **C05**) |
| Vorgänger | – (nutzt den in C04 frei gewordenen Navigationsplatz) |
| Branch / Commits | `ifcm/fs-004-c05-kalendertool` (enthält C01 + C02 + C04 + C05), Commit `6fc59fa` |
| Status | **bestanden** (Merge in den Hauptbranch: Freigabe offen) |

## 1. Chunk & Ziel
Ein Kalender-Icon kommt auf den frei gewordenen Platz in der Navigation. Dahinter liegt eine Monatsansicht, die
alle Trainingspläne mit Datum der aktuellen Sportart zeigt; ein Tipp auf einen Tag listet die Pläne dieses Tages
und führt zum Plan (Vorschlag Claude: von dort auch „Plan für diesen Tag anlegen“). Bezug: A7, Mindmap
„Kalendertool verankern → Kalender-Icon“. Voraussetzung für C06 (wiederkehrende Pläne).

Vorab genannte Prüfpunkte (Claude, 04.11.2026):
1. Auf Vorhandenem aufbauen: Pläne haben bereits ein Datumsfeld – der Kalender zeigt nur Pläne der aktuellen
   Sportart (C01); keine Wiederholungen (C06), aber so gebaut, dass C06 andocken kann.
2. Ohne neue Bibliothek und mit korrektem Datum: schlanker eigener Monatskalender (kein Budget, keine fremde
   Abhängigkeit), deutsche Monats-/Wochentagsnamen, Woche beginnt Montag, keine Verschiebung durch Zeitzonen.
3. Handy zuerst und Design erhalten: Monatsraster muss auf dem Handy lesbar sein; überfällige Pläne wie in der
   Planübersicht rot markieren; „heute“ hervorheben.

## 2. Prompts
### Prompt 1 – 04.11.2026 (Entwickler:in, wörtlich)
> Agiere als erfahrener Programmierer und setzte dies, mit den entsprechenden Kommentaren im Code, sowie der
> Dokumentation um

Patterns (Richtlinie): 1 Ausgabeformat ✔ (Kommentare + Dokumentation) · 3 Persona ✔ · Kontext aus
Chunkbeschreibung und 3 Prüfpunkten. Keine Rückfragen nötig.
**Annahmen Claude:** Kalender als 4. Navigationspunkt (Platz des früheren Aufschlagtrainings, vor
„Einstellungen“); „Plan für diesen Tag“ wie in der Chunkbeschreibung vorgeschlagen umgesetzt; „Dokumentation“ =
Kommentare im Code, dieses Protokoll und die App-Beschreibung im `README.md`.

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/lib/calendar.ts` (neu) | Kalender-Logik ohne Bibliothek: `toDateKey`/`parseDateKey` (zeitzonensicher), `buildMonthGrid` (volle Wochen Mo–So), deutsche Monats-/Tagesnamen, `plansByDay` (Pläne je Tag – **Andockpunkt für C06**) |
| `src/pages/CalendarPage.tsx` (neu) | Seite „Kalender“: Monatsnavigation + „Heute“, Raster mit Punkten je Plan (rot = überfällig), heutiger Tag umrandet, Tagesliste mit Links zu den Plänen, Button „Plan für diesen Tag“, Hinweis auf Pläne ohne Datum |
| `src/lib/nav.ts` | Navigationspunkt „Kalender“ auf dem in C04 frei gewordenen Platz → wieder 5 Punkte |
| `src/App.tsx` | Route `/kalender` |
| `src/pages/PlanForm.tsx` | Datum wird aus `?datum=JJJJ-MM-TT` vorausgefüllt (nur gültiges Format, nur beim Neuanlegen) |
| `README.md` | App-Beschreibung auf Stand C01–C05 gebracht (alle Sportarten, Kalender, Aufschlagtraining als Reiter) |

Alle Code-Änderungen sind mit `// IFCM FS-004 / C05` gekennzeichnet bzw. die neuen Dateien im Kopf als C05 ausgewiesen.
Nur Pläne der aktuellen Sportart erscheinen (Filter aus C01). Keine neue Abhängigkeit.
**Build/Lint:** grün, 0 Fehler (2 bekannte Warnungen).
**Automatischer Kurztest (Claude, Playwright, Zeitzone Europe/Berlin):** Navigation 5 Punkte mit Kalender ✔ ·
„November 2026“, erste Woche beginnt Montag 26.10. bis Sonntag 1.11. ✔ · heutiger Plan in der Tagesliste ✔ ·
Plan der Sportart Beach Volleyball nicht sichtbar ✔ · Plan vom 2.11. als „Überfällig“ ✔ · Hinweis „1 Plan hat
kein Datum“ ✔ · Wechsel zu „Dezember 2026“ und Plan am 1.12. ✔ · „Plan für diesen Tag“ am 15.12. öffnet das
Formular mit Datum 2026-12-15 ✔. Screenshot: [assets/fs004-kalender.png](../assets/fs004-kalender.png)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-004-c05-kalendertool` – noch nicht auf der Live-Seite.

## 4. Alpha-Test
**Bewertung (Entwickler:in, 04.11.2026):** „Die Ergebnisse sind grade echt zufriedenstellend.“ → **bestanden**

**Guards (Claude):** keine neuen Abhängigkeiten, keine neuen gespeicherten Daten ✔ · URL-Parameter `datum` wird
auf das Format `JJJJ-MM-TT` geprüft, bevor er übernommen wird ✔.
**Hinweis außerhalb von C05:** Die bestehenden Funktionen `formatDate`/`isOverdue` (`src/lib/time.ts`) lesen
das Datum als UTC und können in Zeitzonen westlich von UTC einen Tag zu früh anzeigen. In Deutschland tritt das
nicht auf → vorgemerkt, nicht geändert.

## 5. Alpha-Reflexion
Durchgeführt von der Entwickler:in (Coach) am 04.11.2026; Inhalte liegen bei der Entwickler:in. *Bei Bedarf hier nachtragen.*

## 6. Abschluss
C05 **fertig** (04.11.2026). Merge nach Freigabe – *offen*. C06 baut auf dem C05-Branch auf.
