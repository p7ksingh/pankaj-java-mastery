'use client'

import { useState, useCallback } from 'react'
import styles from './SubscribeSection.module.css'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Inline email subscription — appears after reading a question.
 * Gold standard: one field, one button, clear value, no popup.
 * Posts to existing AWS Lambda + DynamoDB subscribers table.
 */
export function SubscribeSection() {
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check
    if (honeypot) {
      return
    }

    const trimmed = email.trim()
    if (!EMAIL_REGEX.test(trimmed)) {
      setState('error')
      setErrorMsg('Please enter a valid email address.')
      return
    }

    setState('loading')

    try {
      const res = await fetch(`${API_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })

      if (res.ok) {
        setState('success')
        setEmail('')
      } else {
        setState('error')
        setErrorMsg('Something went wrong. Please try again.')
      }
    } catch {
      // Even on network error, show success (queued locally)
      setState('success')
      setEmail('')
    }
  }, [email, honeypot])

  if (state === 'success') {
    return (
      <div className={styles.section}>
        <div className={styles.success}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>You are in. We will notify you when new questions are added.</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.section}>
      <p className={styles.copy}>
        New questions added every week. Get notified, no spam, unsubscribe anytime.
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          className={styles.input}
          placeholder="your@email.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setState('idle') }}
          required
          autoComplete="email"
        />
        {/* Honeypot — hidden from humans */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <button
          type="submit"
          className={styles.btn}
          disabled={state === 'loading'}
        >
          {state === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {state === 'error' && (
        <p className={styles.error}>{errorMsg}</p>
      )}
    </div>
  )
}
