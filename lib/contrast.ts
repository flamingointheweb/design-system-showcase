// WCAG 2.x contrast maths, used by the palette tests so a colour that fails
// AA cannot be added to a palette unnoticed.
// https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio

/** AA minimum for body-size text (under 18pt / 14pt bold). */
export const AA_TEXT = 4.5
/** AA minimum for large text and non-text UI (icons, input borders). */
export const AA_LARGE = 3

/** Relative luminance of a `#RRGGBB` colour. */
export function luminance(hex: string): number {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) throw new Error(`luminance: expected #RRGGBB, got "${hex}"`)
  const n = parseInt(m[1], 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Contrast ratio between two `#RRGGBB` colours, 1 to 21. Order does not matter. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
