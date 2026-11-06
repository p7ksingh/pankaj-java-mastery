'use client'

import { useState } from 'react'
import styles from './StarRatingInput.module.css'

interface StarRatingInputProps {
  /** Current rating value (1–5), or null if unrated. */
  value: number | null
  /** Called when user clicks a star. */
  onChange: (rating: number) => void
  /** Maximum stars. Default 5. */
  max?: number
  /** Size variant. */
  size?: 'sm' | 'md'
  /** Accessible label. */
  label?: string
}

/**
 * Clickable star rating input.
 * Hover previews the rating, click commits it.
 * Only used for questions — topics and chapters show computed read-only ratings.
 */
export function StarRatingInput({
  value,
  onChange,
  max = 5,
  size = 'sm',
  label = 'Rate this question',
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const displayed = hovered ?? value ?? 0

  return (
    <div
      className={`${styles.container} ${styles[size]}`}
      role="radiogroup"
      aria-label={label}
      title={value !== null ? `Your rating: ${value}/5` : label}
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= displayed

        return (
          <button
            key={starValue}
            type="button"
            className={`${styles.star} ${isFilled ? styles.filled : styles.empty}`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onChange(starValue)
            }}
            onMouseEnter={() => setHovered(starValue)}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            aria-checked={value === starValue}
            role="radio"
            title={`${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            ★
          </button>
        )
      })}
      {value !== null && (
        <span className={styles.label}>{value}.0</span>
      )}
    </div>
  )
}
