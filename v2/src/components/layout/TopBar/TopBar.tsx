'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { useDarkMode } from '@/hooks/useDarkMode'
import styles from './TopBar.module.css'

const HISTORY_KEY = 'jp-search-history'
const MAX_HISTORY = 5

interface TopBarProps {
  siteName: string
}

function getHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch {}
  return []
}

function saveToHistory(term: string) {
  const history = getHistory().filter((h) => h !== term)
  history.unshift(term)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
}

export function TopBar({ siteName }: TopBarProps) {
  const { isDark, toggle } = useDarkMode()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync from URL hash
  useEffect(() => {
    function readHash() {
      const hash = window.location.hash.slice(1)
      if (hash && window.location.pathname.includes('/search')) {
        setQuery(decodeURIComponent(hash))
        setOpen(true)
      }
    }
    readHash()
    window.addEventListener('hashchange', readHash)
    return () => window.removeEventListener('hashchange', readHash)
  }, [])

  // Load history
  useEffect(() => {
    setHistory(getHistory())
  }, [])

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowHistory(false)
        if (!query.trim()) {
          setOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [query])

  function openSearch() {
    setOpen(true)
    setHistory(getHistory())
    setTimeout(() => {
      inputRef.current?.focus()
      if (getHistory().length > 0) {
        setShowHistory(true)
      }
    }, 50)
  }

  function doSearch(term: string) {
    const trimmed = term.trim()
    if (trimmed.length < 2) {
      return
    }
    saveToHistory(trimmed)
    setHistory(getHistory())
    setShowHistory(false)
    if (window.location.pathname.includes('/search')) {
      window.location.hash = encodeURIComponent(trimmed)
    } else {
      window.location.href = `/search#${encodeURIComponent(trimmed)}`
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    doSearch(query)
  }

  function pickHistory(term: string) {
    setQuery(term)
    doSearch(term)
  }

  function clearHistory() {
    localStorage.removeItem(HISTORY_KEY)
    setHistory([])
    setShowHistory(false)
  }

  function closeSearch() {
    setOpen(false)
    setQuery('')
    setShowHistory(false)
  }

  return (
    <nav className={styles.topbar} aria-label="Main">
      <div className={styles.left}>
        <Link href="/" className={styles.logoLink} title="Go to Home">
          <Logo size={34} className={styles.logo} />
          <span className={styles.brand}>{siteName}</span>
        </Link>
        <div className={styles.searchWrapper} ref={wrapperRef}>
          {!open ? (
            <button
              className={styles.searchIconBtn}
              onClick={openSearch}
              aria-label="Search questions"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
            </button>
          ) : (
            <form className={styles.searchBar} onSubmit={handleSubmit}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
              <input
                ref={inputRef}
                className={styles.searchInput}
                type="text"
                placeholder="Search questions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if (history.length > 0) { setShowHistory(true); } }}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                className={styles.closeBtn}
                onClick={closeSearch}
                aria-label="Close search"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </form>
          )}
          {showHistory && history.length > 0 && open && (
            <div className={styles.historyDropdown}>
              <div className={styles.historyHeader}>
                <span className={styles.historyTitle}>Recent</span>
                <button className={styles.historyClear} onClick={clearHistory}>Clear</button>
              </div>
              {history.map((h) => (
                <button key={h} className={styles.historyItem} onClick={() => pickHistory(h)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  {h}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <button
          className={styles.themeBtn}
          onClick={toggle}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '\u2600' : '\u263D'}
        </button>
      </div>
    </nav>
  )
}
