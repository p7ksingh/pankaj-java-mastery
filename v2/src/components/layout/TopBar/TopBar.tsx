'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { ProfileMenu } from '@/components/features/ProfileMenu'
import { AppearanceModal } from '@/components/features/AppearanceModal'
import { Sidebar } from '@/components/layout/Sidebar'
import { WriteModal } from '@/components/features/WriteModal'
import { useSidebar } from '@/contexts/SidebarContext'
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
  } catch {
    /* localStorage unavailable */
  }
  return []
}

function saveToHistory(term: string) {
  const history = getHistory().filter((h) => h !== term)
  history.unshift(term)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
}

export function TopBar({ siteName: _siteName }: TopBarProps) {
  /* ── Search state ── */
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  /* ── Sidebar state (shared context) ── */
  const { isOpen: sidebarOpen, toggle: toggleSidebarCtx, close: closeSidebarCtx } = useSidebar()

  /* ── Profile / Appearance state ── */
  const [profileOpen, setProfileOpen] = useState(false)
  const [appearanceOpen, setAppearanceOpen] = useState(false)
  const [writeOpen, setWriteOpen] = useState(false)

  /* ── Sync search from URL hash ── */
  useEffect(() => {
    function readHash() {
      const hash = window.location.hash.slice(1)
      if (hash && window.location.pathname.includes('/search')) {
        setQuery(decodeURIComponent(hash))
        setSearchOpen(true)
      }
    }
    readHash()
    window.addEventListener('hashchange', readHash)
    return () => window.removeEventListener('hashchange', readHash)
  }, [])

  /* ── Load search history on mount ── */
  useEffect(() => {
    setHistory(getHistory())
  }, [])

  /* ── Close search on outside click ── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowHistory(false)
        if (!query.trim()) {
          setSearchOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [query])

  /* ── Search actions ── */
  function openSearch() {
    setSearchOpen(true)
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
    setSearchOpen(false)
    setQuery('')
    setShowHistory(false)
  }

  /* ── Sidebar toggle (delegates to shared context) ── */
  const toggleSidebar = useCallback(() => {
    setProfileOpen(false)
    toggleSidebarCtx()
  }, [toggleSidebarCtx])

  /* ── Profile toggle ── */
  const toggleProfile = useCallback(() => {
    setProfileOpen((prev) => {
      if (!prev && window.innerWidth <= 1024) {
        closeSidebarCtx()
      }
      return !prev
    })
  }, [closeSidebarCtx])

  const closeProfile = useCallback(() => {
    setProfileOpen(false)
  }, [])

  /* ── Appearance modal ── */
  const openAppearance = useCallback(() => {
    setAppearanceOpen(true)
  }, [])

  const closeAppearance = useCallback(() => {
    setAppearanceOpen(false)
  }, [])

  return (
    <>
      <nav className={styles.topbar} aria-label="Main">
        <div className={styles.left}>
          {/* Hamburger */}
          <button
            className={styles.hamburger}
            aria-label="Open sidebar"
            aria-expanded={sidebarOpen}
            onClick={toggleSidebar}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerTooltip}>Open sidebar</span>
          </button>

          {/* Logo + brand */}
          <Link href="/" className={styles.logoLink} title="Go to Home">
            <Logo size="header" className={styles.logo} />
          </Link>

          {/* Search */}
          <div className={styles.searchWrapper} ref={searchWrapperRef}>
            {!searchOpen ? (
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
                  onFocus={() => {
                    if (history.length > 0) {
                      setShowHistory(true)
                    }
                  }}
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
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </form>
            )}
            {showHistory && history.length > 0 && searchOpen && (
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
          {/* Write button */}
          <button className={styles.writeBtn} onClick={() => setWriteOpen(true)} aria-label="Write">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span className={styles.writeBtnText}>Write</span>
          </button>

          {/* Bell */}
          <button className={styles.bellBtn} aria-label="Notifications">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* Profile avatar */}
          <button
            className={styles.profileBtn}
            onClick={toggleProfile}
            aria-label="Profile"
            aria-expanded={profileOpen}
            data-profile-trigger
          >
            <div className={styles.profileAvatar}>PS</div>
          </button>
        </div>

        {/* Profile dropdown */}
        <ProfileMenu
          isOpen={profileOpen}
          onClose={closeProfile}
          onAppearanceClick={openAppearance}
        />
      </nav>

      {/* Sidebar */}
      <Sidebar />

      {/* Appearance modal */}
      <AppearanceModal isOpen={appearanceOpen} onClose={closeAppearance} />

      {/* Write modal */}
      <WriteModal isOpen={writeOpen} onClose={() => setWriteOpen(false)} />
    </>
  )
}
