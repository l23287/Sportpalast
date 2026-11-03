# FS-001 · C01 – Sportart-Trennung

| Feld | Wert |
|---|---|
| Zeitraum | 03.11.2026 – *offen* |
| Chunk | C01 (siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in (Compass Navigator) – erster Chunk laut freigegebener Reihenfolge; Fundament für C02/C03 |
| Vorgänger | – |
| Branch / Commits | `ifcm/fs-001-c01-sportart-trennung`, Commit `acece3d` |
| Status | **Ergebnis liegt vor – Alpha-Test offen** |

## 1. Chunk & Ziel
Übungen und Trainingspläne gehören zu einer Sportart. Nach einem Wechsel der Sportart erscheinen nur deren
Inhalte; bereits vorhandene Daten werden Tischtennis zugeordnet. Bezug: A1 („Trainingsplan und Übungen müssen
sich zurücksetzen, wenn man die Sportart wechselt“), B5. Zielbezug: App für alle Sportarten.

## 2. Prompts
### Prompt 1 – 03.11.2026 (Entwickler:in, wörtlich)
> okay starten wir mit C01 der Sportarttrennung. Agiere als erfahrener Softwareentwickler und programmiere die
> neue Version für diesen CO1 und mache die Änderungen durch Kommentare kenntlich. Erkläre anschließend was du
> erarbeitet und getan hast, auch auf Code ebene, dies erwarte ich also auch als Output. Gebe vorher in 3
> Stichpunkten an worauf du achten musst, bei diesem Schritt der Programmierung und Weiterentwicklung

Patterns (Richtlinie): 1 Ausgabeformat ✔ (Kommentare im Code + Erklärung) · 2 Fact-Check ✔ (3 Stichpunkte
vorab) · 3 Persona ✔ (erfahrener Softwareentwickler) · 4 Rückfragen – · 5 Abschnitte (✔ implizit: erst
Stichpunkte, dann Code, dann Erklärung) · 6 –
Rückfragen von Claude: keine nötig – Chunk-Inhalt war durch die freigegebene Chunkliste eindeutig.

Vorab genannte Prüfpunkte (Claude):
1. Keine Daten verlieren – alte Einträge ohne Sportart werden Tischtennis zugeordnet (Migration).
2. Nur C01 umsetzen, keine Vermischung mit C02/C03/C04 (Sportartenliste und Aufschlagtraining bleiben unverändert).
3. Bestehendes Verhalten und Design erhalten: Formulare und Seiten bleiben gleich, die Filterung passiert zentral.

## 3. Ergebnis
**Lösungsidee:** Die Trennung passiert an einer zentralen Stelle (`AppDataContext`). Der Speicher behält alle
Einträge aller Sportarten, nach außen gibt der Context aber nur die Einträge der aktuellen Sportart heraus.
Dadurch funktionieren alle Seiten (Pläne, Übungen, Statistiken, Plan-Formular) ohne eigene Änderungen.

| Datei | Änderung |
|---|---|
| `src/types.ts` | Feld `sport` an `Exercise` und `TrainingPlan`; `ExerciseInput`/`PlanInput` ohne `sport` (wird automatisch gesetzt) |
| `src/lib/sport.ts` | `LEGACY_SPORT = 'Tischtennis'`; Funktion `withSport()` ergänzt fehlende Sportart beim Laden (Migration) |
| `src/context/AppDataContext.tsx` | Migration beim Laden; gefilterte Listen `sportPlans`/`sportExercises`; neue Einträge bekommen die aktuelle Sportart; `getPlan`/`getExercise` suchen nur in der aktuellen Sportart |
| `src/pages/PlanForm.tsx` | Bearbeiten-Link eines Plans einer anderen Sportart zeigt „Plan nicht gefunden“ statt eines leeren Formulars |
| `src/pages/PlanDetail.tsx` | Hinweistext um „gehört zu einer anderen Sportart“ ergänzt |
| `src/pages/Settings.tsx` | Hinweis unter der Sportartwahl, dass Inhalte je Sportart getrennt gespeichert werden |

Alle Änderungen sind im Code mit `// IFCM FS-001 / C01` gekennzeichnet. Umfang: 6 Dateien, +72 / −12 Zeilen.
Nicht verändert: Aufschlagtraining (bleibt Tischtennis, Thema von C04), Sportartenliste (C02).

**Build/Lint:** `npm run build` grün · `npm run lint` 0 Fehler (2 Warnungen bestanden schon vorher).
**Automatischer Kurztest (Claude, Playwright):** alte TT-Daten werden angezeigt und mit `sport: "Tischtennis"`
gespeichert ✔ · nach Wechsel auf Beach Volleyball sind TT-Plan und TT-Übung unsichtbar ✔ · neue Übung unter
Beach Volleyball wird mit `sport: "Beach Volleyball"` gespeichert ✔ · nach Rückwechsel ist die TT-Übung wieder da ✔

## 4. Alpha-Test (interne Umgebung) – *offen, durch Entwickler:in*
| Testfall | Erwartet | Ergebnis |
|---|---|---|
| Bestehende Pläne/Übungen nach dem Update öffnen | alles noch da, unter Tischtennis | *offen* |
| Sportart auf Beach Volleyball wechseln → Pläne, Übungen, Statistiken | leer bzw. nur BV-Inhalte | *offen* |
| Unter Beach Volleyball Übung und Plan anlegen | erscheinen nur unter BV | *offen* |
| Zurück zu Tischtennis | TT-Inhalte unverändert, BV-Inhalte unsichtbar | *offen* |
| Plan im Plan-Formular nur Übungen der eigenen Sportart anbieten | Übungspool gefiltert | *offen* |
| Darstellung Handy und Desktop | Design unverändert | *offen* |

**Guards (Claude):**
- IT-Security: keine neuen Abhängigkeiten, keine Secrets ergänzt ✔.
  **Befund (bestand schon vorher, nicht Teil von C01):** In `src/lib/siteGate.ts` steht das Seitenpasswort im
  Klartext in einem Kommentar. → als Korrektur außerhalb von C01 vormerken.
- Recht/Datenschutz: keine neuen Daten erhoben, Speicherung weiterhin nur lokal ✔.
- Technik-Hinweis: `package-lock.json` passt nicht zu `package.json` (`npm ci` schlägt fehl). → vormerken.

### Rückmeldung Entwickler:in (03.11.2026, wörtlich)
> okay bitte probiere es erneut dieses mal ist der Code nicht funktional. Sobald ich die Sportart in den
> Sportarten wechsle ist dies ein neuer Bereich in dem nur die Pläne und Übungen sein sollen die ich auch in
> dieser Sportart erstellt habe. Mache es also nochmal und erkläre auch hier erneut

### Analyse Claude (03.11.2026)
- Erneuter Test des Branches `ifcm/fs-001-c01-sportart-trennung` in Handy-Ansicht: Plan unter Tischtennis
  anlegen → Wechsel zu Beach Volleyball: leer → dort eigenen Plan anlegen → zurück zu Tischtennis: nur der
  TT-Plan. Das gewünschte Verhalten liegt im Branch vor.
  Nachweis: [assets/fs001-nachweis.png](../assets/fs001-nachweis.png)
- Wahrscheinliche Ursache: Getestet wurde eine Version **ohne** die Änderung. Die Live-Seite (Netlify) baut den
  Hauptbranch `claude/trainerpro-web-app-3ox2ys`; C01 liegt bis zur Freigabe nur im Arbeitsbranch.
- Zweite mögliche Ursache: Daten, die **vor** C01 unter Beach Volleyball angelegt wurden, haben keine
  Sportart gespeichert und werden deshalb Tischtennis zugeordnet (siehe Migration).
- Entscheidung Claude: Code nicht blind neu schreiben, sondern Testumgebung klären (Rückfrage gestellt).

**Bewertung:** *offen – Klärung der Testumgebung*

## 5. Alpha-Reflexion – *offen*

## 6. Abschluss – *offen* (nach bestandenem Alpha-Test: Merge in den Hauptstand nach Freigabe)
