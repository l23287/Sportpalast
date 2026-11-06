# FS-014 · C09a – SMART-Prüfung erklärt & Einstellungen aufklappbar (Erweiterung zu C09)

| Feld | Wert |
|---|---|
| Zeitraum | 06.11.2026 – 06.11.2026 |
| Chunk | C09 (Erweiterung „C09a“) |
| Ausgewählt von | Entwickler:in – Ergebnis des Alpha-Tests von FS-013 |
| Vorgänger | [FS-013](FS-013-C09-zielsetzungstool.md) |
| Branch / Commits | `ifcm/fs-014-c09a-smart-erklaerung-ausklappen` (enthält C01–C09), Commit `86269cd` |
| Status | **bestanden** (Merge: Freigabe offen) |

## 1. Chunk & Ziel
1. Erklären, wie die Validierung der einzelnen SMART-Punkte funktioniert, und dies im Code genauer kommentieren.
2. In den Einstellungen „Zielsetzung“ und „Sportart“ als aufklappbare Bereiche, die nicht den ganzen Platz einnehmen.

## 2. Prompts
### Prompt 1 – 06.11.2026 (Entwickler:in, wörtlich; zweiter Teil nach einer Unterbrechung nachgereicht)
> Schon ein gute Anfang, bitte agiere als erfahrener Programmierer und erkläre wie die Validierung der einzelnen punkte
> der SMART Regel funktioniert und Kommentiere dies im Code genauer. Mache es zusätzlich grafisch so, dass die
> Zielsetzung und auch die Sportarten Einstellung zum ausklappen in den Einstellung bereit stellen und nicht den ganzen
> Bereich einnehmen. Führe dies auch wieder im Code aus.
>
> Nenne diese Änderung dann C09a

Patterns (Richtlinie): 1 ✔ · 3 Persona ✔. Keine Rückfragen.
**Annahmen Claude:** beide Bereiche standardmäßig eingeklappt (Kopfzeile mit Kurzinfo); „Deine Ziele“ öffnet sich
automatisch, wenn man über den Link aus der Planübersicht kommt; Formulareingaben bleiben beim Zuklappen erhalten.

## 3. Ergebnis

### So funktioniert die SMART-Validierung (Stand C09a)
| Kriterium | Regel im Code | Begründung (Quelle) | Grenze |
|---|---|---|---|
| **S** Spezifisch – `checkSpecific` | mind. 5 Wörter (Wörter = Buchstaben-/Ziffernfolgen inkl. Umlauten) | vage Ziele sind kurz („Besser werden“); konkrete beantworten „was, bis wann, wer“ | langer, aber schwammiger Satz gilt als erfüllt |
| **M** Messbar – `checkMeasurable` | Feld „Woran misst du den Erfolg?“ ausgefüllt **oder** Ziffer im Ziel **oder** Zahlwort (zwei … zwölf, zwanzig, hundert, Hälfte, doppelt …) | Erfolg muss rückblickend feststellbar sein; Ersatzgrößen erlaubt | Jahreszahl („bis 2027“) zählt mit |
| **A** Attraktiv – `checkAttractive` | Ziel ausgefüllt und kein Verneinungs-/Vermeidungswort (nicht, kein…, nie, niemals, nichts, aufhören, vermeiden, weniger) in Ziel oder Messgröße – Vergleich ganzer Wörter | positive Formulierung motiviert mehr | „ohne Fehler“ oder doppelte Verneinung werden nicht erkannt |
| **R** Realistisch – `checkRealistic` | Häkchen „Realitäts-Check“ selbst gesetzt | nur die Person kennt Zeit, Wissen, Mittel („ehrliche Bestandsaufnahme“) | Selbsteinschätzung |
| **T** Terminiert – `checkTimeBound` | Zieldatum gesetzt | Deadline als Kontrollpunkt und Ansporn | Datum in der Vergangenheit erlaubt, Anzeige „überschritten“ |

Ergebnis je Kriterium ist „erkennbar erfüllt“ oder „noch offen“; ein Ziel wird nie wegen eines offenen Kriteriums
abgelehnt. **Verbesserung gegenüber C09:** Wortvergleich jetzt über ganze Wörter mit Unicode (vorher `\b`, das
Umlaute nicht als Buchstaben erkennt) – „Nichtschwimmer“ löst keinen Verneinungs-Treffer mehr aus; „weniger“ und
„nichts“ ergänzt; Zahlwörter zählen für „Messbar“.

| Datei | Änderung |
|---|---|
| `src/lib/goals.ts` | `smartCheck` aufgeteilt in fünf einzeln dokumentierte Funktionen (Regel · Warum · Grenze, Beispiele), `words()` Unicode-Wortzerlegung, `NUMBER_WORDS`, erweiterte `NEGATIVE_WORDS` |
| `src/components/CollapsibleSection.tsx` (neu) | aufklappbarer Bereich: ganze Kopfzeile als Button mit `aria-expanded`, Kurzinfo, Pfeil; Inhalt per `hidden` (Eingaben bleiben erhalten) |
| `src/pages/Settings.tsx` | „Deine Ziele“ (Kurzinfo „1/3 offen · 1 erreicht“, öffnet bei `#ziele`) und „Sportart“ (Kurzinfo „Tischtennis · Auswahl & Reihenfolge“) als aufklappbare Bereiche |
| `src/components/GoalsBoard.tsx` | Option `showHeading`, damit die Überschrift im aufklappbaren Bereich nicht doppelt erscheint |
| `README.md` | ergänzt |

Kennzeichnung: `// IFCM FS-014 / C09a`. Keine neue Abhängigkeit.
**Build/Lint:** grün, 0 Fehler. **Logiktest (13 neue Fälle):** S 2/8 Wörter, Satzzeichen ✔ · M Feld/Ziffer/Zahlwort/
nichts ✔ · A positiv, „nicht“, „Nichtschwimmer“, „weniger“ in Messgröße, leer ✔ · Regression 5/5 ✔; die 8 Tests aus
FS-013 weiterhin ✔. **Oberflächentest (Playwright):** beide Bereiche eingeklappt mit Kurzinfo, Formular verborgen ✔ ·
Aufklappen zeigt Ziele und Formular ✔ · Entwurf bleibt nach Zu-/Aufklappen erhalten ✔ · Sportart-Bereich zeigt
Auswahl ✔ · Aufruf über `/einstellungen#ziele` öffnet „Deine Ziele“ ✔.
Nachweis: [assets/fs014-nachweis.png](../assets/fs014-nachweis.png) (eingeklappt · Ziele offen · Sportart offen)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-014-c09a-smart-erklaerung-ausklappen` – noch nicht auf der Live-Seite.

## 4. Alpha-Test
**Bewertung (Entwickler:in, 06.11.2026):** Steuerwort „Vorarbeit“ (= Ergebnis zufriedenstellend) → **bestanden**

**Guards (Claude):** keine neuen Abhängigkeiten, keine neuen Daten ✔.

## 5. Alpha-Reflexion
Durchgeführt von der Entwickler:in (Coach); Inhalte liegen bei der Entwickler:in. *Bei Bedarf nachtragen.*

## 6. Abschluss
C09 inkl. C09a **fertig** (06.11.2026). C10 baut auf diesem Branch auf.
