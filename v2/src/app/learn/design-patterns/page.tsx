import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPatterns, getPatternsMeta } from '@/lib/data/tutorials'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Pill } from '@/components/ui/Pill'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Java Design Patterns',
  description: '21 Java design patterns with complete tutorials, industry projects with HLD and LLD, code examples, and interview questions.',
}

export default function DesignPatternsPage() {
  const meta = getPatternsMeta()
  const patterns = getAllPatterns()

  return (
    <main>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Learn', href: '/learn/' },
          { label: 'Design Patterns' },
        ]}
      />
      <PageHeader
        title={meta.title}
        stats={[{ label: 'Patterns', value: meta.totalPatterns }]}
      />
      <div className={styles.grid}>
        {patterns.map((p) => (
          <Link key={p.slug} href={`/learn/design-patterns/${p.slug}/`} className={styles.card}>
            <div className={styles.cardHeader}>
              <Badge>{String(p.order).padStart(2, '0')}</Badge>
              <Pill variant={p.difficulty === 'Hard' ? 'warning' : 'info'}>{p.difficulty}</Pill>
            </div>
            <h3 className={styles.cardTitle}>{p.title}</h3>
            <div className={styles.cardMeta}>
              <span>{p.sectionCount} sections</span>
              <span>{p.readingTimeMinutes} min read</span>
              <Pill variant="muted">{p.subcategory}</Pill>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
