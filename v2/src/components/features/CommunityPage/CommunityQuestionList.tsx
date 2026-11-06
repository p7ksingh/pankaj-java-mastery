'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCommunityQuestions, type CommunityQuestion } from '@/lib/api/community'
import { getLocalQuestions, type LocalCommunityQuestion } from '@/lib/utils/localCommunity'
import { CommunityWriteSection } from './CommunityWriteSection'
import { CommunityLikeButton, getLikedSet } from './CommunityLikeButton'
import styles from './CommunityPage.module.css'

interface LocalQuestion {
  question: string
  topic: string | null
  company: string | null
  timestamp: number
  isNew: boolean
}

/**
 * Community page with inline write section and question list.
 * Fetches questions from API and shows locally posted ones at the top.
 */
export function CommunityQuestionList() {
  const [apiQuestions, setApiQuestions] = useState<CommunityQuestion[]>([])
  const [localQuestions, setLocalQuestions] = useState<LocalQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'recent' | 'popular'>('recent')
  const [showToast, setShowToast] = useState(false)

  // Load locally posted questions from localStorage on mount
  useEffect(() => {
    const saved = getLocalQuestions()
    setLocalQuestions(
      saved.map((q: LocalCommunityQuestion) => ({
        question: q.question,
        topic: q.topic,
        company: q.company,
        timestamp: q.timestamp,
        isNew: Date.now() - q.timestamp < 60_000, // "NEW" badge for last 60s
      })),
    )
  }, [])

  useEffect(() => {
    getCommunityQuestions()
      .then(setApiQuestions)
      .finally(() => setLoading(false))
  }, [])

  const handlePostSuccess = useCallback((question: string, topic: string | null, company: string | null) => {
    setLocalQuestions((prev) => [{ question, topic, company, timestamp: Date.now(), isNew: true }, ...prev])
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }, [])

  function formatTimestamp(ts: number): string {
    const diffMs = Date.now() - ts
    const diffMin = Math.floor(diffMs / (1000 * 60))
    if (diffMin < 1) {
      return 'Just now'
    }
    if (diffMin < 60) {
      return `${diffMin}m ago`
    }
    const diffH = Math.floor(diffMin / 60)
    if (diffH < 24) {
      return `${diffH}h ago`
    }
    const date = new Date(ts)
    const day = date.getDate()
    const month = date.toLocaleString('en', { month: 'short' })
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const h12 = hours % 12 || 12
    return `${day} ${month} ${year}, ${h12}:${minutes} ${ampm}`
  }

  function formatDate(dateStr?: string): string {
    if (!dateStr) {
      return ''
    }
    try {
      const date = new Date(dateStr)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffH = Math.floor(diffMs / (1000 * 60 * 60))
      if (diffH < 1) {
        return 'Just now'
      }
      if (diffH < 24) {
        return `${diffH}h ago`
      }
      const diffD = Math.floor(diffH / 24)
      if (diffD === 1) {
        return 'Yesterday'
      }
      if (diffD < 30) {
        return `${diffD} days ago`
      }
      return date.toLocaleDateString()
    } catch {
      return dateStr
    }
  }

  const totalCount = apiQuestions.length + localQuestions.length

  return (
    <>
      {/* Toast */}
      {showToast && (
        <div className={styles.toast}>Your question has been shared!</div>
      )}

      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Community Questions</h1>
        <p className={styles.pageSub}>Asked in real interviews. Shared by developers who were there.</p>
      </div>

      {/* Write Section */}
      <CommunityWriteSection onPostSuccess={handlePostSuccess} />

      {/* List Header */}
      <div className={styles.listHeader}>
        <div className={styles.listCount}>
          <strong>{totalCount}</strong> questions shared
        </div>
        <div className={styles.listTabs}>
          <button
            type="button"
            className={`${styles.listTab} ${filter === 'recent' ? styles.listTabActive : ''}`}
            onClick={() => setFilter('recent')}
          >
            Recent
          </button>
          <button
            type="button"
            className={`${styles.listTab} ${filter === 'popular' ? styles.listTabActive : ''}`}
            onClick={() => setFilter('popular')}
          >
            Popular
          </button>
        </div>
      </div>

      {/* Question List */}
      {loading ? (
        <p className={styles.loading}>Loading community questions...</p>
      ) : (
        <div className={styles.list}>
          {(() => {
            // Merge local + API into one unified list
            type UnifiedQ = {
              key: string
              question: string
              name: string
              time: string
              topic: string | null
              company: string | null
              isLocal: boolean
              isNew: boolean
            }

            const likedSet = typeof window !== 'undefined' ? getLikedSet() : new Set<string>()

            const all: UnifiedQ[] = [
              ...localQuestions.map((q) => ({
                key: `local-${q.timestamp}`,
                question: q.question,
                name: 'You',
                time: formatTimestamp(q.timestamp),
                topic: q.topic,
                company: q.company,
                isLocal: true,
                isNew: q.isNew,
              })),
              ...apiQuestions.map((q, i) => ({
                key: `api-${i}`,
                question: q.question,
                name: q.name || 'Anonymous',
                time: q.date ? formatDate(q.date) : '',
                topic: q.topic || null,
                company: (q.company && q.company !== 'Not specified') ? q.company : null,
                isLocal: false,
                isNew: false,
              })),
            ]

            // Sort: Recent = original order, Popular = liked first
            const sorted = filter === 'popular'
              ? [...all].sort((a, b) => {
                  const aLiked = likedSet.has(a.key) ? 1 : 0
                  const bLiked = likedSet.has(b.key) ? 1 : 0
                  return bLiked - aLiked
                })
              : all

            if (sorted.length === 0) {
              return null // empty state renders below
            }

            return sorted.map((q) => (
              <div key={q.key} className={styles.q}>
                <div className={styles.qRow}>
                  <div className={`${styles.qAvatar} ${q.isLocal ? styles.qAvatarYou : ''}`}>
                    {q.isLocal ? 'Y' : q.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.qBody}>
                    <div className={styles.qMeta}>
                      <span className={styles.qName}>{q.name}</span>
                      {q.isNew && <span className={styles.qBadgeNew}>NEW</span>}
                      {q.time && <span className={styles.qTime}>{q.time}</span>}
                      <div className={styles.qTags}>
                        {q.topic && <span className={styles.qTag}>{q.topic}</span>}
                        {q.company && <span className={styles.qCompany}>{q.company}</span>}
                      </div>
                    </div>
                    <div className={styles.qText}>{q.question}</div>
                    <div className={styles.qActions}>
                      <CommunityLikeButton questionKey={q.key} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          })()}

          {/* Empty state */}
          {totalCount === 0 && !loading && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className={styles.emptyTitle}>No questions yet</p>
              <p className={styles.emptySub}>People share questions like:</p>
              <div className={styles.emptyExamples}>
                <div className={styles.emptyEx}>
                  <span className={styles.emptyExArrow}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                  </span>
                  <span className={styles.emptyExText}>&ldquo;How does Spring handle circular dependencies with constructor injection?&rdquo;</span>
                </div>
                <div className={styles.emptyEx}>
                  <span className={styles.emptyExArrow}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                  </span>
                  <span className={styles.emptyExText}>&ldquo;Design a rate limiter for a distributed system&rdquo;</span>
                </div>
                <div className={styles.emptyEx}>
                  <span className={styles.emptyExArrow}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                  </span>
                  <span className={styles.emptyExText}>&ldquo;What happens when a Kafka consumer dies mid-batch?&rdquo;</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.emptyCta}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                Share your first question
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
