'use client'

import { useUserProgress } from '@/hooks/useUserProgress'
import styles from './CompletionCheckbox.module.css'

interface CompletionCheckboxProps {
  questionId: string
}

export function CompletionCheckbox({ questionId }: CompletionCheckboxProps) {
  const { isComplete, toggleComplete } = useUserProgress()
  const checked = isComplete(questionId)

  return (
    <label className={styles.label}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={() => toggleComplete(questionId)}
      />
      <span className={styles.text}>{checked ? 'Completed' : 'Mark as completed'}</span>
    </label>
  )
}
