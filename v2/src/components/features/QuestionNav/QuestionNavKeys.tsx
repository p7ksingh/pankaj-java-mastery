'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface QuestionNavKeysProps {
  prevUrl: string | null
  nextUrl: string | null
}

/**
 * Keyboard arrow key navigation for questions.
 * ← goes to previous, → goes to next.
 * Client component — listens for keydown events.
 */
export function QuestionNavKeys({ prevUrl, nextUrl }: QuestionNavKeysProps) {
  const router = useRouter()

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Don't navigate if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return
      }

      if (e.key === 'ArrowLeft' && prevUrl) {
        router.push(prevUrl)
      } else if (e.key === 'ArrowRight' && nextUrl) {
        router.push(nextUrl)
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [prevUrl, nextUrl, router])

  return null
}
