# TrainerPro

TrainerPro ist eine Web-App für Trainer:innen **aller Sportarten** im Vereins- und Freizeitsport, um
Trainingspläne und Übungen zu verwalten – von der Übungsdatenbank über die Planzusammenstellung
bis zur Trainingsdurchführung mit Timer. Die Weiterentwicklung folgt dem IFCM (siehe [`docs/ifcm/`](docs/ifcm/README.md)).

## Bereiche

- **Einführung** – 5 Schritte mit Sportart-Auswahl und allen neuen Funktionen; erscheint beim ersten Start und
  einmalig nach dem Update, jederzeit erneut über die Einstellungen (IFCM C10).
- **Heute** – oben in der Planübersicht: alle heute anstehenden Pläne (auch Wiederholungen) mit ihren Übungen in
  Reihenfolge und ihren Notizen (lange Notizen ausklappbar, IFCM C08a); steht heute nichts an, wird der nächste
  Termin genannt (IFCM C06b).
- **Ziele (freiwillig)** – in den Einstellungen bzw. in der Einführung ein-/ausschaltbar (IFCM C15); bis zu 3 Kernziele je Sportart nach der SMART-Methode (SMART-Check beim Formulieren, Restzeit,
  Fortschritt, Abhaken mit Erfolgsmeldung), sichtbar in der Planübersicht und in den Einstellungen; Reihenfolge der
  Sportarten frei sortierbar (IFCM C09). In den Einstellungen sind „Deine Ziele“ und „Sportart“ aufklappbare Bereiche
  (IFCM C09a).
- **Trainingspläne** – Pläne als Kacheln, Suche, überfällige Pläne werden rot markiert, Anlegen/Bearbeiten
  mit Übungsauswahl aus dem Pool inkl. Reihenfolge per ↑/↓, Detailansicht mit Start-Timer pro Übung.
- **Krafttraining (Gym)** – Übungen als Sätze × Wiederholungen mit Gewicht und Satzpause, Gewicht per +/− auf der
  Karte und im Timer anpassbar, Satz- und Pausen-Timer, Ordnung nach Muskelgruppen (IFCM C11).
- **Stoppuhr** – hochzählend mit Runden (Zehntelsekunden, genau auch bei gesperrtem Bildschirm), als eigener
  Menüpunkt für alle Sportarten (Name und Beschriftungen je Sportart, z. B. „Zeitmessung“ mit „Bahn“ beim Schwimmen;
  neue eigene Sportarten mit Voreinstellung „Stoppuhr“/„Runde“) und als Übungsart „Zeit messen“ mit Bestzeit/letzter
  Zeit (IFCM C13, C13a). Gestoppte Zeiten lassen sich benennen und speichern – bis zu 10 je Sportart, direkt unter der
  Stoppuhr, mit Zwischenzeiten, umbenennbar und löschbar (IFCM C13b).
- **Übungen** – eigene Übungsdatenbank (Name, Beschreibung, Ziel, Dauer in Minuten und Sekunden – IFCM C07,
  Schwierigkeitsgrad); bei Tischtennis
  zusätzlich der Reiter **Aufschlagtraining** (IFCM C04).
- **Notizzettel** – im Timer öffnet ein Stift-Icon eine Notiz zur Übung; sie erscheint beim nächsten Start, auf der
  Übungskarte und in der Planansicht wieder (IFCM C08).
- **Kalender** – Monatsansicht aller Trainingspläne mit Datum, Tagesliste und „Plan für diesen Tag“ (IFCM C05).
- **Wiederkehrende Pläne** – Pläne wiederholen sich wöchentlich, alle 2 Wochen oder monatlich (optional mit
  Enddatum) und erscheinen an jedem Termin im Kalender; sie zeigen ihren nächsten Termin und gelten nie als
  „überfällig“ (IFCM C06).
- **Statistiken** – Kennzahlen, Schwierigkeitsgrad-Verteilung, Donut-Chart der meistgenutzten Übungen.
- **Sportartgerechte Vorschläge** – Beispieltexte in Formularen (Übung, Plan, Notiz, Ziele) passen zur gewählten
  Sportart; eigene Sportarten erhalten neutrale Vorschläge (IFCM C16).
- **Sportarten** – 12 vordefinierte und eigene Sportarten; jede Sportart ist ein eigener Bereich mit eigenen
  Plänen und Übungen (IFCM C01, C02) und hat ein eigenes Symbol und eine Akzentfarbe; eigene Sportarten
  bekommen ein wählbares Symbol (IFCM C03).

Die Daten werden lokal im Browser (`localStorage`) gespeichert.

## Entwicklung

```bash
npm install
npm run dev      # Dev-Server
npm run build    # Typecheck + Produktionsbuild
npm run lint     # oxlint
```

## Stack

React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router v7, Icons von `lucide-react`.
