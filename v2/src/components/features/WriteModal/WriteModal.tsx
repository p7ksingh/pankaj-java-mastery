'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSubmitQuestion } from '@/hooks/useSubmitQuestion'
import { MIN_LENGTH, MAX_LENGTH } from '@/lib/utils/spamGuard'
import { addLocalQuestion } from '@/lib/utils/localCommunity'
import styles from './WriteModal.module.css'

interface WriteModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * LinkedIn-style write modal for submitting interview questions.
 * No credentials required. Spam protection via spamGuard utility.
 *
 * States: idle (form) -> loading -> success | error
 * Honeypot field traps bots. Rate limit prevents spam bursts.
 */
export function WriteModal({ isOpen, onClose }: WriteModalProps) {
  const [question, setQuestion] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { state, error, submit, reset } = useSubmitQuestion()

  const charCount = question.trim().length
  const canSubmit = charCount >= MIN_LENGTH && charCount <= MAX_LENGTH && state === 'idle'

  const handleClose = useCallback(() => {
    onClose()
    setTimeout(() => {
      setQuestion('')
      setHoneypot('')
      reset()
    }, 300)
  }, [onClose, reset])

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Auto-close modal after successful post
  useEffect(() => {
    if (state === 'success') {
      const timer = setTimeout(() => {
        handleClose()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [state, handleClose])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, handleClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = question.trim()
    submit(question, honeypot)
    // Save locally if basic checks pass (honeypot empty + valid length)
    if (honeypot.length === 0 && trimmed.length >= MIN_LENGTH && trimmed.length <= MAX_LENGTH) {
      addLocalQuestion(trimmed, null, null)
    }
  }

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }}
      aria-hidden={!isOpen}
    >
      <div className={styles.modal} role="dialog" aria-label="Share your interview question">

        {state === 'success' ? (
          <>
            <div className={styles.header}>
              <span className={styles.title} />
              <button className={styles.close} onClick={handleClose} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.success}>
              <div className={styles.successIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className={styles.successTitle}>Thank you</h3>
              <p className={styles.successText}>
                Your question has been submitted for review.
              </p>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.header}>
              <span className={styles.title}>Share your interview question</span>
              <button
                type="button"
                className={styles.close}
                onClick={handleClose}
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.body}>
              <textarea
                ref={textareaRef}
                className={styles.textarea}
                placeholder="Share a real interview question you were asked..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={MAX_LENGTH}
              />
              {/* Honeypot: hidden from humans, bots fill it */}
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className={styles.honeypot}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
            </div>

            <div className={styles.footer}>
              {error && <span className={styles.error}>{error}</span>}
              <span className={styles.charCount}>
                {charCount} / {MAX_LENGTH}
              </span>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={!canSubmit}
              >
                Post
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
