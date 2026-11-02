'use client'

import { useBookmarks } from '@/hooks/useBookmarks'
import styles from './BookmarkButton.module.css'

interface BookmarkButtonProps {
  questionId: string
}

export function BookmarkButton({ questionId }: BookmarkButtonProps) {
  const { isBookmarked, toggle } = useBookmarks()
  const active = isBookmarked(questionId)

  return (
    <button
      className={`${styles.button} ${active ? styles.active : ''}`}
      onClick={() => toggle(questionId)}
      aria-label={active ? 'Remove bookmark' : 'Bookmark this question'}
      aria-pressed={active}
    >
      {active ? '\u2665' : '\u2661'}
    </button>
  )
}
