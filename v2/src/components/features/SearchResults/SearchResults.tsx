'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { searchQuestions, type TypesenseHit } from '@/lib/search/typesenseClient'
import { Badge } from '@/components/ui/Badge'
import styles from './SearchResults.module.css'

const RESULTS_LIMIT = 100

interface SearchResultsProps {
  initialQuery: string
}

/**
 * Full search results page — powered by Typesense.
 * Uses the same search engine as the topbar dropdown for consistent results.
 * Reads query from URL hash (e.g. /search#seven%20OOP).
 */
export function SearchResults({ initialQuery }: SearchResultsProps) {
  const [query, setQuery] = useState(initialQuery)
  const [hits, setHits] = useState<TypesenseHit[]>([])
  const [found, setFound] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  // Read query from URL hash on mount and on hash change
  useEffect(() => {
    function readHash() {
      const hash = window.location.hash.slice(1)
      if (hash) {
        setQuery(decodeURIComponent(hash))
      }
    }
    readHash()
    window.addEventListener('hashchange', readHash)
    return () => window.removeEventListener('hashchange', readHash)
  }, [])

  // Search via Typesense when query changes
  const doSearch = useCallback(async (q: string) => {
    if (!q || q.trim().length < 2) {
      setHits([])
      setFound(0)
      setSearched(false)
      return
    }

    setLoading(true)
    try {
      const result = await searchQuestions(q.trim(), RESULTS_LIMIT)
      setHits(result.hits)
      setFound(result.found)
    } catch {
      setHits([])
      setFound(0)
    }
    setSearched(true)
    setLoading(false)
  }, [])

  useEffect(() => {
    doSearch(query)
  }, [query, doSearch])

  if (loading) {
    return <p className={styles.loading}>Searching...</p>
  }

  return (
    <div>
      {query.length >= 2 ? (
        <h2 className={styles.heading}>
          Results for <strong>{query}</strong>
        </h2>
      ) : (
        <p className={styles.hint}>Use the search bar above to find questions.</p>
      )}
      {query.length >= 2 && searched && (
        <p className={styles.count}>
          {found} result{found !== 1 ? 's' : ''}
        </p>
      )}
      <div className={styles.list}>
        {hits.map((hit) => {
          const doc = hit.document
          const titleSnippet = hit.highlights?.find((h) => h.field === 'title')?.snippet
          return (
            <Link key={doc.id + doc.url} href={doc.url} className={styles.row}>
              <Badge variant="question">Q{doc.questionNumber}</Badge>
              <div className={styles.info}>
                <span
                  className={styles.title}
                  dangerouslySetInnerHTML={{
                    __html: titleSnippet || escapeHtml(doc.shortTitle || doc.title),
                  }}
                />
                <span className={styles.chapter}>
                  {doc.chapter} › {doc.topic}
                  {doc.type === 'subquestion' && <span className={styles.subTag}> · Sub-question</span>}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
      {query.length >= 2 && searched && hits.length === 0 && (
        <p className={styles.empty}>No results found. Try a different keyword.</p>
      )}
    </div>
  )
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
