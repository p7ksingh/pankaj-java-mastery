'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './QuestionCardList.module.css'

interface QuestionCardListProps {
  /** Total number of card children rendered inside this list. */
  cardCount: number
  children: React.ReactNode
}

/**
 * Keyboard-navigable wrapper for a list of question cards.
 * Supports ArrowDown/ArrowUp (and j/k) to move focus between cards,
 * and Enter to follow the focused card link.
 */
export function QuestionCardList({ cardCount, children }: QuestionCardListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const getCards = useCallback((): HTMLElement[] => {
    if (!containerRef.current) {
      return []
    }
    return Array.from(containerRef.current.querySelectorAll<HTMLElement>('a[data-card]'))
  }, [])

  const focusCard = useCallback((index: number) => {
    const cards = getCards()
    if (cards.length === 0 || index < 0 || index >= cards.length) {
      return
    }
    cards.forEach((c) => c.removeAttribute('data-card-active'))
    cards[index].setAttribute('data-card-active', 'true')
    cards[index].focus({ preventScroll: false })
    setActiveIndex(index)
  }, [getCards])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT'
      if (isInput) {
        return
      }

      const cards = getCards()
      if (cards.length === 0) {
        return
      }

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault()
        const next = Math.min(activeIndex + 1, cards.length - 1)
        focusCard(next)
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault()
        const prev = Math.max(activeIndex - 1, 0)
        focusCard(prev)
      } else if (e.key === 'Enter' && activeIndex >= 0 && activeIndex < cards.length) {
        cards[activeIndex].click()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, cardCount, focusCard, getCards])

  useEffect(() => {
    setActiveIndex(-1)
  }, [cardCount])

  return (
    <div
      ref={containerRef}
      className={styles.list}
      role="list"
      aria-label="Question cards"
    >
      {children}
    </div>
  )
}
