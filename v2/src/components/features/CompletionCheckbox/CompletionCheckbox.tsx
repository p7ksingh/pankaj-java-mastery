'use client'

import { useProgress } from '@/hooks/useProgress'
import styles from './CompletionCheckbox.module.css'

interface CompletionCheckboxProps {
  questionId: string
}

export function CompletionCheckbox({ questionId }: CompletionCheckboxProps) {
  const { isCompleted, toggle } = useProgress()
  const checked = isCompleted(questionId)

  return (
    <label className={styles.label}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={() => toggle(questionId)}
      />
      <span className={styles.text}>{checked ? 'Completed' : 'Mark as completed'}</span>
    </label>
  )
}
