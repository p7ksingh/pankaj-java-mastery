import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { LibraryList } from './LibraryList'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Library | javabypankaj',
  description: 'Your saved interview questions. Bookmark questions while reading and find them here.',
}

export default function LibraryPage() {
  return (
    <main className={styles.page}>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Library' },
        ]}
      />
      <div className={styles.header}>
        <h1 className={styles.title}>Your Library</h1>
        <p className={styles.subtitle}>Questions you saved while reading</p>
      </div>
      <LibraryList />
    </main>
  )
}
