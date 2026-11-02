import type { Metadata } from 'next'
import Link from 'next/link'
import { getPatternsMeta } from '@/lib/data/tutorials'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { PageHeader } from '@/components/layout/PageHeader'
import { Pill } from '@/components/ui/Pill'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Learn Java | javabypankaj',
  description: 'Learn Java design patterns, SOLID principles, and system design with complete tutorials, code examples, and industry projects.',
}

export default function LearnPage() {
  const meta = getPatternsMeta()

  return (
    <main>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Learn' }]} />
      <PageHeader
        title="Learn"
        stats={[{ label: 'Patterns', value: meta.totalPatterns }]}
      />
      <Link href="/learn/design-patterns/" className={styles.categoryCard}>
        <h2 className={styles.categoryTitle}>{meta.title}</h2>
        <p className={styles.categoryDesc}>{meta.description}</p>
        <Pill variant="info">{meta.totalPatterns} tutorials</Pill>
      </Link>
    </main>
  )
}
