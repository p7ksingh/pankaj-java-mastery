import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllChapters, getChapterBySlug } from '@/lib/data/chapters'
import { getQuestionsByTopic, getQuestionByUrlSlug, resolveIdToUrlSlug } from '@/lib/data/questions'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import { AnswerSection } from '@/components/features/AnswerSection'
import { BookmarkButton } from '@/components/features/BookmarkButton'
import { CompletionButton } from '@/components/features/CompletionButton'
import { LikeButton } from '@/components/features/LikeButton'
import { ArticleTOC } from '@/components/features/ArticleTOC'
import { StructuredData } from '@/components/seo/StructuredData'
import styles from './page.module.css'

interface PageProps {
  params: Promise<{ chapter: string; topic: string; question: string }>
}

export async function generateStaticParams() {
  const chapters = getAllChapters()
  const params: Array<{ chapter: string; topic: string; question: string }> = []

  for (const ch of chapters) {
    const full = getChapterBySlug(ch.slug)
    if (!full) {
      continue
    }
    for (const topic of full.topics) {
      const questions = getQuestionsByTopic(ch.number, topic.slug)
      for (const q of questions) {
        // Generate both urlSlug (primary) and old Q-id (for redirects)
        params.push({ chapter: ch.slug, topic: topic.slug, question: q.urlSlug })
        params.push({ chapter: ch.slug, topic: topic.slug, question: q.id })
      }
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapter: chSlug, topic: topicSlug, question: qParam } = await params
  const chapter = getChapterBySlug(chSlug)
  if (!chapter) {
    return { title: 'Not Found' }
  }
  // Try urlSlug first, then fall back to Q-id
  const question = getQuestionByUrlSlug(chapter.number, topicSlug, qParam)
    ?? (() => {
      const urlSlug = resolveIdToUrlSlug(chapter.number, topicSlug, qParam)
      return urlSlug ? getQuestionByUrlSlug(chapter.number, topicSlug, urlSlug) : null
    })()
  if (!question) {
    return { title: 'Not Found' }
  }
  return {
    title: `${question.shortTitle} | ${chapter.title}`,
    description: `${question.title} - interview answer with code, diagrams and ready-to-speak explanation.`,
    alternates: { canonical: `/interview/${chSlug}/${topicSlug}/${question.urlSlug}/` },
    openGraph: {
      title: `${question.shortTitle} | ${chapter.title} | javabypankaj`,
      description: `${question.title} - interview answer with code, diagrams and ready-to-speak explanation.`,
    },
  }
}

export default async function QuestionPage({ params }: PageProps) {
  const { chapter: chSlug, topic: topicSlug, question: qParam } = await params
  const chapter = getChapterBySlug(chSlug)

  if (!chapter) {
    notFound()
  }

  const topic = chapter.topics.find((t) => t.slug === topicSlug)
  if (!topic) {
    notFound()
  }

  // Try urlSlug first
  const question = getQuestionByUrlSlug(chapter.number, topicSlug, qParam)

  if (!question) {
    // Maybe it's an old Q-based ID — redirect to the new slug URL
    const urlSlug = resolveIdToUrlSlug(chapter.number, topicSlug, qParam)
    if (urlSlug) {
      redirect(`/interview/${chSlug}/${topicSlug}/${urlSlug}/`)
    }
    notFound()
  }

  const sectionKeys = Object.keys(question.sections)

  const firstSection = question.sections[sectionKeys[0]]
  const answerText = typeof firstSection === 'string'
    ? firstSection.slice(0, 500)
    : (firstSection as { raw?: string }).raw?.slice(0, 500) || ''

  return (
    <main className={styles.reading}>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: question.title,
              acceptedAnswer: {
                '@type': 'Answer',
                text: answerText,
              },
            },
          ],
        }}
      />
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.javabypankaj.live/' },
            { '@type': 'ListItem', position: 2, name: chapter.title, item: `https://www.javabypankaj.live/interview/${chapter.slug}/` },
            { '@type': 'ListItem', position: 3, name: topic.title, item: `https://www.javabypankaj.live/interview/${chapter.slug}/${topicSlug}/` },
            { '@type': 'ListItem', position: 4, name: question.shortTitle },
          ],
        }}
      />
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: chapter.title, href: `/interview/${chapter.slug}/` },
          { label: topic.title, href: `/interview/${chapter.slug}/${topicSlug}/` },
          { label: question.shortTitle },
        ]}
      />
      <div className={styles.header}>
        <Badge variant="question">Q{question.questionNumber}</Badge>
        <span className={styles.meta}>
          Question {question.questionNumber} of {topic.questionCount}
        </span>
        <span className={styles.headerSpacer} />
        <LikeButton questionId={question.id} />
        <span className={styles.headerSep} />
        <CompletionButton questionId={question.id} />
        <BookmarkButton questionId={question.id} />
      </div>
      <h1 className={styles.title}>{question.shortTitle}</h1>
      {question.keyPoints && question.keyPoints.length > 0 && (
        <div className={styles.keyPoints}>
          <div className={styles.keyPointsHead}>
            Key Concepts
          </div>
          <ul className={styles.keyPointsList}>
            {question.keyPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}
      <article className={styles.article} id="question-article">
        {sectionKeys.map((key) => (
          <AnswerSection key={key} sectionKey={key} content={question.sections[key]} />
        ))}
      </article>
      <ArticleTOC containerSelector="#question-article" />
    </main>
  )
}
