'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import styles from './error.module.css'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>j</div>
        <div className={styles.emoji}>☕</div>
        <h1 className={styles.title}>We&apos;re brewing something</h1>
        <p className={styles.message}>
          We&apos;re working behind the scenes — maintenance, improvements, or
          adding new interview questions. Grab a coffee and come back in a minute.
        </p>
        <div className={styles.actions}>
          <button onClick={reset} className={styles.primaryBtn}>
            Try again
          </button>
          <Link href="/" className={styles.secondaryBtn}>
            Go to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
