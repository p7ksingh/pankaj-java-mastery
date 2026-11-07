import Link from 'next/link'
import { getQuestionsByTopic } from '@/lib/data/questions'
import { QuestionNavKeys } from './QuestionNavKeys'
import styles from './QuestionNav.module.css'

interface QuestionNavProps {
  currentQuestionId: string
  chapterNumber: number
  chapterSlug: string
  topicSlug: string
}

/**
 * Previous / Next navigation between questions in a topic.
 * Server component — rendered at build time, no client JS.
 * Creates sequential internal links for SEO.
 */
export function QuestionNav({
  currentQuestionId,
  chapterNumber,
  chapterSlug,
  topicSlug,
}: QuestionNavProps) {
  const questions = getQuestionsByTopic(chapterNumber, topicSlug)
  const currentIndex = questions.findIndex((q) => q.id === currentQuestionId)

  if (currentIndex === -1 || questions.length <= 1) {
    return null
  }

  const prev = currentIndex > 0 ? questions[currentIndex - 1] : null
  const next = currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null
  const position = `${currentIndex + 1} / ${questions.length}`

  const prevUrl = prev ? `/interview/${chapterSlug}/${topicSlug}/${prev.urlSlug || prev.id}/` : null
  const nextUrl = next ? `/interview/${chapterSlug}/${topicSlug}/${next.urlSlug || next.id}/` : null

  return (
    <>
      <QuestionNavKeys prevUrl={prevUrl} nextUrl={nextUrl} />
      <nav className={styles.nav} aria-label="Question navigation">
        {prev ? (
          <Link href={prevUrl!} className={`${styles.card} ${styles.prev}`}>
            <div className={styles.label}>← Previous</div>
            <div className={styles.title}>{prev.shortTitle}</div>
          </Link>
        ) : (
          <span className={styles.spacer} />
        )}

        <span className={styles.center}>{position}</span>

        {next ? (
          <Link href={nextUrl!} className={`${styles.card} ${styles.next}`}>
            <div className={styles.label}>Next →</div>
            <div className={styles.title}>{next.shortTitle}</div>
          </Link>
        ) : (
          <span className={styles.spacer} />
        )}
      </nav>
      <div className={styles.hint}>Use ← → arrow keys to navigate</div>
    </>
  )
}
