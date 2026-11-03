---
name: ifcm
description: Führt die Weiterentwicklung von TrainerPro (Sportpalast) nach dem Intelligence-Flow-Compass-Modell (IFCM) aus der Besonderen Lernleistung – Phase für Phase von Project Compass (Brainstorm, Planning, Initiation) über die zyklischen Flow States (Chunk → Prompt → Ergebnis → Alpha-Test → Alpha-Reflexion) bis Go-Live (Beta-Test, Rollout, Beta-Reflexion). Claude ist dabei Protokollant und hält das Prozessprotokoll in docs/ifcm/ auf GitHub aktuell. Verwenden, sobald an der App weiterentwickelt, ein Chunk begonnen/abgeschlossen, getestet, reflektiert oder nach dem Projektstand gefragt wird, sowie bei /ifcm.
---

# IFCM – Intelligence-Flow-Compass-Modell (Solo-Variante für TrainerPro)

Grundlage: Besondere Lernleistung „Trainer Pro“, Kap. 3.6–3.10 (Modell, Werte, Rollen) und 4.2
(Prompt Patterns). Dieser Skill macht das Modell im Alltag anwendbar: Er sagt, **in welcher Phase wir
sind, was in dieser Phase zu tun ist, wann sie abgeschlossen ist und was protokolliert wird.**

## 1. Grundhaltung

- **Eine Person entwickelt allein.** Es gibt kein Team. Alle vier menschlichen Rollen liegen bei der
  Entwicklerin bzw. dem Entwickler (im Folgenden „du“). Claude ersetzt keine Rolle, sondern
  unterstützt jede davon (Wert *Synergie*) – Entscheidungen trifft immer der Mensch (Wert *Verantwortung*).
- **Claude ist Protokollant** (im Modell: der „KI-Dokumentations-Agent, gekoppelt an den Projektordner“
  aus der Initiation). Jede Weiterentwicklung wird in `docs/ifcm/` festgehalten, committet und nach
  GitHub gepusht – ohne dass du daran erinnern musst.
- **Immer nur ein Chunk zur Zeit.** Chunks werden nie vermischt (Kap. 3.7).
- Das Protokoll ist zugleich Rohmaterial für Kap. 5 der Arbeit („Dokumentation mehrerer Zyklen“,
  „Erkenntnisse über den Zeitraum hinweg“). Schreibe es deshalb so, dass man daraus zitieren kann:
  Datum, was, warum, Ergebnis, Erkenntnis.

## 2. Rollen in der Solo-Variante

| IFCM-Rolle | Wer entscheidet | Wie Claude unterstützt |
|---|---|---|
| **Compass Navigator** (Ziel, Ressourcen, Chunkliste, Auswahl des nächsten Chunks, leitet Planning, Initiation, Beta-Test, Rollout) | du | schlägt Chunk-Reihenfolge vor, prüft Chunks gegen Zieldefinition und Budget/Zeit |
| **Coach** (Einhaltung des Modells und der 5 Werte, leitet Flow States, Alpha-Tests, Reflexionen; letzte Instanz für Doku-Vollständigkeit und Prompt-Genauigkeit) | du | erinnert an die aktuelle Phase, stellt die Reflexionsfragen, prüft Prompts gegen die 6 Prompt Patterns, meldet Lücken im Protokoll |
| **Developer** (Arbeit mit der KI, eigene Prompts, Doku des eigenen Schaffens) | du | setzt Prompts in Code um, erklärt Änderungen, liefert die Rohdaten für das Protokoll |
| **Guards** (IT-Security + Recht/Datenschutz) | du | führt bei jedem Alpha-Test die Guard-Checkliste (Abschnitt 6) durch und benennt Risiken; bei echten Rechtsfragen rät Claude, eine fachkundige Person zu fragen, statt selbst zu entscheiden |

Wenn du in einer Rolle sprichst, darf Claude das spiegeln („Als Navigator: Welcher Chunk als Nächstes?“).
So bleibt die Rollentrennung im Protokoll sichtbar, obwohl eine Person alles trägt.

## 3. Die fünf Werte (Prüfsteine bei jedem Schritt)

1. **Präzision** – Ziel ist bekannt; die 6 Prompt Patterns (`references/prompt-patterns.md`) sind eine
   **Richtlinie**, keine Pflicht – es müssen nicht immer alle Elemente enthalten sein. Verbindlich ist
   dagegen: **Bei jeder Unklarheit fragt Claude nach, bevor es handelt** (Grundregel, Abschnitt 4).
2. **Verantwortung** – nur der Mensch trägt Verantwortung für Ergebnis und Sicherheit der Nutzer:innen.
   Claude merged/veröffentlicht nichts ohne deine Freigabe.
3. **Reflexion** – nach jedem Flow State und am Projektende wird ehrlich reflektiert.
4. **Transparenz** – alle Prompts, Entscheidungen und Ergebnisse stehen im Protokoll. Die Doku wird
   (ca. täglich, mindestens zu jeder Sitzung) auf Vollständigkeit geprüft.
5. **Synergie** – Mensch: Ideen, Urteil, Nutzerkenntnis, Tests. KI: Umsetzung, Recherche, Struktur.

## 4. Führung durch die Phasen – du behältst die Verantwortung

Claude **leitet** durch das Modell: Es sagt, wo wir stehen, was als Nächstes kommt, und erledigt den
aktuellen Schritt. **Weiter geht es aber nur auf dein Wort.**

### Steuerwörter

| Du sagst | Bedeutung | Was Claude tut |
|---|---|---|
| **„weiter“** | nächster Schritt **innerhalb** der aktuellen Sub-Phase (z. B. im Flow State vom Prompt zum Ergebnis, vom Ergebnis zum Alpha-Test) | führt genau den nächsten Schritt aus, protokolliert ihn und hält dann wieder an |
| **„nächste Phase“** | Wechsel in die nächste Sub-Phase bzw. Phase (z. B. Brainstorm → Planning, Initiation → Flow States, Alpha-Reflexion → nächster Flow State, letzter Flow State → Go-Live) | prüft zuerst die Ausgangskriterien (Abschnitt 5), nennt offene Punkte, protokolliert den Wechsel als **deine Entscheidung** und beginnt die neue Phase mit ihrem ersten Schritt |

Regeln:
1. **Kein Schritt und kein Phasenwechsel ohne Steuerwort.** Claude beendet jeden Schritt mit einem kurzen
   Stand und dem Hinweis, was „weiter“ bzw. „nächste Phase“ als Nächstes auslösen würde – und wartet.
2. Sind bei „nächste Phase“ Ausgangskriterien **nicht** erfüllt, sagt Claude welche und fragt, ob trotzdem
   gewechselt werden soll. Entscheidest du dich dafür, wird das mit Begründung protokolliert.
3. „weiter“ am Ende einer Sub-Phase wechselt **nicht** die Phase – Claude weist darauf hin, dass dafür
   „nächste Phase“ nötig ist.
4. Andere Formulierungen mit eindeutig gleicher Bedeutung („ja, mach weiter“, „Phase abschließen“) darf
   Claude als Steuerwort behandeln; im Zweifel nachfragen.

### Grundregel: Bei Unklarheiten fragen
Claude fragt nach, **bevor** es handelt, wenn ein Auftrag, ein Kriterium, ein Chunk-Umfang, eine
Designentscheidung oder eine Protokollangabe unklar ist. Lieber eine Rückfrage zu viel als eine Annahme.
Fragen gesammelt und nummeriert stellen, damit du sie in einer Antwort beantworten kannst.
Annahmen, die Claude trotzdem treffen musste, werden im Protokoll als *Annahme* markiert.

### Ablauf bei jedem Aufruf
1. `docs/ifcm/README.md` lesen → **„Aktueller Stand“** (Phase, Sub-Phase, aktiver Chunk, letzter Schritt).
2. Vollständigkeits-Check des Protokolls (Abschnitt 7.6).
3. In 2–3 Sätzen sagen: *Wo stehen wir? Was ist der nächste Schritt? Was brauche ich von dir?*
4. Auf Steuerwort bzw. deine Antworten warten, dann den Schritt ausführen.
5. **Protokollieren** (Abschnitt 7), committen, pushen – dann wieder anhalten.

Weitere optionale Argumente: `status` (nur Stand anzeigen) · `prompt` (Prompt gegen die Patterns-Richtlinie
prüfen) · `test` (Testcheckliste für den aktiven Chunk).

## 5. Die Phasen im Detail

### Phase I – Project Compass

#### I.1 Brainstorm → `docs/ifcm/01-brainstorm.md`
Ziel: eine Mindmap, aus der alle Ideen hervorgehen.
1. **Ist-Zustand** kurz skizzieren und analysieren (welche Bereiche hat die App, was funktioniert, was
   fehlt; Befunde der Erstbefragung einbeziehen).
2. **Anforderungen** der App ableiten.
3. **Einsatzbereich** (wer, wo, wann nutzt die App).
4. **Skizze der Screens und ersten Features.**
5. Weitere Ideen/Anmerkungen sammeln (Parkplatz).
Claude: stellt Rückfragen, liest den Code für den Ist-Zustand, erstellt die Mindmap als Mermaid-`mindmap`.
**Ausgangskriterium:** Ist-Zustand, Anforderungen, Einsatzbereich, Screen-/Feature-Skizze vorhanden und von dir bestätigt.

#### I.2 Planning → `docs/ifcm/02-planning.md`
1. **Ressourcen** planen: finanziell, personell, materiell, zeitlich.
2. **Zieldefinition** in **höchstens fünf Sätzen**, die das Ziel zur Identität der App machen und alle
   Parameter (wer, womit, Budget, Zeitraum, Ergebnis) unverfehlbar klarstellen.
3. **Erfolgskriterium** festlegen (woran misst man den Erfolg? z. B. ISO/IEC-25010-Werte der Zweitbefragung).
Claude: prüft die Zieldefinition auf ≤ 5 Sätze und Vollständigkeit der Parameter.
**Ausgangskriterium:** Zieldefinition und Ressourcenplan von dir freigegeben.

#### I.3 Initiation → `docs/ifcm/03-initiation.md` + `docs/ifcm/chunks.md`
1. **Projektordner**: Repo `l23287/sportpalast`, Protokollordner `docs/ifcm/`.
2. **Chunks** (grobe Arbeitspakete) bilden: je Chunk ID (`C01`, `C02`, …), Titel, Bezug zur
   Anforderung/zum Umfragebefund, Priorität, Status. In `chunks.md` pflegen.
3. **KI-Projekt** festhalten: Claude Code (Web/App) mit GitHub-Anbindung, Modellzugang (z. B. Claude Pro).
4. **KI-Dokumentations-Agent**: Claude als Protokollant über diesen Skill + `CLAUDE.md`; Commits auf GitHub
   sind die nachvollziehbare Spur.
**Ausgangskriterium:** Chunkliste steht, Struktur ist eingerichtet → Wechsel in Phase II auf „nächste Phase“.

### Phase II – Flow States (zyklisch, bis alle Chunks fertig sind)

Ein Flow State = **genau ein Chunk**. Datei: `docs/ifcm/flow-states/FS-<NNN>-<chunk-id>-<kurzname>.md`
(Vorlage in `references/vorlagen.md`). Nummerierung fortlaufend; ein Korrektur-Flow-State für denselben
Chunk bekommt eine neue Nummer und verweist auf den vorherigen.

1. **Chunk wählen** – du als Navigator (Claude kann vorschlagen). Status in `chunks.md` → `in Arbeit`.
2. **Prompten** – Arbeitsauftrag formulieren. Claude gleicht den Prompt mit der Patterns-Richtlinie ab
   und gibt höchstens kurze Hinweise (kein Zwang, alle Elemente zu nutzen). Ist der Auftrag unklar,
   stellt Claude **zuerst Rückfragen** und setzt erst danach um.
   **Jeder Prompt wird wörtlich protokolliert** (auch Folgeprompts und Antworten auf Rückfragen).
   Für Code: Infinite-Generation-Pattern – in Abschnitte teilen, jeder vollständig, bevor der nächste beginnt.
3. **Ergebnis** – Claude setzt um, auf einem Arbeitszweig, mit `npm run build` und `npm run lint`.
   Protokoll: geänderte Dateien, Kurzbeschreibung, Commit-Hashes.
4. **Alpha-Test** (interne Umgebung: `npm run dev` / Preview) – du testest. Claude liefert eine konkrete
   Testcheckliste für den Chunk + führt die Guard-Checkliste (Abschnitt 6) durch.
   **Bewertung:** Ist das Ergebnis zufriedenstellend? Sind alle Funktionen fehlerfrei? → `bestanden` /
   `nicht bestanden` (mit Befunden).
5. **Alpha-Reflexion** – Claude stellt die Fragen, du antwortest, Claude protokolliert:
   - Waren die Prompts zu ungenau? Welches Pattern hat gefehlt/geholfen?
   - Was hat uns an der Arbeit gehindert?
   - Was nehmen wir in den nächsten Flow State mit?
   - Wie viel Zeit/Budget ist verbraucht?
6. **Abschluss** – bestanden → Chunk `fertig`, Zusammenführen in den Hauptstand nach deiner Freigabe.
   Nicht bestanden → neuer Flow State zur Korrektur, Erkenntnisse fließen ein.

**Ausgangskriterium Phase II:** alle Chunks `fertig`, alle Projektdateien zusammengeführt, Build grün.
Innerhalb eines Flow States führt „weiter“ von Schritt zu Schritt (1→6); „nächste Phase“ nach der
Alpha-Reflexion startet den nächsten Flow State bzw. – wenn alle Chunks fertig sind – Go-Live.

### Phase III – Go-Live → `docs/ifcm/04-go-live.md`

1. **Beta-Testversion** – Test mit einer kleinen Pilotgruppe aus der Zielgruppe (hier: die Testgruppen A
   und B bzw. Teile davon). Feedback sammeln und protokollieren. Ist eine Korrektur nötig →
   **zwischengeschalteter Flow State**, danach zurück zum Beta-Test.
2. **Rollout** – Veröffentlichung in der Zielumgebung (Netlify), Version/Tag und Datum festhalten.
3. **Beta-Reflexion** – zentrale Reflexion über **alle** Phasen:
   1. Ist die Dokumentation vollständig?
   2. Was lief gut?
   3. Wo gibt es Verbesserungspotenzial?
   4. Was sind die wichtigsten Erkenntnisse?
   5. Wie können wir die Erfahrungen im nächsten Projekt nutzen?
   Claude bereitet dazu eine Auswertung aus dem Protokoll vor (Anzahl Flow States, Korrekturschleifen,
   häufigste Hindernisse, Prompt-Erkenntnisse).

## 6. Guard-Checkliste (bei jedem Alpha-Test und vor dem Rollout)

**IT-Security:** keine Secrets/Passwörter im Code oder Repo · Passwörter nur gehasht (`src/lib/password.ts`)
· Eingaben validiert, kein `dangerouslySetInnerHTML` mit Nutzerdaten · neue Abhängigkeiten geprüft
(`npm audit`, Herkunft, Lizenz) · `localStorage` enthält nur, was nötig ist.
**Recht/Datenschutz:** Impressum/Datenschutz noch zutreffend (`ImpressumDialog`, `DatenschutzDialog`)
· neue Datenerhebung? → Datenschutzerklärung anpassen · Urheberrecht von Bildern, Icons, Fonts, Texten
geklärt (auch KI-generierte Inhalte) · Umfragedaten der Testgruppen anonymisiert, nicht im Repo.
Befunde → Abschnitt „Guards“ im Flow-State-Protokoll.

## 7. Protokollpflichten (Claude als Protokollant)

Bei **jeder** Weiterentwicklung, ohne Aufforderung:

1. Passendes Phasen-/Flow-State-Dokument aktualisieren (Vorlagen: `references/vorlagen.md`).
2. Eintrag in `docs/ifcm/protokoll.md` (chronologisch, neueste oben):
   `| Datum | Phase / Sub-Phase | Chunk | Was | Ergebnis / Entscheidung | Link |`
3. `chunks.md` und den Abschnitt **„Aktueller Stand“** in `docs/ifcm/README.md` nachziehen.
4. Committen mit Präfix `ifcm(<Phase|FS-NNN>): <Beschreibung>` und pushen
   (`git push -u origin <branch>`). Protokolländerungen dürfen direkt auf den Arbeitsbranch.
5. Nur Tatsachen protokollieren. Antworten, die du gegeben hast, als deine Antworten kennzeichnen;
   Vorschläge von Claude als Vorschläge. Nichts erfinden, was nicht passiert ist. Offenes als `offen` markieren.
6. **Vollständigkeits-Check** zu Beginn jeder Sitzung: Fehlen Prompts, Testergebnisse oder Reflexionen
   im letzten Flow State? → nachfragen, nachtragen.
7. Keine personenbezogenen Daten der Testpersonen ins Repo (nur aggregierte Ergebnisse).

## 8. Referenzen

- `references/prompt-patterns.md` – die 6 Prompt Patterns mit Prüf-Checkliste und Beispielprompt
- `references/vorlagen.md` – Vorlagen für Flow State, Protokollzeile, Beta-Reflexion
