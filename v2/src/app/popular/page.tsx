import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Popular Questions | javabypankaj',
  description: 'Most popular Java interview questions — ranked by how many developers were asked them.',
}

export default function PopularPage() {
  return (
    <main className={styles.page}>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Popular' },
        ]}
      />
      <div className={styles.comingSoon}>
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1 0 12 0c0-1.532-1.056-3.94-2-5-1.786 3-2 4-4 2z" />
          </svg>
        </div>
        <h1 className={styles.title}>Popular Questions</h1>
        <p className={styles.subtitle}>Coming soon</p>
        <p className={styles.desc}>
          We are collecting data on which questions developers are asked most frequently.
          Once we have enough signals, this page will show the top questions ranked by real interview frequency.
        </p>
      </div>
    </main>
  )
}
