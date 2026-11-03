# Vorlagen für das IFCM-Protokoll

## Flow State – `docs/ifcm/flow-states/FS-<NNN>-<chunk-id>-<kurzname>.md`

```markdown
# FS-<NNN> · <Cxx> – <Chunk-Titel>

| Feld | Wert |
|---|---|
| Zeitraum | <TT.MM.JJJJ> – <TT.MM.JJJJ> |
| Chunk | <Cxx> (siehe ../chunks.md) |
| Ausgewählt von | du (Compass Navigator) – Begründung: <…> |
| Vorgänger | <FS-… bei Korrekturschleife, sonst –> |
| Branch / Commits | <branch>, <hashes> |
| Status | in Arbeit · Alpha-Test · bestanden · nicht bestanden |

## 1. Chunk & Ziel
<Was soll am Ende dieses Flow States anders sein? Bezug zur Zieldefinition / zum Umfragebefund.>

## 2. Prompts
### Prompt 1 – <TT.MM.JJJJ>
> <wörtlicher Prompt>

Patterns: 1 ? 2 ? 3 ? 4 ? 5 ? 6 ?
Antwort/Ergebnis in Kürze: <…>

## 3. Ergebnis
- Geänderte Dateien: <…>
- Beschreibung: <…>
- Build/Lint: <grün/rot>

## 4. Alpha-Test (<TT.MM.JJJJ>, interne Umgebung)
| Testfall | Erwartet | Ergebnis |
|---|---|---|
| <…> | <…> | ✔ / ✘ |

**Guards:** IT-Security <…> · Recht/Datenschutz <…>
**Bewertung:** zufriedenstellend? <ja/nein> · fehlerfrei? <ja/nein> → **<bestanden/nicht bestanden>**

## 5. Alpha-Reflexion
- Waren die Prompts zu ungenau? <…>
- Was hat uns an der Arbeit gehindert? <…>
- Was nehmen wir mit? <…>
- Aufwand (Zeit / Budget): <…>

## 6. Abschluss
<Chunk fertig / Korrektur in FS-<NNN+1>>
```

## Protokollzeile – `docs/ifcm/protokoll.md`

```markdown
| <TT.MM.JJJJ> | <Phase / Sub-Phase> | <Cxx oder –> | <was passiert ist> | <Ergebnis / Entscheidung> | [<Datei>](<pfad>) |
```

## Chunk-Zeile – `docs/ifcm/chunks.md`

```markdown
| <Cxx> | <Titel> | <Anforderung / Umfragebefund> | <hoch/mittel/niedrig> | <offen/in Arbeit/fertig> | <FS-…> |
```

## Go-Live – `docs/ifcm/04-go-live.md`

```markdown
## Beta-Test
- Zeitraum: <…> · Pilotgruppe: <Gruppe A/B, Anzahl – keine Namen>
- Version/Commit: <…>
- Feedback (aggregiert): <…>
- Korrektur nötig? <nein / ja → FS-…>

## Rollout
- Datum: <…> · Umgebung: Netlify · Version/Tag: <…>

## Beta-Reflexion
1. Ist die Dokumentation vollständig? <…>
2. Was lief gut? <…>
3. Wo gibt es Verbesserungspotenzial? <…>
4. Was sind die wichtigsten Erkenntnisse? <…>
5. Wie nutzen wir die Erfahrungen im nächsten Projekt? <…>

Kennzahlen aus dem Protokoll: Flow States gesamt <n>, Korrekturschleifen <n>, häufigste Hindernisse <…>.
```
