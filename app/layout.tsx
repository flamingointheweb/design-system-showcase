import type { Metadata } from 'next'
import { Bricolage_Grotesque, DM_Sans, Fraunces, Karla, Manrope, Playfair_Display } from 'next/font/google'
import './globals.css'

// Two families per brand. Each one is exposed as a CSS variable that the
// palettes in lib/palettes.ts refer to, so switching brand never loads a font.
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })
const dmsans = DM_Sans({ subsets: ['latin'], variable: '--font-dmsans' })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })
const karla = Karla({ subsets: ['latin'], variable: '--font-karla' })

export const metadata: Metadata = {
  title: 'Three brands, one codebase',
  description: 'A themed design system with WCAG AA contrast enforced in CI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [playfair, manrope, fraunces, dmsans, bricolage, karla].map((f) => f.variable).join(' ')
  return (
    <html lang="en" className={fonts}>
      <body>{children}</body>
    </html>
  )
}
