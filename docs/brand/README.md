# TrainerPro Logo

Bildmarke: drei geneigte Flächen als Schlagbewegung, der Ball als heller Punkt am Treffpunkt.
Farben ausschließlich aus der App-Palette (Primary `#3b82f6`, Primary Dark `#1d4ed8`, Accent `#38bdf8`, Sun `#7dd3fc`).

## Dateien

| Datei | Zweck |
|---|---|
| `trainerpro-mark.svg` | Bildmarke mit Verlauf, transparenter Hintergrund |
| `trainerpro-mark-mono.svg` | Einfarbige Marke, nutzt `currentColor` (weiß auf Dunkel, Navy auf Hell) |
| `favicon.svg` | Quadratisches App-Icon / Favicon (abgerundetes Blau-Tile, weiße Marke) |
| `trainerpro-lockup.svg` | Horizontale Wortmarke: Marke + Schriftzug + Tagline |
| `Logo.tsx` | React-Komponenten `TrainerProMark` und `TrainerProLockup` |

## Schrift

Der Schriftzug nutzt **Kanit 900 Italic** (Google Fonts). In `index.html` einbinden:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@1,900&display=swap">
```

Der diagonale Schnitt durch die Buchstaben entsteht durch einen dünnen Balken in Hintergrundfarbe
über dem Schriftzug (siehe `trainerpro-lockup.svg`). Auf anderen Hintergründen die Farbe des
Balkens (`#0d1730`) auf die jeweilige Flächenfarbe setzen — oder den Balken weglassen.

## Einsatz in der App

```tsx
import { TrainerProMark, TrainerProLockup } from "@/components/brand/Logo";

// Sidebar / MobileTopBar — ersetzt das bisherige lucide-"Target"-Icon
<span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark">
  <TrainerProMark className="h-5 w-auto" />
</span>

// Login / Onboarding
<TrainerProLockup />
```

Favicon in `index.html`:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
```

## Regeln

- Schutzraum rundherum mindestens die Höhe des Ballpunkts.
- Marke nie drehen, spiegeln oder in anderen Farben als der Blau-Palette einfärben.
- Auf hellen Flächen: `trainerpro-mark-mono.svg` mit `color: #0a0f1c` oder die Verlaufs-Variante.
- Mindestgröße Bildmarke: 20 px Höhe; darunter das Favicon-Tile verwenden.
