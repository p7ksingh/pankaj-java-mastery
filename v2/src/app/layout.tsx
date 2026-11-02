import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/theme.css'
import '@/styles/globals.css'
import '@/styles/typography.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-family',
})

export const metadata: Metadata = {
  title: 'javabypankaj | Crack Any Java Interview',
  description:
    '3000+ real Java interview questions and answers covering every topic. One resource for all your interviews and System Design (HLD and LLD), with code and diagrams.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
