// ============================================================================
// Three brands, one set of roles.
// ============================================================================
// These are real palettes from a platform I designed and built: the house
// brand of a dance event, and two artists who sell their own courses on the
// same codebase. Their pages share every component; only these values change.
//
// Components never ask for "gold" or "slate blue". They ask for a ROLE: `ink`
// for what is read first, `muted` for captions, `accentText` for a small link.
// Each brand answers that question in its own colours, and the test in
// palettes.test.ts makes sure every answer is readable.
// ============================================================================

export type Palette = {
  /** Shown in the switcher. */
  name: string
  /** One line on where the palette comes from. */
  note: string

  /** The page ground, behind everything. */
  pageBg: string
  /** Cards and raised surfaces. */
  surface: string
  /** Recessed panels: quotes, table headers, empty states. */
  sunk: string

  /** Headings and anything that has to be read first. */
  ink: string
  /** Body copy. */
  text: string
  /** Secondary copy: captions, dates, "3 lessons". */
  muted: string
  /** Placeholders, disabled states and icons. Not for text. */
  faint: string
  /** The quietest TEXT: footers, closed items. Must still reach 4.5:1. */
  faintText: string

  /** Hairlines and card borders. */
  line: string

  /** The brand colour: active states, bars, icons. */
  accent: string
  /** The accent when it is small text. Often darker than `accent`, because
   *  a brand colour that works as a fill rarely reads at 13px. */
  accentText: string
  /** A tinted card background, for the one thing on screen that matters most. */
  accentBg: string
  accentBorder: string

  /** Solid buttons: background and the text on top of it. */
  ctaBg: string
  ctaFg: string

  /** CSS font-family values. The variables come from app/layout.tsx. */
  display: string
  body: string

  /** Corner radius in px, and the smaller one for chips, buttons and inputs. */
  radius: number
  radiusSm: number
}

/** Roles that carry small text. Every one must read on every ground. */
export const TEXT_ROLES = ['ink', 'text', 'muted', 'faintText', 'accentText'] as const
/** Every surface small text sits on. */
export const GROUNDS = ['pageBg', 'surface', 'accentBg'] as const

export type TextRole = (typeof TEXT_ROLES)[number]
export type Ground = (typeof GROUNDS)[number]

export const CREAM: Palette = {
  name: 'Cream & Gold',
  note: 'The house brand. Soft 18px corners, a serif for titles.',

  pageBg: '#FEFCF8',
  surface: '#FFFFFF',
  sunk: '#F6F1E7',

  ink: '#1A150E',
  text: '#3A2F25',
  muted: '#7A6348',       // the original #8B7355 was 4.4:1, just under AA
  faint: '#C4B5A5',
  faintText: '#7A6348',

  line: '#EEE8DC',

  accent: '#C8973A',      // 2.6:1 on cream: a fill, never text
  accentText: '#8A6420',  // the same gold, darkened until it reads
  accentBg: '#FAF3E4',
  accentBorder: '#E8D4A0',

  ctaBg: '#1A150E',
  ctaFg: '#F5EDD8',

  display: 'var(--font-playfair), Georgia, serif',
  body: 'var(--font-manrope), system-ui, sans-serif',

  radius: 18,
  radiusSm: 12,
}

export const SLATE: Palette = {
  name: 'Slate',
  note: 'An artist’s own moodboard. Fashion editorial: 3px corners, slate blue leads.',

  pageBg: '#FCFBF8',
  surface: '#FFFFFF',
  sunk: '#F6F2EA',

  ink: '#33211A',
  text: '#4E3B31',
  muted: '#78695F',       // darkened from #8C7A6E (3.6 to 4.1:1)
  faint: '#BCAEA3',
  faintText: '#78695F',

  line: '#E9E1D6',

  accent: '#5B7CA5',
  accentText: '#4C6790',  // the slate blue fails AA as small text
  accentBg: '#EDF1F7',
  accentBorder: '#C9D6E7',

  ctaBg: '#3F5B80',
  ctaFg: '#FCFBF8',

  display: 'var(--font-fraunces), Georgia, serif',
  body: 'var(--font-dmsans), system-ui, sans-serif',

  radius: 3,
  radiusSm: 3,
}

export const VIOLET: Palette = {
  name: 'Violet',
  note: 'A dance school’s logo: one band of its rainbow swoosh, deep aubergine ink.',

  pageBg: '#FBF8FC',
  surface: '#FFFFFF',
  sunk: '#F4EFF7',

  ink: '#150620',
  text: '#4A3B54',
  muted: '#6B5B75',
  faint: '#8A7A94',
  faintText: '#8A7A94',   // 3.5:1, a known gap: see KNOWN_GAPS in the test

  line: '#E9E0EE',

  accent: '#7B2D8E',
  accentText: '#7B2D8E',
  accentBg: '#F4EFF7',
  accentBorder: '#CDBBD7',

  ctaBg: '#150620',
  ctaFg: '#FFFFFF',

  display: 'var(--font-bricolage), system-ui, sans-serif',
  body: 'var(--font-karla), system-ui, sans-serif',

  radius: 14,
  radiusSm: 10,
}

export const PALETTES = { cream: CREAM, slate: SLATE, violet: VIOLET } as const
export type PaletteKey = keyof typeof PALETTES

/**
 * Known gaps, waiting on the brand owner's OK before their palette changes.
 * Each entry pins today's worst ratio, so it can only get better, never worse.
 * palettes.test.ts also fails if a gap is fixed and the entry is left behind.
 */
export const KNOWN_GAPS: Partial<Record<`${PaletteKey}:${TextRole}`, number>> = {
  'violet:faintText': 3.5,
}
