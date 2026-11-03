'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { loadSearchIndex, filterIndex, type SearchEntry, type SearchResultItem } from '@/lib/data/search'
import { Badge } from '@/components/ui/Badge'
import styles from './SearchResults.module.css'

const RESULTS_LIMIT = 100

interface SearchResultsProps {
  initialQuery: string
}

export function SearchResults({ initialQuery }: SearchResultsProps) {
  const [index, setIndex] = useState<SearchEntry[]>([])
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    if (index.length === 0) {
      return
    }
    setResults(filterIndex(index, query, RESULTS_LIMIT))
  }, [index, query])

  const handleInput = useCallback((value: string) => {
    setQuery(value)
  }, [])

  if (loading) {
    return <p className={styles.loading}>Loading search index...</p>
  }

  return (
    <div>
      <input
        type="search"
        className={styles.input}
        placeholder="Search questions..."
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        autoFocus
      />
      {query.length >= 2 && (
        <p className={styles.count}>
          {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
        </p>
      )}
      <div className={styles.list}>
        {results.map((r) => (
          <Link key={r.id + r.url} href={r.url} className={styles.row}>
            <Badge variant="question">{r.id}</Badge>
            <div className={styles.info}>
              <span className={styles.title}>{highlightMatch(r.title, query)}</span>
              <span className={styles.chapter}>{r.chapter}</span>
            </div>
          </Link>
        ))}
      </div>
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
