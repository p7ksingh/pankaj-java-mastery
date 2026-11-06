import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllChapters, getChapterBySlug } from '@/lib/data/chapters'
import { getQuestionPreviewsByTopic } from '@/lib/data/questions'
import { ChapterDetailLayout } from '@/components/features/ChapterDetailLayout'
import { APP_CONFIG } from '@/lib/constants/config'

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
      title: `${topic.title} | ${chapter.title} | ${APP_CONFIG.site.name}`,
      description: `${topic.questionCount} interview questions on ${topic.title} in ${chapter.title} with code and ready-to-speak answers.`,
    },
  }
}

/**
 * Topic page — shows the two-panel layout with this topic selected.
 * Each topic has its own URL for full SEO indexing.
 */
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

  const allChapters = getAllChapters()
  const questions = getQuestionPreviewsByTopic(chapter.number, topicSlug)

  return (
    <main>
      <ChapterDetailLayout
        chapter={chapter}
        allChapters={allChapters}
        topic={topic}
        questions={questions}
      />
    </main>
  )
}
