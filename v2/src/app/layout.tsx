import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { ThemeScript } from '@/components/layout/ThemeScript'
import { TopBar } from '@/components/layout/TopBar'
import { Footer } from '@/components/layout/Footer'
import { LayoutShell } from '@/components/layout/LayoutShell'
import { SubscribePopup } from '@/components/features/SubscribePopup'
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
    default: `${SITE_NAME} | Java Interviews, Mastered`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Deep Java answers you actually remember in the interview. Core Java to System Design with production code, edge cases, and expert insights.',
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
    title: `${SITE_NAME} | Java Interviews, Mastered`,
    description: 'The most thorough Java interview resource on the web. Every answer is explained from zero to senior level with runnable code, edge cases, and the exact follow-ups interviewers ask. Free and open.',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'javabypankaj | Java Interviews, Mastered' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Java Interviews, Mastered`,
    description: 'Deep Java answers you actually remember in the interview. Core Java to System Design with production code, edge cases, and expert insights.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#242424" />
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ThemeProvider>
          <SidebarProvider>
            <TopBar siteName={SITE_NAME} />
            <LayoutShell>
              <div id="main-content" className={styles.page}>{children}</div>
              <Footer
                siteName={SITE_NAME}
                social={{
                  linkedin: 'https://www.linkedin.com/in/p7ksingh/',
                  github: 'https://github.com/p7ksingh',
                }}
              />
            </LayoutShell>
            <SubscribePopup />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
