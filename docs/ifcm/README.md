# IFCM-Prozessprotokoll – TrainerPro

Die Weiterentwicklung von TrainerPro folgt dem **Intelligence-Flow-Compass-Modell (IFCM)** aus der
Besonderen Lernleistung (Kap. 3.6–3.10). Dieser Ordner ist das vollständige, nachvollziehbare Protokoll
des Prozesses (Wert *Transparenz*). Geführt wird es von Claude als Protokollant über den Skill
[`.claude/skills/IFCM`](../../.claude/skills/IFCM/SKILL.md).

## Aktueller Stand

| | |
|---|---|
| **Phase** | I – Project Compass |
| **Sub-Phase** | I.1 Brainstorm – gestartet 03.11.2026, Rückfragen zum Entwurf offen |
| **Aktiver Chunk** | – |
| **Nächster Schritt** | Brainstorm-Entwurf prüfen und ergänzen; danach „nächste Phase“ → Planning |
| **Zuletzt aktualisiert** | 03.11.2026 |

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
| I Project Compass | Brainstorm | [01-brainstorm.md](01-brainstorm.md) | Entwurf |
| | Planning | [02-planning.md](02-planning.md) | Entwurf |
| | Initiation | [03-initiation.md](03-initiation.md), [chunks.md](chunks.md) | teilweise |
| II Flow States | je Chunk | [flow-states/](flow-states/) | offen |
| III Go-Live | Beta-Test, Rollout, Beta-Reflexion | 04-go-live.md (wird angelegt) | offen |

Chronologie aller Schritte: [protokoll.md](protokoll.md)

## Steuerung

- **„weiter“** – nächster Schritt in der aktuellen Sub-Phase
- **„nächste Phase“** – Wechsel in die nächste (Sub-)Phase, nach Prüfung der Ausgangskriterien

Ohne Steuerwort geht Claude nicht weiter. Bei Unklarheiten fragt Claude nach.

## Rollen (Solo-Projekt)

Alle vier Rollen – Compass Navigator, Coach, Developer, Guards – liegen bei einer Person.
Claude unterstützt jede Rolle und ist KI-Dokumentations-Agent/Protokollant; Entscheidungen trifft der Mensch.
