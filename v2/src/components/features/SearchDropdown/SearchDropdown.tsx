'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { searchQuestions, type TypesenseHit } from '@/lib/search/typesenseClient'
import styles from './SearchDropdown.module.css'

const MAX_RESULTS = 15
const DEBOUNCE_MS = 200

interface SearchDropdownProps {
  onClose: () => void
}

/**
 * Inline search with Typesense-powered results dropdown.
 * Expands in the topbar, dropdown appears below with live results.
 * Searches 23,000+ entries (questions + sub-questions) via Typesense API.
 */
export function SearchDropdown({ onClose }: SearchDropdownProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<TypesenseHit[]>([])
  const [found, setFound] = useState(0)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-focus
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx >= 0 && resultsRef.current) {
      const items = resultsRef.current.querySelectorAll('button')
      if (items[activeIdx]) {
        items[activeIdx].scrollIntoView({ block: 'nearest' })
      }
    }
  }, [activeIdx])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  // Debounced search via Typesense
  const doSearch = useCallback((q: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    if (q.trim().length < 2) {
      setHits([])
      setFound(0)
      setActiveIdx(-1)
      setSearched(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      const result = await searchQuestions(q.trim(), MAX_RESULTS)
      setHits(result.hits)
      setFound(result.found)
      setActiveIdx(-1)
      setSearched(true)
    }, DEBOUNCE_MS)
  }, [])

  function handleChange(val: string) {
    setQuery(val)
    doSearch(val)
  }

  function navigateTo(url: string) {
    onClose()
    if (url.startsWith('/search#')) {
      window.location.href = url
    } else {
      router.push(url)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((prev) => Math.min(prev + 1, hits.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0 && hits[activeIdx]) {
        navigateTo(hits[activeIdx].document.url)
      } else if (query.trim().length >= 2) {
        navigateTo(`/search#${encodeURIComponent(query.trim())}`)
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const showResults = hits.length > 0
  const showEmpty = searched && hits.length === 0 && query.trim().length >= 2

  return (
    <div className={styles.wrap} ref={wrapRef}>
      {/* Inline input */}
      <div className={styles.bar}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="Search questions..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close search">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Results dropdown */}
      {(showResults || showEmpty) && (
        <div className={styles.dropdown}>
          {showResults && (
            <>
              <div className={styles.section}>Top results</div>
              <div className={styles.results} ref={resultsRef}>
                {hits.map((hit, i) => {
                  const doc = hit.document
                  const titleHighlight = hit.highlights?.find((h) => h.field === 'title')
                  const isSubQ = doc.type === 'subquestion'

                  return (
                    <button
                      key={doc.id}
                      type="button"
                      className={`${styles.item} ${i === activeIdx ? styles.itemActive : ''}`}
                      onClick={() => navigateTo(doc.url)}
                      onMouseEnter={() => setActiveIdx(i)}
                    >
                      <div className={`${styles.itemIcon} ${isSubQ ? styles.itemIconSub : ''}`}>
                        {isSubQ ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                          </svg>
                        )}
                      </div>
                      <div className={styles.itemInfo}>
                        <div
                          className={styles.itemTitle}
                          dangerouslySetInnerHTML={{
                            __html: titleHighlight?.snippet || escapeHtml(doc.shortTitle || doc.title),
                          }}
                        />
                        <div className={styles.itemPath}>
                          {doc.chapter} › {doc.topic}
                          {isSubQ && <span className={styles.subBadge}>sub-question</span>}
                        </div>
                      </div>
                      {i === activeIdx && <span className={styles.itemKbd}>↵</span>}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {showEmpty && (
            <div className={styles.empty}>
              No results for &ldquo;<strong>{query}</strong>&rdquo;
            </div>
          )}

          <div className={styles.footer}>
            <div className={styles.footerLeft}>
              <span className={styles.hint}><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
              <span className={styles.hint}><kbd>↵</kbd> open</span>
              <span className={styles.hint}><kbd>esc</kbd> close</span>
            </div>
            {found > MAX_RESULTS && (
              <button type="button" className={styles.footerAll} onClick={() => navigateTo(`/search#${encodeURIComponent(query.trim())}`)}>
                All <strong>{found}</strong> results
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
