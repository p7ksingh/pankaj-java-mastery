import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPatterns, getPatternBySlug } from '@/lib/data/tutorials'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Pill } from '@/components/ui/Pill'
import { Card } from '@/components/ui/Card'
import styles from './page.module.css'

interface PageProps {
  params: Promise<{ pattern: string }>
}

export async function generateStaticParams() {
  const patterns = getAllPatterns()
  return patterns.map((p) => ({ pattern: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pattern: slug } = await params
  const pattern = getPatternBySlug(slug)
  if (!pattern) {
    return { title: 'Not Found' }
  }
  return {
    title: `${pattern.title} in Java | javabypankaj`,
    description: `Complete tutorial on ${pattern.title} with code examples, industry project, HLD, LLD, and interview questions.`,
  }
}

export default async function PatternPage({ params }: PageProps) {
  const { pattern: slug } = await params
  const pattern = getPatternBySlug(slug)

  if (!pattern) {
    notFound()
  }

  return (
    <main>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Learn', href: '/learn/' },
          { label: 'Design Patterns', href: '/learn/design-patterns/' },
          { label: pattern.title },
        ]}
      />
      <div className={styles.header}>
        <Pill variant={pattern.difficulty === 'Hard' ? 'warning' : 'info'}>{pattern.difficulty}</Pill>
        <Pill variant="muted">{pattern.subcategory}</Pill>
        <span className={styles.meta}>{pattern.readingTimeMinutes} min read</span>
      </div>
      <h1 className={styles.title}>{pattern.title}</h1>
      <Card className={styles.content}>
        {pattern.sections.map((section) => (
          <div key={section.id} dangerouslySetInnerHTML={{ __html: section.html }} />
        ))}
      </Card>
    </main>
  )
}
