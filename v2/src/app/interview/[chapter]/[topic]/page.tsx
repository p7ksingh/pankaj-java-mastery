import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllChapters, getChapterBySlug } from '@/lib/data/chapters'
import { getQuestionsByTopic } from '@/lib/data/questions'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { StructuredData } from '@/components/seo/StructuredData'
import styles from './page.module.css'

interface PageProps {
  params: Promise<{ chapter: string; topic: string }>
}

export async function generateStaticParams() {
  const chapters = getAllChapters()
  const params: Array<{ chapter: string; topic: string }> = []

  for (const ch of chapters) {
    const full = getChapterBySlug(ch.slug)
    if (!full) {
      continue
    }
    for (const topic of full.topics) {
      params.push({ chapter: ch.slug, topic: topic.slug })
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapter: chSlug, topic: topicSlug } = await params
  const chapter = getChapterBySlug(chSlug)
  if (!chapter) {
    return { title: 'Not Found' }
  }
  const topic = chapter.topics.find((t) => t.slug === topicSlug)
  if (!topic) {
    return { title: 'Not Found' }
  }
  return {
    title: `${topic.title} | ${chapter.title}`,
    description: `${topic.questionCount} interview questions on ${topic.title} in ${chapter.title} with code and ready-to-speak answers.`,
    alternates: { canonical: `/interview/${chSlug}/${topicSlug}/` },
    openGraph: {
      title: `${topic.title} | ${chapter.title} | javabypankaj`,
      description: `${topic.questionCount} interview questions on ${topic.title} in ${chapter.title} with code and ready-to-speak answers.`,
    },
  }
}

export default async function TopicPage({ params }: PageProps) {
  const { chapter: chSlug, topic: topicSlug } = await params
  const chapter = getChapterBySlug(chSlug)

  if (!chapter) {
    notFound()
  }

  const topic = chapter.topics.find((t) => t.slug === topicSlug)
  if (!topic) {
    notFound()
  }

  const questions = getQuestionsByTopic(chapter.number, topicSlug)
  const topicPosition = `Topic ${topic.index + 1}/${chapter.topicCount}`

  return (
    <main>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.javabypankaj.live/' },
            { '@type': 'ListItem', position: 2, name: chapter.title, item: `https://www.javabypankaj.live/interview/${chapter.slug}/` },
            { '@type': 'ListItem', position: 3, name: topic.title },
          ],
        }}
      />
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: chapter.title, href: `/interview/${chapter.slug}/` },
          { label: topic.title },
        ]}
      />
      <PageHeader
        title={topic.title}
        stats={[
          { label: '', value: topicPosition },
          { label: 'Qs', value: questions.length },
        ]}
      />
      <div className={styles.questionList}>
        {questions.map((q) => (
          <Link
            key={q.id}
            href={`/interview/${chapter.slug}/${topicSlug}/${q.id}/`}
            className={styles.questionRow}
          >
            <Badge variant="question">{q.id}</Badge>
            <span className={styles.questionTitle}>{q.shortTitle}</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
