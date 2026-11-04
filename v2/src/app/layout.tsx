import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google'
import { TopBar } from '@/components/layout/TopBar'
import { Footer } from '@/components/layout/Footer'
import '@/styles/theme.css'
import '@/styles/globals.css'
import '@/styles/typography.css'
import styles from './layout.module.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-family',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-reading',
  weight: ['400', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

const SITE_NAME = 'javabypankaj'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.javabypankaj.live'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Crack Any Java Interview`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    '2466+ real Java interview questions and answers covering every topic. One resource for all your interviews and System Design (HLD and LLD), with code and diagrams.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: `${SITE_NAME} | Crack Any Java Interview`,
    description: '2466+ real Java interview questions with code, diagrams, and ready-to-speak answers.',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'javabypankaj logo' }],
  },
  twitter: {
    card: 'summary',
    title: `${SITE_NAME} | Crack Any Java Interview`,
    description: '2466+ real Java interview questions with code, diagrams, and ready-to-speak answers.',
    images: ['/icon-512.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="theme-color" content="#2d3748" />
      </head>
      <body>
        <TopBar siteName={SITE_NAME} />
        <div className={styles.page}>{children}</div>
        <Footer
          siteName={SITE_NAME}
          tagline="One platform. Every interview. Your entire career."
          siteUrl={SITE_URL}
          social={{
            linkedin: 'https://www.linkedin.com/in/p7ksingh/',
            github: 'https://github.com/p7ksingh',
          }}
        />
      </body>
    </html>
  )
}
