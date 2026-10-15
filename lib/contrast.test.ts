import { describe, expect, it } from 'vitest'
import { contrastRatio, luminance } from './contrast'

describe('contrastRatio', () => {
  it('matches the WCAG reference points', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5)
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5)
    // #767676 is the well-known lightest grey that passes AA on white.
    expect(contrastRatio('#767676', '#FFFFFF')).toBeCloseTo(4.54, 2)
  })

  it('does not care which colour is the foreground', () => {
    expect(contrastRatio('#C8973A', '#FEFCF8')).toBe(contrastRatio('#FEFCF8', '#C8973A'))
  })

  it('rejects anything that is not #RRGGBB', () => {
    expect(() => luminance('#FFF')).toThrow()
    expect(() => luminance('rgba(0,0,0,1)')).toThrow()
  })
})
