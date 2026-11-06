'use client'

import { useMemo } from 'react'
import { useLikes } from '@/hooks/useLikes'
import styles from './TopicLikeCount.module.css'

interface TopicLikeCountProps {
  questionIds: string[]
}

/**
 * Shows thumbs-up icon and like count for a topic.
 * Only renders when the count is greater than zero.
 */
export function TopicLikeCount({ questionIds }: TopicLikeCountProps) {
  const { getLikeCount } = useLikes()

  const count = useMemo(
    () => getLikeCount(questionIds),
    [getLikeCount, questionIds],
  )

  if (count === 0) {
    return null
  }

  return (
    <span className={styles.likes} aria-label={`${count} liked`}>
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
      {count}
    </span>
  )
}
