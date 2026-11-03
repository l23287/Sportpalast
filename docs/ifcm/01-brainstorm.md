# I.1 Brainstorm

> **Status: Entwurf** – übernommen aus der BLL (Kap. 2.1, 2.4) und dem Code-Stand (Commit `f3314ea`,
> 12.08.2026). Bitte prüfen, korrigieren, ergänzen. Erst nach Bestätigung gilt die Sub-Phase als abgeschlossen.

## Mindmap (Entwurf, Stand 03.11.2026 – Vorschlag Claude, Bestätigung offen)

```mermaid
mindmap
  root((TrainerPro – Entlastung für Trainer:innen aller Sportarten))
    Sportarten-Fundament
      Mehr Sportarten, z. B. Gym, Fußball
      Eigene Sportart anlegen
      Übungen und Pläne je Sportart getrennt
      Sportartspezifisches Spezialtraining statt fixem Aufschlagtraining
      Symbole und Farben je Sportart
    Planung
      Vorgefertigter Übungspool je Sportart
      Fotos und Videos zu Übungen
      Dauer auch in Sekunden
      Wiederkehrende Trainings
      Notizen und Reflexion zum Plan
    Organisation
      Erinnerungen und Benachrichtigungen
      Anwesenheitsliste
      Kader mit individuellen Statistiken
    Durchführung
      Timer vorhanden
      Digitale Zähltafel
    Einstieg und Bedienung
      Einführung in die Funktionen
      Gelobtes Design beibehalten
    Profil und USP
      Alles für die Trainingsorganisation in einer App
      Für jede Sportart
    Guards
      Daten Minderjähriger schützen
      Bildrechte bei Fotos und Videos
      Speichergrenze im Browser
      Backend kostet Budget
    Parkplatz
      Gemeinsame Pläne mit mehreren Accounts
      Übungen anderer Nutzer teilen
      Turnierfunktion
```

## 1. Ist-Zustand (Version vom 27.08.2026)
- **Übungen:** Erstellen von Einzelübungen (Name, Beschreibung, Ziel, Dauer, Schwierigkeitsgrad).
- **Trainingspläne:** Übungen zu einem Plan zusammenfügen und sortieren; Detailansicht mit Timer; Eintrag in einen Terminkalender.
- **Sportart:** in den Einstellungen wählbar (im Code: `Tischtennis`, `Beach Volleyball`), wirkt sich auf die Icons aus.
- **Aufschlagtraining:** fest auf Tischtennis ausgerichtet, passt sich nicht an die Sportart an.
- **Statistiken**, Onboarding, lokales Konto; Daten in `localStorage`.

## 2. Befunde der Erstbefragung (12.10.2026, ISO/IEC 25010, Gruppen A n=15 und B n=5)
- Technische Qualität (Leistungseffizienz, Zuverlässigkeit): sehr gut (Gruppe B: Median 5, SD 0).
- Benutzbarkeit: hoch, aber mit Streuung → Verbesserungspotenzial.
- Funktionale Eignung: schwächster Bereich (Gruppe B: Mittelwert 3,60; teils Median < 4).
- Design: stark streuende Bewertung, offene Rückmeldungen beachten.

## 2a. Offenes Feedback der Erstbefragung („Sonstiges: Gibt es etwas, das du an der App verbessern würdest?“)

Wörtlich sinngemäß zusammengefasst, ohne Personenbezug. Gruppe A: 11 Antworten (8 auf dem Screenshot sichtbar),
Gruppe B: 5 Antworten. Kürzel für Verweise: A1–A8, B1–B5.

| # | Gruppe | Rückmeldung | Code-Befund |
|---|---|---|---|
| A1 | A | Individuelles Design (Symbole etc.); Trainingspläne und Übungen sollen sich beim Wechsel der Sportart zurücksetzen | Übungen/Pläne haben kein Sportart-Feld (`src/types.ts`) |
| A2 | A | „Gym“ als Sportart fehlt, sonst kein Trainingsplan möglich | nur Tischtennis, Beach Volleyball |
| A3 | A | Anordnung und Design gut gelungen | – |
| A4 | A | keine Verbesserung („nö“) | – |
| A5 | A | Was macht die App besser als andere? Es fehlt ein USP für den offenen Markt | – |
| A6 | A | Mitteilungen, mehr Sportarten | – |
| A7 | A | Erinnerungen, Benachrichtigungen, mehr Sportarten, automatische Wiederkehr | Plan hat nur ein einzelnes Datum |
| A8 | A | Gemeinsamer Trainingsplan mit mehreren Accounts | nur lokales Konto, kein Backend |
| B1 | B | Anwesenheitslisten (wer fehlt zu oft) | – |
| B2 | B | Einleitung in die Funktionen der App | Onboarding mit 3 Seiten vorhanden |
| B3 | B | Übungen auch nur wenige Sekunden lang; Fotos als Beschreibung | Dauer nur in Minuten (`durationMinutes`) |
| B4 | B | Pool vorgefertigter Übungen; Liste der Trainierenden mit individuellen Statistiken (z. B. Aufschläge); digitale Zähltafel; Notizen zu Trainingsplänen; Turnierfunktion | – |
| B5 | B | Eigene Fotos/Videos zu Übungen; „Workshop“, um Übungen anderer Nutzer zu nutzen; Aufschlagtraining bleibt bei Fußball sichtbar → sportartspezifisch machen (z. B. Freistoßtraining) | Aufschlagtraining fest auf Tischtennis |

**Häufigste Themen:** mehr Sportarten / sportartabhängige App (A1, A2, A6, A7, B5) · Erinnerungen und
Wiederkehr (A6, A7) · Medien zu Übungen (B3, B5) · Organisation der Trainingsgruppe (B1, B4) ·
Zusammenarbeit/Teilen (A8, B5).

## 3. Anforderungen
Vorgabe der Entwickler:in (03.11.2026): Die App wird von einer Tischtennis-App zu einer App **für alle
Sportarten** weiterentwickelt, die Trainer:innen besonders bei **Planung und Organisation** entlastet.
Das **Feedback der Testgruppen hat die höchste Priorität**.

- App für alle Sportarten; alle Bereiche (inkl. Spezialtraining) sportartabhängig (A1, A2, A6, A7, B5).
- Funktionale Eignung verbessern, abgeleitet aus Abschnitt 2a (Planung, Organisation, Medien).
- Design beibehalten (A3), aber Symbole/Farben je Sportart (A1).

## 4. Einsatzbereich
Vereinssport; Übungsleiter:innen verschiedener Sportarten; Hauptzielgruppe 15–25 Jahre.

## 5. Skizze der Screens und ersten Features
*offen – bitte ergänzen (z. B. Foto/Scan der Skizze unter `docs/ifcm/assets/` ablegen).*

## 6. Parkplatz (weitere Ideen)
*offen*
