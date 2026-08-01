# TrainerPro

TrainerPro ist eine Web-App für Trainer:innen im Vereins- und Freizeitsport, um Trainingspläne
und Übungen zu verwalten – von der Übungsdatenbank über die Planzusammenstellung bis zur
Trainingsdurchführung mit Timer.

## Bereiche

- **Trainingspläne** – Pläne als Kacheln, Suche, überfällige Pläne werden rot markiert, Anlegen/Bearbeiten
  mit Übungsauswahl aus dem Pool inkl. Reihenfolge per ↑/↓, Detailansicht mit Start-Timer pro Übung.
- **Übungen** – eigene Übungsdatenbank (Name, Beschreibung, Ziel, Dauer, Schwierigkeitsgrad),
  automatisch mit der aktuellen Sportart verknüpft.
- **Einstellungen** – Auswahl der Sportart aus 24 Optionen, wirkt sich app-weit aus.
- **Statistiken** – Kennzahlen, Schwierigkeitsgrad-Verteilung, Donut-Chart der meistgenutzten Übungen.

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
