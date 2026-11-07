'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { ProfileMenu } from '@/components/features/ProfileMenu'
import { AppearanceModal } from '@/components/features/AppearanceModal'
import { Sidebar } from '@/components/layout/Sidebar'
import { WriteModal } from '@/components/features/WriteModal'
import { SearchDropdown } from '@/components/features/SearchDropdown'
import { SupportModal } from '@/components/features/SupportModal'
import { useSidebar } from '@/contexts/SidebarContext'
import styles from './TopBar.module.css'

interface TopBarProps {
  siteName: string
}

export function TopBar({ siteName: _siteName }: TopBarProps) {
  /* ── Sidebar state (shared context) ── */
  const { isOpen: sidebarOpen, toggle: toggleSidebarCtx, close: closeSidebarCtx } = useSidebar()

  /* ── Profile / Appearance / Write state ── */
  const [profileOpen, setProfileOpen] = useState(false)
  const [appearanceOpen, setAppearanceOpen] = useState(false)
  const [writeOpen, setWriteOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleGlobalKey)
    return () => document.removeEventListener('keydown', handleGlobalKey)
  }, [])

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
          {!searchOpen ? (
            <button
              className={styles.searchIconBtn}
              onClick={() => setSearchOpen(true)}
              aria-label="Search questions"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
            </button>
          ) : (
            <SearchDropdown onClose={() => setSearchOpen(false)} />
          )}
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
          onSupportClick={() => setSupportOpen(true)}
        />
      </nav>

      {/* Sidebar */}
      <Sidebar />

      {/* Appearance modal */}
      <AppearanceModal isOpen={appearanceOpen} onClose={closeAppearance} />

      {/* Write modal */}
      <WriteModal isOpen={writeOpen} onClose={() => setWriteOpen(false)} />

      {/* Support modal */}
      <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  )
}
