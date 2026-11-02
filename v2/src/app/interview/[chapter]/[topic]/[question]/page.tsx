import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllChapters, getChapterBySlug } from '@/lib/data/chapters'
import { getQuestionsByTopic, getQuestionById } from '@/lib/data/questions'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AnswerSection } from '@/components/features/AnswerSection'
import { BookmarkButton } from '@/components/features/BookmarkButton'
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
        params.push({ chapter: ch.slug, topic: topic.slug, question: q.id })
      }
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapter: chSlug, topic: topicSlug, question: qId } = await params
  const chapter = getChapterBySlug(chSlug)
  if (!chapter) {
    return { title: 'Not Found' }
  }
  const question = getQuestionById(chapter.number, topicSlug, qId)
  if (!question) {
    return { title: 'Not Found' }
  }
  return {
    title: `${question.shortTitle} | ${chapter.title} | javabypankaj`,
    description: `${question.title} - interview answer with code, diagrams and ready-to-speak explanation.`,
  }
}

export default async function QuestionPage({ params }: PageProps) {
  const { chapter: chSlug, topic: topicSlug, question: qId } = await params
  const chapter = getChapterBySlug(chSlug)

  if (!chapter) {
    notFound()
  }

  const topic = chapter.topics.find((t) => t.slug === topicSlug)
  if (!topic) {
    notFound()
  }

  const question = getQuestionById(chapter.number, topicSlug, qId)
  if (!question) {
    notFound()
  }

  const sectionKeys = Object.keys(question.sections)

  return (
    <main>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: chapter.title, href: `/interview/${chapter.slug}/` },
          { label: topic.title, href: `/interview/${chapter.slug}/${topicSlug}/` },
          { label: question.id },
        ]}
      />
      <div className={styles.header}>
        <Badge variant="question">{question.id}</Badge>
        <span className={styles.meta}>
          Question {question.questionNumber} of {topic.questionCount}
        </span>
        <BookmarkButton questionId={question.id} />
      </div>
      <h1 className={styles.title}>{question.title}</h1>
      <Card className={styles.answerCard}>
        {sectionKeys.map((key) => (
          <AnswerSection key={key} sectionKey={key} content={question.sections[key]} />
        ))}
      </Card>
    </main>
  )
}
