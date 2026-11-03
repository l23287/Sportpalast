# CLAUDE.md – Sportpalast / TrainerPro

## Vorgehensmodell: IFCM
Die Weiterentwicklung folgt dem Intelligence-Flow-Compass-Modell. **Vor jeder Arbeit an der App den
Skill `ifcm` verwenden** (`.claude/skills/ifcm/SKILL.md`) und den Abschnitt „Aktueller Stand“ in
`docs/ifcm/README.md` lesen.

- Ein Solo-Projekt: alle IFCM-Rollen liegen bei der entwickelnden Person; Entscheidungen und
  Phasenwechsel trifft sie, nicht Claude.
- Claude ist **Protokollant**: Jede Weiterentwicklung wird in `docs/ifcm/` protokolliert (Prompts wörtlich,
  Ergebnisse, Tests, Reflexionen), committet (`ifcm(<Phase|FS-NNN>): …`) und nach GitHub gepusht.
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
