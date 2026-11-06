'use client'

import { useState, useCallback, useEffect } from 'react'
import { validateSubmission, recordSubmission } from '@/lib/utils/spamGuard'
import { enqueue, flushQueue } from '@/lib/utils/submissionQueue'

type SubmitState = 'idle' | 'success' | 'error'

interface UseSubmitQuestionReturn {
  state: SubmitState
  error: string | null
  submit: (question: string, honeypot: string) => void
  reset: () => void
}

/**
 * Local-first question submission.
 *
 * 1. Validates input (spam guard)
 * 2. Saves to localStorage queue immediately
 * 3. Shows success to user instantly (no waiting for API)
 * 4. Flushes queue to API in background
 * 5. On mount, retries any previously failed submissions
 */
export function useSubmitQuestion(): UseSubmitQuestionReturn {
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    flushQueue()
  }, [])

  const submit = useCallback((question: string, honeypot: string) => {
    const validation = validateSubmission(question, honeypot)
    if (!validation.valid) {
      setState('error')
      setError(validation.error)
      return
    }

    enqueue(question)
    recordSubmission()
    setState('success')
    setError(null)

    flushQueue()
  }, [])

  const reset = useCallback(() => {
    setState('idle')
    setError(null)
  }, [])

  return { state, error, submit, reset }
}
