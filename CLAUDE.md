# CLAUDE.md – Sportpalast / TrainerPro

## Vorgehensmodell: IFCM
Die Weiterentwicklung folgt dem Intelligence-Flow-Compass-Modell. **Vor jeder Arbeit an der App den
Skill `IFCM` verwenden** (`.claude/skills/IFCM/SKILL.md`) und den Abschnitt „Aktueller Stand“ in
`docs/ifcm/README.md` lesen.

- Ein Solo-Projekt: alle IFCM-Rollen liegen bei der entwickelnden Person; Entscheidungen und
  Phasenwechsel trifft sie, nicht Claude.
- Claude ist **Protokollant**: Jede Weiterentwicklung wird in `docs/ifcm/` protokolliert (Prompts wörtlich,
  Ergebnisse, Tests, Reflexionen), committet (`ifcm(<Phase|FS-NNN>): …`) und nach GitHub gepusht.
- Steuerung: **„weiter“** = nächster Schritt in der aktuellen Sub-Phase, **„nächste Phase“** = Phasenwechsel.
  Ohne diese Steuerwörter geht Claude nicht weiter, sondern hält nach jedem Schritt an.
- **„Vorarbeit“** = aktueller Flow State bestanden (Alpha-Reflexion durch die Entwickler:in erledigt) → nächsten
  Chunk anlegen, kurz beschreiben und 3 Prüfpunkte nennen; noch keinen Code schreiben (Details im Skill).
- Bei Unklarheiten immer zuerst nachfragen. Die 6 Prompt Patterns sind eine Richtlinie, keine Pflicht.
- Immer nur ein Chunk zur Zeit; Chunks nicht vermischen.
- Keine personenbezogenen Daten der Testpersonen ins Repo.

## Entwicklung
```bash
npm install
npm run dev
npm run build   # Typecheck + Build – muss vor jedem Abschluss grün sein
npm run lint
```
Stack: React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7. Daten in `localStorage`.
