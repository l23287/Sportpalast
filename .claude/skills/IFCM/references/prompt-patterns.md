# Die sechs Prompt Patterns (Wert „Präzision“)

Nach Kap. 4.2 der Arbeit (White et al. 2023). Die Patterns sind eine **Richtlinie, keine Pflicht**:
Ein Prompt muss nicht alle Elemente enthalten. Claude gibt höchstens kurze Hinweise, wenn ein Pattern
offensichtlich helfen würde – und blockiert keinen Prompt deswegen.

**Verbindlich ist nur eines:** Ist etwas unklar, fragt Claude nach, bevor es umsetzt (Flipped Interaction
gilt also immer – auch wenn der Prompt sie nicht ausdrücklich verlangt).

| # | Pattern (White et al. 2023) | Frage beim Prüfen | Beispiel-Baustein |
|---|---|---|---|
| 1 | **Input/Output-Steuerung – Format Changer** (III-J) | Ist das erwartete Ausgabeformat genannt? | „Liefere eine React-Komponente in TypeScript mit Tailwind-Klassen, keine neue Abhängigkeit.“ |
| 2 | **Fact Check List – Error Reduction** (III-I) | Soll die KI vorab die relevanten Fakten/Standards nennen? | „Nenne zuerst die 3 wichtigsten Anforderungen an sicheres Passwort-Hashing im Browser, dann implementiere.“ |
| 3 | **Persona – Rolle und Verhalten** (III-E) | Ist eine Rolle für die KI gesetzt? | „Du bist erfahrene:r Frontend-Entwickler:in mit Fokus auf Barrierefreiheit.“ |
| 4 | **Flipped Interaction – Rückfragen** (III-D) | Darf/soll die KI erst nachfragen? | „Stelle mir zuerst alle Rückfragen, die du brauchst, bevor du Code schreibst.“ |
| 5 | **Infinite Generation – Abschnitte** (III-K) | Ist der Auftrag in vollständig abzuarbeitende Abschnitte geteilt? | „Abschnitt 1: Datenmodell. Abschnitt 2: Formular. Abschnitt 3: Liste. Schließe jeden vollständig ab.“ |
| 6 | **Cognitive Enhancement – Abkürzungen/Skills** (III-B) | Gibt es wiederkehrende Aufgaben, die als Abkürzung/Skill hinterlegt sind? | „/IFCM test“ für die Testcheckliste; dieser Skill selbst ist ein Beispiel. |

## Vorlage für einen vollständigen Arbeitsprompt

```
Rolle: Du bist <Rolle>.                                         (Pattern 3)
Kontext: Chunk <Cxx – Titel>. Ziel laut 02-planning.md: <Kurzfassung>.
Auftrag: <Was genau soll entstehen>.
Vorab: Nenne die <n> wichtigsten <Standards/Risiken>, bevor du umsetzt.   (Pattern 2)
Rückfragen: Stelle zuerst alle offenen Fragen.                   (Pattern 4)
Abschnitte: 1) … 2) … 3) … – jeden vollständig abschließen.      (Pattern 5)
Ausgabe: <Format, Dateien, Grenzen – z. B. keine neuen Abhängigkeiten>. (Pattern 1)
Abkürzungen: <ggf. Skill/Kurzbefehl>.                            (Pattern 6)
```

## Prompt-Prüfung im Protokoll

Im Flow-State-Protokoll pro Prompt optional eine Zeile: `Patterns: 1 ✔ 2 – 3 ✔ 4 ✔ 5 ✔ 6 –` und in der
Alpha-Reflexion festhalten, welches Pattern gefehlt hat, falls das Ergebnis ungenau war.
