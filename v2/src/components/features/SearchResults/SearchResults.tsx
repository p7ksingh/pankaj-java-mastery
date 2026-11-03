'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { loadSearchIndex, filterIndex, type SearchEntry, type SearchResult } from '@/lib/data/search'
import { Badge } from '@/components/ui/Badge'
import styles from './SearchResults.module.css'

const RESULTS_LIMIT = 100

interface SearchResultsProps {
  initialQuery: string
}

export function SearchResults({ initialQuery }: SearchResultsProps) {
  const [index, setIndex] = useState<SearchEntry[]>([])
  const [query, setQuery] = useState(initialQuery)
  const [result, setResult] = useState<SearchResult>({ items: [], suggestion: null })
  const [loading, setLoading] = useState(true)

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

  // Load search index
  useEffect(() => {
    loadSearchIndex()
      .then((data) => {
        setIndex(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  // Filter results when index or query changes
  useEffect(() => {
    if (index.length === 0) {
      return
    }
    setResult(filterIndex(index, query, RESULTS_LIMIT))
  }, [index, query])

  function searchSuggestion() {
    if (result.suggestion) {
      window.location.hash = encodeURIComponent(result.suggestion)
    }
  }

  if (loading) {
    return <p className={styles.loading}>Loading search index...</p>
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
      {query.length >= 2 && (
        <p className={styles.count}>
          {result.items.length} result{result.items.length !== 1 ? 's' : ''}
        </p>
      )}
      {result.suggestion && (
        <p className={styles.suggestion}>
          Did you mean:{' '}
          <button className={styles.suggestionLink} onClick={searchSuggestion}>
            {result.suggestion}
          </button>
          ?
        </p>
      )}
      <div className={styles.list}>
        {result.items.map((r) => (
          <Link key={r.id + r.url} href={r.url} className={styles.row}>
            <Badge variant="question">{r.id}</Badge>
            <div className={styles.info}>
              <span className={styles.title}>{highlightMatch(r.title, query)}</span>
              <span className={styles.chapter}>{r.chapter}</span>
            </div>
          </Link>
        ))}
      </div>
      {query.length >= 2 && result.items.length === 0 && !result.suggestion && (
        <p className={styles.empty}>No results found. Try a different keyword.</p>
      )}
    </div>
  )
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query || query.length < 2) {
    return text
  }

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className={styles.highlight}>{part}</mark>
    ) : (
      part
    ),
  )
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
