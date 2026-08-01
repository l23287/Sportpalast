// Validierte kategoriale Palette (dunkler Modus) aus der dataviz-Skill-Referenzpalette,
// gegen die App-Oberfläche (#16223c) geprüft: Lightness-Band, Chroma-Floor, CVD-Trennung
// (worst adjacent ΔE 8.4), Normalsicht-Floor (19.3) und Kontrast (>=3:1) bestehen alle.
export const CATEGORICAL_PALETTE_DARK = [
  '#3987e5', // blue
  '#d95926', // orange
  '#199e70', // aqua
  '#c98500', // yellow
  '#d55181', // magenta
] as const;

export const CHART_OTHER_COLOR = '#64748b';
