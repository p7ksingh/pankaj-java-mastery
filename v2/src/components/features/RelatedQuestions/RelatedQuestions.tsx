import Link from 'next/link'
import { getQuestionsByTopic } from '@/lib/data/questions'
import styles from './RelatedQuestions.module.css'

interface RelatedQuestionsProps {
  currentQuestionId: string
  chapterNumber: number
  chapterSlug: string
  topicSlug: string
  topicTitle: string
}

/**
 * Related Questions section at the bottom of each reading page.
 * Shows other questions from the same topic — critical for SEO internal linking.
 * Google uses internal links to discover and rank related content.
 *
 * Server component — no client JS needed.
 */
export function RelatedQuestions({
  currentQuestionId,
  chapterNumber,
  chapterSlug,
  topicSlug,
  topicTitle,
}: RelatedQuestionsProps) {
  const allQuestions = getQuestionsByTopic(chapterNumber, topicSlug)

  // Filter out current question, take up to 5 related
  const related = allQuestions
    .filter((q) => q.id !== currentQuestionId)
    .slice(0, 5)

  if (related.length === 0) {
    return null
  }

  return (
    <nav className={styles.section} aria-label="Related questions">
      <h2 className={styles.heading}>More from {topicTitle}</h2>
      <div className={styles.list}>
        {related.map((q) => (
          <Link
            key={q.id}
            href={`/interview/${chapterSlug}/${topicSlug}/${q.urlSlug || q.id}/`}
            className={styles.item}
          >
            <span className={styles.title}>{q.shortTitle}</span>
            <svg className={styles.arrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        ))}
      </div>
    </nav>
  )
}
