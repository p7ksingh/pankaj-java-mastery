import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'javabypankaj | Crack Any Java Interview',
  description:
    '3000+ real Java interview questions and answers covering every topic. One resource for all your interviews and System Design (HLD and LLD), with code and diagrams.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
