'use client'

import { LikeButton } from '@/components/features/LikeButton'
import styles from './QuestionCardInteractive.module.css'

interface QuestionCardInteractiveProps {
  questionId: string
}

/**
 * Client-side interactive controls for a QuestionCard footer.
 * Renders only the compact like button. Completion tracking
 * is reserved for the reading page.
 */
export function QuestionCardInteractive({ questionId }: QuestionCardInteractiveProps) {
  return (
    <div className={styles.actions}>
      <LikeButton questionId={questionId} compact />
    </div>
  )
}
