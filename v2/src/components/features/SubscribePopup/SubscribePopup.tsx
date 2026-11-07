'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './SubscribePopup.module.css'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DISMISSED_KEY = 'javabypankaj.subscribeDismissed'
const SUBSCRIBED_KEY = 'javabypankaj.subscribed'
const DELAY_MS = 60_000 // 60 seconds

/**
 * Timed subscribe modal. Appears after 60 seconds.
 * Dismissible. Never shows again once dismissed or subscribed.
 * Clean centered modal, not a blocking popup.
 */
export function SubscribePopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISSED_KEY) || localStorage.getItem(SUBSCRIBED_KEY)) {
        return
      }
    } catch {
      return
    }

    const timer = setTimeout(() => setVisible(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  // Lock body scroll when visible
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [visible])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && visible) {
        dismiss()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  })

  const dismiss = useCallback(() => {
    setVisible(false)
    try {
      localStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // localStorage unavailable
    }
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (honeypot) {
      return
    }

    const trimmed = email.trim()
    if (!EMAIL_REGEX.test(trimmed)) {
      setState('error')
      setErrorMsg('Please enter a valid email.')
      return
    }

    setState('loading')

    try {
      await fetch(`${API_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
    } catch {
      // Treat as success even on error
    }

    setState('success')
    try {
      localStorage.setItem(SUBSCRIBED_KEY, '1')
    } catch {
      // localStorage unavailable
    }

    setTimeout(() => setVisible(false), 2000)
  }, [email, honeypot])

  if (!visible) {
    return null
  }

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) { dismiss() } }}>
      <div className={styles.modal}>
        {state === 'success' ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className={styles.successTitle}>You are in!</div>
            <p className={styles.successText}>We will notify you when new questions are added.</p>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <button className={styles.close} onClick={dismiss} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.body}>
              <div className={styles.icon}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h2 className={styles.title}>Stay updated</h2>
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
                {/* Honeypot */}
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <button type="submit" className={styles.btn} disabled={state === 'loading'}>
                  {state === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              {state === 'error' && <p className={styles.error}>{errorMsg}</p>}
              <p className={styles.privacy}>No spam. Unsubscribe anytime.</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
