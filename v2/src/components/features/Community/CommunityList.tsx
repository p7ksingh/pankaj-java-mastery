'use client'

import { useState, useEffect } from 'react'
import { getCommunityQuestions, type CommunityQuestion } from '@/lib/api/community'
import styles from './Community.module.css'

export function CommunityList() {
  const [questions, setQuestions] = useState<CommunityQuestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCommunityQuestions()
      .then((data) => {
        setQuestions(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p className={styles.loading}>Loading community questions...</p>
  }

  if (questions.length === 0) {
    return null
  }

  return (
    <div className={styles.listCard}>
      <h2 className={styles.listTitle}>Community Questions ({questions.length})</h2>
      <div className={styles.list}>
        {questions.map((q, i) => (
          <div key={i} className={styles.questionCard}>
            <p className={styles.questionText}>{q.question}</p>
            <div className={styles.questionMeta}>
              {q.company && q.company !== 'Not specified' && (
                <span className={styles.tag}>{q.company}</span>
              )}
              {q.topic && <span className={styles.tag}>{q.topic}</span>}
              {q.name && <span className={styles.author}>by {q.name}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
