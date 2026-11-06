import Link from 'next/link'
import { QuestionCardInteractive } from './QuestionCardInteractive'
import type { QuestionPreview } from '@/types'
import styles from './QuestionCard.module.css'

interface QuestionCardProps {
  question: QuestionPreview
  chapterSlug: string
  topicSlug: string
}

/**
 * Minimal question card for topic listings.
 * Title, oneliner preview, and a footer with like + read link.
 * Entire card is clickable and navigates to the reading page.
 */
export function QuestionCard({ question, chapterSlug, topicSlug }: QuestionCardProps) {
  const href = `/interview/${chapterSlug}/${topicSlug}/${question.urlSlug}/`
  const preview = question.oneliner

  return (
    <Link href={href} className={styles.card} prefetch={false} data-card>
      <div className={styles.title}>{question.shortTitle}</div>
      {preview && (
        <p className={styles.preview}>{preview}</p>
      )}
      <div className={styles.footer}>
        <QuestionCardInteractive questionId={question.id} />
        <span className={styles.read}>
          Read Answer
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
