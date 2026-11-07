'use client'

import { useState, useCallback } from 'react'
import styles from './page.module.css'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Unsubscribe form. Sends DELETE to /subscribe endpoint.
 * Legally required for GDPR, CAN-SPAM, and Indian IT Act compliance.
 */
export function UnsubscribeForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmed = email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(trimmed)) {
      setState('error')
      setErrorMsg('Please enter a valid email address.')
      return
    }

    setState('loading')

    try {
      const res = await fetch(`${API_URL}/subscribe`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })

      if (res.ok) {
        setState('success')
        // Clear local subscription state
        try {
          localStorage.setItem('javabypankaj.subscribed', '')
          localStorage.removeItem('javabypankaj.subscribed')
        } catch {
          // localStorage unavailable
        }
      } else {
        setState('error')
        setErrorMsg('Something went wrong. Please try again.')
      }
    } catch {
      setState('error')
      setErrorMsg('Network error. Please try again.')
    }
  }, [email])

  if (state === 'success') {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h1 className={styles.successTitle}>Unsubscribed</h1>
        <p className={styles.successText}>
          Your email has been removed. You will no longer receive any emails from us.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </div>
      <h1 className={styles.title}>Unsubscribe</h1>
      <p className={styles.copy}>
        Enter your email address to stop receiving notifications from javabypankaj.live
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
        <button type="submit" className={styles.btn} disabled={state === 'loading'}>
          {state === 'loading' ? 'Removing...' : 'Unsubscribe'}
        </button>
      </form>
      {state === 'error' && <p className={styles.error}>{errorMsg}</p>}
    </div>
  )
}
