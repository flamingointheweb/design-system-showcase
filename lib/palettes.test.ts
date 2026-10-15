import { describe, expect, it } from 'vitest'
import { AA_TEXT, contrastRatio } from './contrast'
import { GROUNDS, KNOWN_GAPS, PALETTES, TEXT_ROLES, type PaletteKey, type TextRole } from './palettes'

// Each brand picks its own colours, but whatever it picks, its small text has
// to read. A palette that fails here needs a darker colour, not an exception.

const palettes = Object.entries(PALETTES) as [PaletteKey, (typeof PALETTES)[PaletteKey]][]

describe.each(palettes)('palette "%s"', (key, t) => {
  for (const role of TEXT_ROLES) {
    const floor = KNOWN_GAPS[`${key}:${role}`] ?? AA_TEXT
    it(`${role} reads on every ground (≥ ${floor}:1)`, () => {
      const worst = Math.min(...GROUNDS.map((bg) => contrastRatio(t[role], t[bg])))
      expect(worst).toBeGreaterThanOrEqual(floor)
    })
  }

  it('button text reads on the button', () => {
    expect(contrastRatio(t.ctaFg, t.ctaBg)).toBeGreaterThanOrEqual(AA_TEXT)
  })
})

describe('known gaps stay honest', () => {
  it('every gap still exists (remove the entry once it is fixed)', () => {
    for (const [id, floor] of Object.entries(KNOWN_GAPS) as [string, number][]) {
      const [key, role] = id.split(':') as [PaletteKey, TextRole]
      const t = PALETTES[key]
      const worst = Math.min(...GROUNDS.map((bg) => contrastRatio(t[role], t[bg])))
      expect(worst, id).toBeLessThan(AA_TEXT)
      expect(worst, id).toBeGreaterThanOrEqual(floor)
    }
  })
})
