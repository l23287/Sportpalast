# FS-016 · C15 – Ziel-Funktion nicht verpflichtend

| Feld | Wert |
|---|---|
| Zeitraum | 09.11.2026 – *offen* |
| Chunk | C15 (Chunkliste 2, siehe [../chunks.md](../chunks.md)) |
| Ausgewählt von | Entwickler:in (Compass Navigator) – bestätigte Reihenfolge, erster Chunk der Liste 2; Steuerwort „Vorarbeit“ |
| Vorgänger | – (ändert das Zieltool aus FS-013/FS-014, C09/C09a) |
| Branch / Commits | `ifcm/fs-016-c15-ziele-optional` (enthält C01–C10 und C15), Commit `5b01107` |
| Status | **Ergebnis liegt vor – Alpha-Test offen** |

## 1. Chunk & Ziel
Das Zieltool soll ein Angebot sein, keine Pflicht: Wer keine Ziele setzen möchte, schaltet die Funktion aus und
sieht dann keine Ziel-Bereiche und -Hinweise mehr. Heute erscheint in der Planübersicht immer entweder der Block
„Deine Ziele“ oder der Hinweis „Setze dir bis zu 3 Kernziele …“, und die Einstellungen beginnen mit „Deine Ziele“.

Vorab genannte Prüfpunkte (Claude, 09.11.2026):
1. Ein klarer Schalter: „Ziele verwenden“ in den Einstellungen, gespeichert wie alle Einstellungen (lokal).
   Vorschlag: gilt für alle Sportarten gemeinsam; Standard **aus** für neue Nutzer:innen, **an**, wenn bereits Ziele
   angelegt sind – so verliert niemand Gewohntes.
2. Ausschalten ohne Datenverlust: ausgeschaltet verschwinden Ziel-Block und Hinweis aus der Übersicht und der
   Ziel-Bereich in den Einstellungen schrumpft auf den Schalter; vorhandene Ziele bleiben gespeichert und sind beim
   Wiedereinschalten sofort zurück.
3. Überall stimmig: Links auf `/einstellungen#ziele`, Schritt 5 der Einführung („Bis zu 3 Kernziele“ → als
   freiwilliges Angebot formulieren) und die spätere Statistik (C14) berücksichtigen den Schalter; nur C15 umsetzen,
   kein Umbau des Zieltools selbst.

## 2. Prompts
### Prompt 1 – 09.11.2026 (Entwickler:in, wörtlich)
> Agiere als erfahrener Programmierer und setzte dies, mit den entsprechenden Kommentaren im Code, sowie der
> Dokumentation um

Patterns (Richtlinie): 1 ✔ · 3 Persona ✔ · Kontext aus Chunkbeschreibung und 3 Prüfpunkten. Keine Rückfragen.
**Annahmen Claude:** wie in den Prüfpunkten vorgeschlagen (ein globaler Schalter; Standard aus, bei vorhandenen
Zielen an; Ausschalten ohne Datenverlust); zusätzlich Schalter direkt in Schritt 5 der Einführung.

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/components/Switch.tsx` (neu) | barrierefreier Schalter (`role="switch"`, `aria-checked`, Zustand zusätzlich als Text „An/Aus“) |
| `src/context/GoalsContext.tsx` | `goalsEnabled` / `setGoalsEnabled`, lokal gespeichert (`goalsEnabled`); Standard ohne gespeicherten Wert: an, wenn Ziele existieren, sonst aus |
| `src/pages/PlansOverview.tsx` | Ziel-Block bzw. Hinweis nur bei eingeschalteten Zielen |
| `src/pages/Settings.tsx` | Schalter „Ziele verwenden“ oben im Bereich „Deine Ziele“; Kopfzeile „Aus · freiwillig – bei Bedarf einschalten“; ausgeschaltet Hinweis, dass gespeicherte Ziele erhalten bleiben |
| `src/pages/Onboarding.tsx` | Schritt 5 „Ziele – wenn du magst“ mit freiwilliger Formulierung und Schalter |
| `README.md` | ergänzt |

Ziele werden beim Ausschalten **nicht gelöscht**. Kennzeichnung: `// IFCM FS-016 / C15`. Keine neue Abhängigkeit.
**Build/Lint:** grün, 0 Fehler (2 bekannte Warnungen).
**Oberflächentest (Playwright):** neue:r Nutzer:in: keine Ziele in der Übersicht, Kopfzeile „Aus · freiwillig“, Schalter aus,
kein Formular ✔ · Einschalten → Formular, Wert gespeichert, Hinweis in der Übersicht ✔ · bestehende:r Nutzer:in mit Ziel:
Ziele standardmäßig an ✔ · Ausschalten → nichts in der Übersicht, Ziel bleibt gespeichert, Hinweis „bleibt erhalten“ ✔ ·
Wiedereinschalten → Ziel sofort wieder sichtbar ✔ · Einführung Schritt 5 „Ziele – wenn du magst“ mit Schalter ✔.
Nachweis: [assets/fs016-nachweis.png](../assets/fs016-nachweis.png) (aus · an · Übersicht ohne Ziele · Einführung)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-016-c15-ziele-optional` – noch nicht auf der Live-Seite.

## 4. Alpha-Test – *offen, durch Entwickler:in*
**Guards (Claude):** keine neuen Abhängigkeiten ✔ · neue lokale Einstellung nur ein Ja/Nein-Wert ✔ · keine Datenlöschung beim Ausschalten ✔.

## 5. Alpha-Reflexion
*offen*

## 6. Abschluss
*offen*
