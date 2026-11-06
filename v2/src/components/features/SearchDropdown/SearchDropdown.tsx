'use client'

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { useRouter } from 'next/navigation'
import { loadSearchIndex, filterIndex, type SearchEntry, type SearchResult } from '@/lib/data/search'
import styles from './SearchDropdown.module.css'

const MAX_RESULTS = 6
const DEBOUNCE_MS = 200

export interface SearchDropdownHandle {
  open: () => void
  close: () => void
  isOpen: boolean
}

/**
 * Inline search dropdown that appears under the TopBar search input.
 * Shows live results as user types with debounced search.
 * Supports keyboard navigation: ↑↓ to navigate, Enter to open, Escape to close.
 */
export const SearchDropdown = forwardRef<SearchDropdownHandle, object>(
  function SearchDropdown(_props, ref) {
    const router = useRouter()
    const [index, setIndex] = useState<SearchEntry[]>([])
    const [query, setQuery] = useState('')
    const [result, setResult] = useState<SearchResult>({ items: [], suggestion: null })
    const [activeIdx, setActiveIdx] = useState(-1)
    const [open, setOpen] = useState(false)
    const [indexLoaded, setIndexLoaded] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const wrapRef = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Load search index once (lazy — on first focus)
    const ensureIndex = useCallback(async () => {
      if (indexLoaded) {
        return
      }
      const data = await loadSearchIndex()
      setIndex(data)
      setIndexLoaded(true)
    }, [indexLoaded])

    // Expose open/close to parent (TopBar)
    useImperativeHandle(ref, () => ({
      open: () => {
        setOpen(true)
        ensureIndex()
        setTimeout(() => inputRef.current?.focus(), 50)
      },
      close: () => {
        setOpen(false)
        setQuery('')
        setResult({ items: [], suggestion: null })
        setActiveIdx(-1)
      },
      get isOpen() {
        return open
      },
    }), [open, ensureIndex])

    // Debounced search
    const doSearch = useCallback((q: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      if (q.trim().length < 2) {
        setResult({ items: [], suggestion: null })
        setActiveIdx(-1)
        return
      }
      debounceRef.current = setTimeout(() => {
        const res = filterIndex(index, q, MAX_RESULTS)
        setResult(res)
        setActiveIdx(-1)
      }, DEBOUNCE_MS)
    }, [index])

    function handleChange(val: string) {
      setQuery(val)
      doSearch(val)
    }

    function handleKeyDown(e: React.KeyboardEvent) {
      const items = result.items

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIdx((prev) => Math.min(prev + 1, items.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIdx((prev) => Math.max(prev - 1, -1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (activeIdx >= 0 && items[activeIdx]) {
          navigateTo(items[activeIdx].url)
        } else if (query.trim().length >= 2) {
          // Go to full search page
          navigateTo(`/search#${encodeURIComponent(query.trim())}`)
        }
      } else if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
        setResult({ items: [], suggestion: null })
        inputRef.current?.blur()
      }
    }

    function navigateTo(url: string) {
      setOpen(false)
      setQuery('')
      setResult({ items: [], suggestion: null })
      setActiveIdx(-1)
      if (url.startsWith('/search#')) {
        window.location.href = url
      } else {
        router.push(url)
      }
    }

    // Close on outside click
    useEffect(() => {
      function handleClick(e: MouseEvent) {
        if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    // ⌘K / Ctrl+K shortcut
    useEffect(() => {
      function handleGlobalKey(e: KeyboardEvent) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault()
          setOpen(true)
          ensureIndex()
          setTimeout(() => inputRef.current?.focus(), 50)
        }
      }
      document.addEventListener('keydown', handleGlobalKey)
      return () => document.removeEventListener('keydown', handleGlobalKey)
    }, [ensureIndex])

    if (!open) {
      return null
    }

    const showResults = query.trim().length >= 2 && result.items.length > 0
    const showEmpty = query.trim().length >= 2 && result.items.length === 0 && indexLoaded
    const totalMatches = query.trim().length >= 2 ? filterIndex(index, query, 100).items.length : 0

    return (
      <div className={styles.overlay} onClick={() => setOpen(false)}>
        <div className={styles.wrap} ref={wrapRef} onClick={(e) => e.stopPropagation()}>
          {/* Search input */}
          <div className={styles.inputWrap}>
            <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <input
              ref={inputRef}
              className={styles.input}
              type="text"
              placeholder="Search 2466 questions..."
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck={false}
            />
            <kbd className={styles.kbd}>esc</kbd>
          </div>

          {/* Results */}
          {showResults && (
            <>
              <div className={styles.section}>Top results</div>
              <div className={styles.results}>
                {result.items.map((r, i) => (
                  <button
                    key={r.id + r.url}
                    type="button"
                    className={`${styles.item} ${i === activeIdx ? styles.itemActive : ''}`}
                    onClick={() => navigateTo(r.url)}
                    onMouseEnter={() => setActiveIdx(i)}
                  >
                    <div className={styles.itemIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                    </div>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemTitle}>{highlightMatch(r.title, query)}</div>
                      <div className={styles.itemPath}>{r.chapter} › {r.topic}</div>
                    </div>
                    {i === activeIdx && <span className={styles.itemKbd}>↵</span>}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Empty state */}
          {showEmpty && (
            <div className={styles.empty}>
              No results for &ldquo;<strong>{query}</strong>&rdquo;
              {result.suggestion && (
                <span>
                  {' '}— try{' '}
                  <button
                    type="button"
                    className={styles.suggestion}
                    onClick={() => handleChange(result.suggestion!)}
                  >
                    {result.suggestion}
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.footerLeft}>
              <span className={styles.hint}><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
              <span className={styles.hint}><kbd>↵</kbd> open</span>
              <span className={styles.hint}><kbd>esc</kbd> close</span>
            </div>
            {totalMatches > MAX_RESULTS && (
              <button
                type="button"
                className={styles.footerAll}
                onClick={() => navigateTo(`/search#${encodeURIComponent(query.trim())}`)}
              >
                View all <strong>{totalMatches}</strong> results
              </button>
            )}
          </div>
        </div>
      </div>
    )
  },
)

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
