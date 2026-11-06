'use client'

import { useUserProgress } from '@/hooks/useUserProgress'
import styles from './CompletionButton.module.css'

interface CompletionButtonProps {
  questionId: string
}

/**
 * Completion icon button with hover tooltip.
 * Replaces the old CompletionCheckbox.
 * Sits in the question header row next to the bookmark icon.
 */
export function CompletionButton({ questionId }: CompletionButtonProps) {
  const { isComplete, toggleComplete } = useUserProgress()
  const done = isComplete(questionId)

  return (
    <button
      className={`${styles.button} ${done ? styles.done : ''}`}
      onClick={() => toggleComplete(questionId)}
      aria-label={done ? 'Mark as incomplete' : 'Mark as complete'}
      aria-pressed={done}
    >
      <span className={styles.tooltip}>{done ? 'Completed' : 'Mark complete'}</span>
      {done ? (
        /* Filled check circle (completed) */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ) : (
        /* Outline check circle (not completed) */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )}
    </button>
  )
}
