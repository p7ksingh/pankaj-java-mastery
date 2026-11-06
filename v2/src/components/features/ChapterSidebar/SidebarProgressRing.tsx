'use client'

import { useMemo } from 'react'
import { useUserProgress } from '@/hooks/useUserProgress'
import styles from './SidebarProgressRing.module.css'

interface SidebarProgressRingProps {
  topics: Array<{ questionIds: string[] }>
}

const RADIUS = 14
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * SVG progress ring showing chapter-level completion.
 * Reads completion state from localStorage via useUserProgress.
 */
export function SidebarProgressRing({ topics }: SidebarProgressRingProps) {
  const { getChapterProgress } = useUserProgress()

  const progress = useMemo(
    () => getChapterProgress(topics),
    [getChapterProgress, topics],
  )

  const offset = CIRCUMFERENCE - (progress.percentage / 100) * CIRCUMFERENCE

  if (progress.totalQuestions === 0) {
    return null
  }

  return (
    <div className={styles.heroProgress}>
      <svg
        className={styles.ring}
        viewBox="0 0 36 36"
        role="img"
        aria-label={`${progress.percentage}% complete`}
      >
        <circle
          className={styles.ringBg}
          cx="18"
          cy="18"
          r={RADIUS}
        />
        <circle
          className={styles.ringFill}
          cx="18"
          cy="18"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={styles.text}>
        <strong className={styles.textStrong}>{progress.percentage}%</strong>
        {' '}complete ({progress.completedQuestions} of {progress.totalQuestions})
      </span>
    </div>
  )
}
