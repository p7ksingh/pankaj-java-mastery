import Link from 'next/link'
import styles from './error.module.css'

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>j</div>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page not found</h2>
        <p className={styles.message}>
          This page doesn&apos;t exist or was moved. Maybe the URL has a typo, or the question was reorganized.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            Go to Home
          </Link>
          <Link href="/search" className={styles.secondaryBtn}>
            Search questions
          </Link>
        </div>
      </div>
    </main>
  )
}
