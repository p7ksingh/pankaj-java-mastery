'use client'

import { useUserProgress } from '@/hooks/useUserProgress'
import styles from './TopicProgressBar.module.css'

interface TopicProgressBarProps {
  questionIds: string[]
}

/**
 * Tiny progress bar showing topic completion.
 * Renders completed/total text beside the bar.
 * Returns null when there are no questions.
 */
export function TopicProgressBar({ questionIds }: TopicProgressBarProps) {
  const { getTopicProgress } = useUserProgress()
  const progress = getTopicProgress(questionIds)

  if (progress.total === 0) {
    return null
  }

  const widthPct = `${progress.percentage}%`

  return (
    <span className={styles.wrapper}>
      <span
        className={styles.bar}
        role="progressbar"
        aria-valuenow={progress.completed}
        aria-valuemin={0}
        aria-valuemax={progress.total}
        aria-label={`${progress.completed} of ${progress.total} complete`}
      >
        <span className={styles.fill} style={{ width: widthPct }} />
      </span>
      <span className={styles.text}>{progress.completed}/{progress.total}</span>
    </span>
  )
}
