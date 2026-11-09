# IFCM-Prozessprotokoll – TrainerPro

Die Weiterentwicklung von TrainerPro folgt dem **Intelligence-Flow-Compass-Modell (IFCM)** aus der
Besonderen Lernleistung (Kap. 3.6–3.10). Dieser Ordner ist das vollständige, nachvollziehbare Protokoll
des Prozesses (Wert *Transparenz*). Geführt wird es von Claude als Protokollant über den Skill
[`.claude/skills/IFCM`](../../.claude/skills/IFCM/SKILL.md).

## Aktueller Stand

| | |
|---|---|
| **Phase** | II – Flow States (Projektzeitraum 01.11.2026 – 01.01.2027) |
| **Sub-Phase** | FS-022 – Chunk gewählt, Rückfragen zu C12 offen (noch kein Code) |
| **Aktiver Chunk** | C12 Streak einführen (Chunkliste 2: C15, C11, C16, C13 fertig → C12 → C14) |
| **Nächster Schritt** | Rückfragen zu C12 beantworten, dann „Programmieren“; Merge-Freigabe offen |
| **Zuletzt aktualisiert** | 09.11.2026 |

## Phasenübersicht

```mermaid
flowchart LR
  subgraph PC[I · Project Compass]
    B[Brainstorm] --> P[Planning] --> I[Initiation]
  end
  subgraph FS[II · Flow States – je ein Chunk]
    C[Chunk] --> PR[Prompt] --> E[Ergebnis] --> AT[Alpha-Test] --> AR[Alpha-Reflexion]
    AR -- nächster Chunk / Korrektur --> C
  end
  subgraph GL[III · Go-Live]
    BT[Beta-Test] --> RO[Rollout] --> BR[Beta-Reflexion]
  end
  I --> C
  AR -- alle Chunks fertig --> BT
  BT -- Korrektur nötig --> C
```

| Phase | Sub-Phase | Dokument | Status |
|---|---|---|---|
| I Project Compass | Brainstorm | [01-brainstorm.md](01-brainstorm.md) | abgeschlossen 03.11.2026 |
| | Planning | [02-planning.md](02-planning.md) | abgeschlossen 03.11.2026 |
| | Initiation | [03-initiation.md](03-initiation.md), [chunks.md](chunks.md) | abgeschlossen 03.11.2026 |
| II Flow States | je Chunk | [flow-states/](flow-states/) | läuft (Chunkliste 1 C01–C10 fertig; Chunkliste 2: C15, C11, C16, C13 fertig; FS-022 aktiv) |
| III Go-Live | Beta-Test, Rollout, Beta-Reflexion | 04-go-live.md (wird angelegt) | offen |

Chronologie aller Schritte: [protokoll.md](protokoll.md) · Recherchierte Quellen: [quellen/](quellen/)

## Steuerung

- **„weiter“** – nächster Schritt in der aktuellen Sub-Phase
- **„nächste Phase“** – Wechsel in die nächste (Sub-)Phase, nach Prüfung der Ausgangskriterien
- **„Vorarbeit“** – aktueller Flow State bestanden, Alpha-Reflexion durch die Entwickler:in erledigt → nächsten Chunk
  vorbereiten (Beschreibung + 3 Prüfpunkte), noch ohne Code
- **„Programmieren“** – vorbereiteten Chunk umsetzen (Code mit Kommentaren + Dokumentation)

Ohne Steuerwort geht Claude nicht weiter. Bei Unklarheiten fragt Claude nach.

## Rollen (Solo-Projekt)

Alle vier Rollen – Compass Navigator, Coach, Developer, Guards – liegen bei einer Person.
Claude unterstützt jede Rolle und ist KI-Dokumentations-Agent/Protokollant; Entscheidungen trifft der Mensch.
