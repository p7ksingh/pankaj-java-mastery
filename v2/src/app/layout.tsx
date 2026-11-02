import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
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

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

const SITE_NAME = 'javabypankaj'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.javabypankaj.live'

export const metadata: Metadata = {
  title: `${SITE_NAME} | Crack Any Java Interview`,
  description:
    '3000+ real Java interview questions and answers covering every topic. One resource for all your interviews and System Design (HLD and LLD), with code and diagrams.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
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
