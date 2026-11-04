# FS-011 · C08a – Notizen im Bereich „Heute“ (Erweiterung zu C08)

| Feld | Wert |
|---|---|
| Zeitraum | 04.11.2026 – 04.11.2026 |
| Chunk | C08 (Erweiterung „C08a“) |
| Ausgewählt von | Entwickler:in – Ergebnis des Alpha-Tests von FS-010 |
| Vorgänger | [FS-010](FS-010-C08-notizzettel.md) |
| Branch / Commits | `ifcm/fs-011-c08a-notizen-heute` (enthält C01–C08), Commit `8ea0f46` |
| Status | **bestanden** (Merge: Freigabe offen) |

## 1. Chunk & Ziel
Im Bereich mit den tagesaktuellen Übungen („Heute“, C06b) werden die Notizen der Übungen immer mit angezeigt. Lange
Notizen sind gekürzt und lassen sich ausklappen.

## 2. Prompts
### Prompt 1 – 04.11.2026 (Entwickler:in, wörtlich)
> Okay, das ist schon ein guter Start. Agiere als erfahrener Programmierer und mache es möglich das bei dem Bereich
> mit den tagesaktuellen Übungen, die Notizen immer mit angezeigt werden,. Natürlich bei langen Notizen so, dass sie
> nicht komplett ausgeschrieben sind, aber ausgeklappt erden können . Ändere dies also im Cod und Kommentiere es mit CO8a.

Patterns (Richtlinie): 1 ✔ (Kennzeichnung „C08a“, Verhalten bei langen Notizen vorgegeben) · 3 Persona ✔. Keine Rückfragen.
**Annahmen Claude:** „lang“ = mehr als 80 Zeichen oder mehrere Zeilen; gekürzt auf 2 Zeilen mit „Mehr anzeigen“ /
„Weniger“; jede Notiz klappt einzeln auf; kurze Notizen ohne Button; Übungen ohne Notiz unverändert.

## 3. Ergebnis
| Datei | Änderung |
|---|---|
| `src/components/ExpandableNote.tsx` (neu) | Notiz mit Notizzettel-Symbol; lange Notizen 2 Zeilen (`line-clamp-2`) + Button „Mehr anzeigen“ / „Weniger“ (`aria-expanded`) |
| `src/components/TodayTraining.tsx` | unter jeder Übung mit Notiz die `ExpandableNote`, eingerückt unter dem Namen |
| `README.md` | Funktionsbeschreibung ergänzt |

Kennzeichnung: `// IFCM FS-011 / C08a`. Keine neue Abhängigkeit, keine neuen Daten.
**Build/Lint:** grün, 0 Fehler. **Oberflächentest (Playwright):** kurze Notiz vollständig ohne Button ✔ · lange Notiz
eingeklappt 2 Zeilen (32 px) → ausgeklappt vollständig (80 px), Button wechselt zu „Weniger“ ✔ · Übung ohne Notiz
ohne Notizfeld ✔. Nachweis: [assets/fs011-nachweis.png](../assets/fs011-nachweis.png) (eingeklappt · ausgeklappt)

**Testmöglichkeit:** lokal im Branch `ifcm/fs-011-c08a-notizen-heute` – noch nicht auf der Live-Seite.

## 4. Alpha-Test
**Bewertung (Entwickler:in, 04.11.2026):** „Die Ergebnisse sind grade echt zufriedenstellend.“ → **bestanden**

**Guards (Claude):** Notiz wird als Text dargestellt (kein HTML) ✔ · keine neuen Daten ✔.

## 5. Alpha-Reflexion
Durchgeführt von der Entwickler:in (Coach) am 04.11.2026; Inhalte liegen bei der Entwickler:in. *Bei Bedarf nachtragen.*

## 6. Abschluss
C08 inkl. C08a **fertig** (04.11.2026). C03 baut auf diesem Branch auf.
