'use client'

import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { AA_TEXT, contrastRatio } from '@/lib/contrast'
import {
  GROUNDS, KNOWN_GAPS, PALETTES, TEXT_ROLES,
  type Ground, type Palette, type PaletteKey, type TextRole,
} from '@/lib/palettes'

const KEYS = Object.keys(PALETTES) as PaletteKey[]

/** A palette as custom properties. Every component below reads var(--…), so
 *  swapping this one object restyles the whole subtree. */
function vars(p: Palette): CSSProperties {
  return {
    '--page-bg': p.pageBg, '--surface': p.surface, '--sunk': p.sunk,
    '--ink': p.ink, '--text': p.text, '--muted': p.muted,
    '--faint': p.faint, '--faint-text': p.faintText, '--line': p.line,
    '--accent': p.accent, '--accent-text': p.accentText,
    '--accent-bg': p.accentBg, '--accent-border': p.accentBorder,
    '--cta-bg': p.ctaBg, '--cta-fg': p.ctaFg,
    '--display': p.display, '--body': p.body,
    '--radius': `${p.radius}px`, '--radius-sm': `${p.radiusSm}px`,
  } as CSSProperties
}

const ROLE_LABEL: Record<TextRole, string> = {
  ink: 'Ink', text: 'Text', muted: 'Muted', faintText: 'Faint text', accentText: 'Accent text',
}
const GROUND_LABEL: Record<Ground, string> = {
  pageBg: 'Page', surface: 'Surface', accentBg: 'Accent tint',
}

export default function Showcase() {
  const [active, setActive] = useState<PaletteKey>('cream')
  const p = PALETTES[active]

  return (
    <div className="themed" style={{ ...vars(p), minHeight: '100vh', background: 'var(--page-bg)', color: 'var(--text)', fontFamily: 'var(--body)' }}>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 16px 80px' }}>
        <header style={{ maxWidth: 640 }}>
          <Eyebrow>Design system</Eyebrow>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 600, lineHeight: 1.05, color: 'var(--ink)', margin: '10px 0 14px' }}>
            Three brands, one codebase
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0 }}>
            Every component asks for a colour by its role, never by its value. Each brand answers in its own
            colours, and a test on every pull request checks that every text colour reads on every surface it
            sits on. If one drops below WCAG AA, the change cannot ship.
          </p>
        </header>

        <Switcher active={active} onChange={setActive} />
        <p style={{ fontSize: 14, color: 'var(--muted)', margin: '10px 0 0' }} aria-live="polite">
          {p.note}
        </p>

        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', marginTop: 28 }}>
          <CourseCard />
          <ContrastMatrix palette={p} paletteKey={active} />
        </div>

        <section style={{ marginTop: 48 }} aria-labelledby="side-by-side">
          <h2 id="side-by-side" style={{ fontFamily: 'var(--display)', fontSize: 24, fontWeight: 600, color: 'var(--ink)', margin: '0 0 6px' }}>
            The same component, three times
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 18px' }}>
            One component, no props for colour. Only the custom properties around it change.
          </p>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))' }}>
            {KEYS.map((k) => (
              <div key={k} style={{ ...vars(PALETTES[k]), background: 'var(--page-bg)', fontFamily: 'var(--body)', color: 'var(--text)', padding: 16, borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
                <LessonRow title="Timing on the one" meta="Lesson 3 · 12 min" next />
                <p style={{ fontSize: 12, color: 'var(--faint-text)', margin: '10px 2px 0' }}>{PALETTES[k].name}</p>
              </div>
            ))}
          </div>
        </section>

        <footer style={{ marginTop: 56, paddingTop: 20, borderTop: '1px solid var(--line)', fontSize: 13, color: 'var(--muted)' }}>
          Built by <a href="https://yennyotero.com" style={{ color: 'var(--accent-text)' }}>Yenny Otero</a>.
          The palettes come from a production platform; the test is the one that guards it.
        </footer>
      </main>
    </div>
  )
}

/* ── Brand switcher: a radio group, so arrow keys move between brands ───── */

function Switcher({ active, onChange }: { active: PaletteKey; onChange: (k: PaletteKey) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(e: KeyboardEvent, i: number) {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (i + step + KEYS.length) % KEYS.length
    onChange(KEYS[next])
    refs.current[next]?.focus()
  }

  return (
    <div role="radiogroup" aria-label="Brand" style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 4, padding: 4, marginTop: 28, background: 'var(--sunk)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)' }}>
      {KEYS.map((k, i) => {
        const on = k === active
        const swatch = PALETTES[k]
        return (
          <button
            key={k}
            ref={(el) => { refs.current[i] = el }}
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(k)}
            onKeyDown={(e) => onKeyDown(e, i)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 40, padding: '8px 14px',
              border: 'none', borderRadius: 'calc(var(--radius-sm) - 2px)',
              background: on ? 'var(--surface)' : 'transparent',
              boxShadow: on ? '0 1px 2px rgb(0 0 0 / 0.08)' : 'none',
              color: on ? 'var(--ink)' : 'var(--muted)', fontSize: 14, fontWeight: on ? 600 : 500,
            }}
          >
            <span aria-hidden style={{ display: 'inline-flex' }}>
              {[swatch.ink, swatch.accent, swatch.accentBg].map((c) => (
                <span key={c} style={{ width: 12, height: 12, borderRadius: 99, background: c, border: '1px solid rgb(0 0 0 / 0.08)', marginLeft: -3 }} />
              ))}
            </span>
            {swatch.name}
          </button>
        )
      })}
    </div>
  )
}

/* ── A course card: the kind of page the system exists for ──────────────── */

function CourseCard() {
  const dialog = useRef<HTMLDialogElement>(null)

  return (
    <section aria-labelledby="course-title" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: 24 }}>
      <Eyebrow>Online course</Eyebrow>
      <h2 id="course-title" style={{ fontFamily: 'var(--display)', fontSize: 26, fontWeight: 600, lineHeight: 1.15, color: 'var(--ink)', margin: '8px 0 8px' }}>
        Musicality from the ground up
      </h2>
      <p style={{ fontSize: 15, lineHeight: 1.55, margin: '0 0 6px' }}>
        Hear the structure of a song before you dance it: phrases, breaks and the moment the music changes.
      </p>
      <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>12 lessons · 3 h 40 min</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '16px 0 18px' }}>
        {['Beginner friendly', 'Solo practice', 'Spanish + English'].map((c) => (
          <span key={c} style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-text)', background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-sm)', padding: '4px 10px' }}>{c}</span>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <LessonRow title="Counting the phrase" meta="Lesson 1 · 9 min" done />
        <LessonRow title="Where the break lands" meta="Lesson 2 · 14 min" done />
        <LessonRow title="Timing on the one" meta="Lesson 3 · 12 min" next />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
        <button type="button" style={{ minHeight: 44, padding: '12px 20px', background: 'var(--cta-bg)', color: 'var(--cta-fg)', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: 600 }}>
          Continue lesson 3
        </button>
        <button type="button" onClick={() => dialog.current?.showModal()} style={{ minHeight: 44, padding: '12px 20px', background: 'transparent', color: 'var(--ink)', border: '1px solid var(--ink)', borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: 600 }}>
          What you&rsquo;ll learn
        </button>
      </div>

      {/* Native <dialog>: focus moves in, Escape closes, focus returns to the
          button. No focus-trap library needed. */}
      <dialog ref={dialog} aria-labelledby="dialog-title" style={{ width: 'min(92vw, 420px)', padding: 24, background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', fontFamily: 'var(--body)' }}>
        <h3 id="dialog-title" style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 600, color: 'var(--ink)', margin: '0 0 10px' }}>What you&rsquo;ll learn</h3>
        <ul style={{ margin: '0 0 20px', paddingLeft: 18, lineHeight: 1.6, fontSize: 15 }}>
          <li>Count an eight-beat phrase in any song</li>
          <li>Hear a break coming and use it</li>
          <li>Change your energy when the music does</li>
        </ul>
        <form method="dialog">
          <button style={{ minHeight: 44, padding: '10px 18px', background: 'var(--cta-bg)', color: 'var(--cta-fg)', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: 600 }}>
            Close
          </button>
        </form>
      </dialog>
    </section>
  )
}

function LessonRow({ title, meta, done, next }: { title: string; meta: string; done?: boolean; next?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
      background: next ? 'var(--accent-bg)' : 'var(--sunk)',
      border: `1px solid ${next ? 'var(--accent-border)' : 'transparent'}`,
      borderRadius: 'var(--radius-sm)',
    }}>
      <span aria-hidden style={{
        flex: 'none', width: 22, height: 22, borderRadius: 99, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700,
        background: done ? 'var(--accent)' : 'transparent', color: 'var(--surface)',
        border: done ? 'none' : `2px solid ${next ? 'var(--accent-text)' : 'var(--faint)'}`,
      }}>{done ? '✓' : ''}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: done ? 'var(--faint-text)' : 'var(--ink)' }}>{title}</span>
        <span style={{ display: 'block', fontSize: 12, color: next ? 'var(--accent-text)' : 'var(--muted)' }}>
          {done ? 'Watched · ' : next ? 'Up next · ' : ''}{meta}
        </span>
      </span>
    </div>
  )
}

/* ── The test, made visible: every text role on every ground ───────────── */

function ContrastMatrix({ palette, paletteKey }: { palette: Palette; paletteKey: PaletteKey }) {
  return (
    <section aria-labelledby="matrix-title" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: 24 }}>
      <Eyebrow>What CI checks</Eyebrow>
      <h2 id="matrix-title" style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 600, color: 'var(--ink)', margin: '8px 0 6px' }}>
        Every text role on every ground
      </h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 16px' }}>
        Small text needs {AA_TEXT}:1. The same numbers run as a test on every pull request.
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 4, fontSize: 12 }}>
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: 'left', fontWeight: 600, color: 'var(--muted)', padding: '0 4px' }}><span className="sr-only">Role</span></th>
              {GROUNDS.map((g) => (
                <th key={g} scope="col" style={{ textAlign: 'left', fontWeight: 600, color: 'var(--muted)', padding: '0 4px' }}>{GROUND_LABEL[g]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TEXT_ROLES.map((role) => {
              const gap = KNOWN_GAPS[`${paletteKey}:${role}`]
              return (
                <tr key={role}>
                  <th scope="row" style={{ textAlign: 'left', fontWeight: 600, color: 'var(--ink)', padding: '0 4px', whiteSpace: 'nowrap' }}>{ROLE_LABEL[role]}</th>
                  {GROUNDS.map((g) => {
                    const ratio = contrastRatio(palette[role], palette[g])
                    const pass = ratio >= AA_TEXT
                    return (
                      <td key={g} style={{ background: palette[g], border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '8px 10px' }}>
                        <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: palette[role] }}>Aa</span>
                        <span style={{ display: 'block', color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
                          {ratio.toFixed(1)}:1 {pass ? '' : gap ? '· known gap' : '· fails'}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {TEXT_ROLES.some((r) => KNOWN_GAPS[`${paletteKey}:${r}`]) ? (
        <p style={{ fontSize: 12, color: 'var(--muted)', margin: '12px 0 0' }}>
          One known gap waits on the brand owner&rsquo;s OK. The test pins it at today&rsquo;s ratio, so it can only get better.
        </p>
      ) : null}
    </section>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-text)' }}>
      {children}
    </div>
  )
}
