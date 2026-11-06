# FS-015 · C10 – Einführung in die App

| Feld | Wert |
|---|---|
| Zeitraum | 06.11.2026 – *offen* |
| Chunk | C10 (siehe [../chunks.md](../chunks.md)) – letzter Chunk der Chunkliste |
| Ausgewählt von | Entwickler:in (Compass Navigator) – Steuerwort „Vorarbeit“, Reihenfolge (… → C09 → **C10**) |
| Vorgänger | – (baut auf allen bisherigen Chunks auf) |
| Branch / Commits | `ifcm/fs-015-c10-einfuehrung` (enthält C01–C10), Commit `2b9fe70` |
| Status | **Ergebnis liegt vor – Alpha-Test offen** |

## 1. Chunk & Ziel
Neue Einführung in die Funktionen der App. Bezug: B2 („Einleitung in die Funktionen der App“), Mindmap „Einführung in
App → mit Claude Design gestalten → evtl. Zeit am 20.11.26, 17 Uhr?“. Bisher: 3 Einführungsseiten, nur beim ersten
Start, Texte auf Tischtennis zugeschnitten („Vorhand-, Rückhand- und Aufschlagübungen … am Tisch“).

Vorab genannte Prüfpunkte (Claude, 06.11.2026):
1. Inhalt auf den neuen Stand bringen, kurz halten: sportartneutrale Texte; Sportart wählen (C01–C03), Übungen mit
   Sekunden und Notizen (C07/C08), Pläne mit Wiederholung und Kalender (C05/C06), Bereich „Heute“ und Ziele (C06b/C09);
   höchstens ca. 5 Seiten, jederzeit überspringbar.
2. Auch für bestehende Nutzer:innen erreichbar: Wer die alte Einführung gesehen hat, bekäme die neue sonst nie zu
   Gesicht (Merker `onboarding-seen`). Vorschlag: Version im Merker (neue Einführung einmalig nach dem Update) und
   „Einführung erneut ansehen“ in den Einstellungen.
3. Gestaltung und Rechte: Design aus der Mindmap „mit Claude Design gestalten“ – Abstimmung nötig (siehe Rückfrage);
   bestehendes Design und Illustrationsstil (`OnboardingIllustration`) beibehalten, keine fremden Bilder ohne Rechte,
   barrierefrei (Tastatur, Screenreader, Kontrast).

**Rückfrage an die Entwickler:in (06.11.2026):** Soll die Gestaltung vorher in Claude Design entstehen (z. B. im
Termin am 20.11.26, 17 Uhr) und Claude setzt sie danach um – oder setzt Claude die Einführung direkt im
bestehenden App-Design um? *offen*

## 2. Prompts
### Prompt 1 – 06.11.2026 (Entwickler:in, wörtlich)
> Ja, dies war ursprünglich so geplant, allerdings ist dies auf heute verschoben. Daher steht einer Durchführung nichts im Wege

**Vorgehen Claude:** (1) Entwurf in **Claude Design** als Canvas „TrainerPro Einführung (C10)“ mit 5 Handy-Screens
(390 × 844) im App-Look: https://claude.ai/artifact/EJbqz62b9TabG2doyZdvrD (privat; nur für die Entwickler:in sichtbar,
Freigabe über das Teilen-Menü). (2) Umsetzung im Code nach dem Entwurf.
**Annahmen Claude:** Reihenfolge, Texte und die Sportart-Auswahl stammen aus dem Entwurf; die Illustrationen (Würfel
mit Symbolen), Buttons und Zurück-Pfeil oben bleiben im bestehenden App-Design (Prüfpunkt 3, Design-Lob A3) – die
Karten-Vorschauen im Entwurf dienen der Abstimmung des Inhalts. Neue Einführung einmalig für alle, die nur die alte
Version gesehen haben.

## 3. Ergebnis
| Schritt | Titel | Inhalt |
|---|---|---|
| 1 | Dein Training. Jede Sportart. | Sportart direkt wählen (6 sichtbar, „Alle 12 Sportarten“), Symbol + Farbe (C01–C03) |
| 2 | Deine Übungsdatenbank | Dauer auf die Sekunde, Notiz fürs nächste Mal (C07, C08) |
| 3 | Einmal planen – jede Woche trainieren | Wiederholung mit Wochentag/Uhrzeit, Kalender, „Plan für diesen Tag“ (C05, C06) |
| 4 | Auf einen Blick: Heute | Bereich „Heute“ mit Übungen und Notizen, Timer (C06b, C08a) |
| 5 | Bis zu 3 Kernziele | SMART-Check, Abhaken/Feiern; Hinweis auf „Einführung erneut ansehen“ (C09) |

| Datei | Änderung |
|---|---|
| `src/pages/Onboarding.tsx` | 5 neue, sportartneutrale Schritte (Überzeile, Titel, zwei Absätze); Schritt 1 mit Sportart-Auswahl (speichert sofort über den SportContext, `role="radiogroup"`); Fortschritt für Screenreader („Schritt x von 5“) |
| `src/lib/onboarding.ts` | Merker mit Version „2“ statt „1“ → neue Einführung einmalig auch für bestehende Nutzer:innen; robust bei fehlendem Speicher |
| `src/components/RouteGuards.tsx` | `OnboardingGate`: auch beim direkten Aufruf einer App-Seite (z. B. Lesezeichen `/plaene`) einmalig zur Einführung |
| `src/App.tsx` | App-Bereich in `OnboardingGate` eingebettet |
| `src/pages/Settings.tsx` | „Einführung erneut ansehen“ neben Datenschutz/Impressum |
| `README.md` | Beschreibung der Einführung aktualisiert |

Kennzeichnung: `// IFCM FS-015 / C10`. Keine neue Abhängigkeit, keine neuen Bilder (Illustration aus dem Bestand).
**Build/Lint:** grün, 0 Fehler (2 bekannte Warnungen).
**Oberflächentest (Playwright):** bestehende:r Nutzer:in (Merker „1“) öffnet `/plaene` → Einführung ✔ · „Schritt 1 von 5“ ✔ ·
6 → 12 Sportarten ✔ · Wahl „Fußball“ gespeichert, Kopfzeile danach ⚽ Fußball ✔ · Titel der Schritte 2–5 ✔ ·
„Los geht's“ → `/plaene`, Merker „2“ ✔ · „Einführung erneut ansehen“ → `/onboarding` ✔ · „Überspringen“ → Schritt 5 ✔.
Nachweis: [assets/fs015-nachweis.png](../assets/fs015-nachweis.png) (Schritt 1 · 2 · 4 · 5)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-015-c10-einfuehrung` – noch nicht auf der Live-Seite.

## 4. Alpha-Test – *offen, durch Entwickler:in*
**Guards (Claude):** keine neuen Abhängigkeiten, keine fremden Bilder ✔ · Entwurf in Claude Design ist privat ✔ ·
barrierefrei: echte Buttons, `aria-checked`, Fortschritt als Text ✔.

## 5. Alpha-Reflexion
*offen*

## 6. Abschluss
*offen*
