import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllChapters, getChapterBySlug } from '@/lib/data/chapters'
import { getQuestionPreviewsByTopic } from '@/lib/data/questions'
import { ChapterDetailLayout } from '@/components/features/ChapterDetailLayout'
import { APP_CONFIG } from '@/lib/constants/config'

interface PageProps {
  params: Promise<{ chapter: string }>
}

export async function generateStaticParams() {
  return getAllChapters().map((c) => ({ chapter: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapter: slug } = await params
  const chapter = getChapterBySlug(slug)

  if (!chapter) {
    return { title: 'Chapter Not Found' }
  }

  return {
    title: `${chapter.title} Interview Questions`,
    description: `${chapter.questionCount} real ${chapter.title} interview questions with code, diagrams and ready-to-speak answers.`,
    alternates: { canonical: `/interview/${slug}/` },
    openGraph: {
      title: `${chapter.title} Interview Questions | ${APP_CONFIG.site.name}`,
      description: `${chapter.questionCount} real ${chapter.title} interview questions with code, diagrams and ready-to-speak answers.`,
    },
  }
}

/**
 * Chapter page — auto-selects the first topic and shows its R1 cards.
 * Two-panel layout: sidebar with topic list + right panel with question cards.
 */
export default async function ChapterPage({ params }: PageProps) {
  const { chapter: slug } = await params
  const chapter = getChapterBySlug(slug)

  if (!chapter) {
    notFound()
  }

  const allChapters = getAllChapters()

  // Auto-select first topic
  const firstTopic = chapter.topics[0]
  if (!firstTopic) {
    notFound()
  }

  const questions = getQuestionPreviewsByTopic(chapter.number, firstTopic.slug)

  return (
    <main>
      <ChapterDetailLayout
        chapter={chapter}
        allChapters={allChapters}
        topic={firstTopic}
        questions={questions}
      />
    </main>
  )
}
