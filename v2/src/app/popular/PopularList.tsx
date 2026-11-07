'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchTopLiked } from '@/lib/api/likes'
import { loadSearchIndex, type SearchEntry } from '@/lib/data/search'
import { LikeButton } from '@/components/features/LikeButton'
import styles from './page.module.css'

interface PopularItem {
  questionId: string
  likeCount: number
  title: string
  chapter: string
  topic: string
  url: string
  questionNumber: number
}

/**
 * Popular questions list — ranked by real like counts from DynamoDB.
 * Joins backend like data with search index metadata for display.
 */
export function PopularList() {
  const [items, setItems] = useState<PopularItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      // Fetch top-liked from API + search index for metadata in parallel
      const [topLiked, searchIndex] = await Promise.all([
        fetchTopLiked(50),
        loadSearchIndex(),
      ])

      // Build lookup map from search index
      const indexMap = new Map<string, SearchEntry>()
      for (const entry of searchIndex) {
        indexMap.set(entry.id, entry)
      }

      // Join: like counts + question metadata
      const joined: PopularItem[] = []
      for (const liked of topLiked) {
        const entry = indexMap.get(liked.questionId)
        if (entry) {
          joined.push({
            questionId: liked.questionId,
            likeCount: liked.likeCount,
            title: entry.t,
            chapter: entry.ch,
            topic: entry.tp || '',
            url: entry.u,
            questionNumber: entry.qn || 0,
          })
        }
      }

      setItems(joined)
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return <p className={styles.loading}>Loading popular questions...</p>
  }

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
        </div>
        <p className={styles.emptyTitle}>No popular questions yet</p>
        <p className={styles.emptyText}>
          Like questions as you read them — the most liked ones will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {items.map((item, index) => (
        <Link key={item.questionId} href={item.url} className={styles.row}>
          <span className={styles.rank}>{index + 1}</span>
          <div className={styles.info}>
            <span className={styles.questionTitle}>{item.title}</span>
            <span className={styles.meta}>{item.chapter} › {item.topic}</span>
          </div>
          <div className={styles.likeCol}>
            <LikeButton questionId={item.questionId} compact />
            <span className={styles.likeCount}>{item.likeCount}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
