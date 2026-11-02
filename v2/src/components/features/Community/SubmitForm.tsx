'use client'

import { useState, useRef } from 'react'
import { submitQuestion } from '@/lib/api/community'
import { Button } from '@/components/ui/Button'
import styles from './Community.module.css'

const MIN_LENGTH = 10
const MAX_LENGTH = 2000

export function SubmitForm() {
  const [question, setQuestion] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const charCount = question.length

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (question.length < MIN_LENGTH) {
      setStatus('error')
      setMessage(`Question must be at least ${MIN_LENGTH} characters.`)
      return
    }

    setStatus('sending')
    const result = await submitQuestion({ question, email })
    setStatus('done')
    setMessage(result.message)

    if (result.success) {
      setQuestion('')
      setEmail('')
    }
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Share Your Interview Question</h2>
      <p className={styles.formDesc}>
        Faced a question in your interview? Share it here and help other developers prepare.
      </p>
      {status === 'done' ? (
        <p className={styles.successMsg}>{message}</p>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>
              Interview Question
              <span className={styles.charCount}>{charCount} / {MAX_LENGTH}</span>
            </label>
            <textarea
              className={styles.textarea}
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, MAX_LENGTH))}
              placeholder="Write the question you were asked..."
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Your Email</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email (hidden from public)"
              required
            />
          </div>
          {status === 'error' && <p className={styles.errorMsg}>{message}</p>}
          <Button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Submitting...' : 'Submit Question'}
          </Button>
        </form>
      )}
    </div>
  )
}
