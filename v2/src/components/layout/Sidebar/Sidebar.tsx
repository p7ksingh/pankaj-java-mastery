'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useSidebar } from '@/contexts/SidebarContext'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Home',
    tooltip: 'All interview chapters',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6h-4v6H4a1 1 0 0 1-1-1V10.5z" />
        <line x1="8" y1="3" x2="8" y2="6" />
      </svg>
    ),
    activeIcon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6h-4v6H4a1 1 0 0 1-1-1V10.5z" />
        <line x1="8" y1="3" x2="8" y2="6" />
      </svg>
    ),
  },
  {
    href: '/library',
    label: 'Library',
    tooltip: 'Your saved questions',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </svg>
    ),
    activeIcon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </svg>
    ),
  },
  {
    href: '/popular',
    label: 'Popular',
    tooltip: 'Trending questions asked in interviews',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1 0 12 0c0-1.532-1.056-3.94-2-5-1.786 3-2 4-4 2z" />
      </svg>
    ),
    activeIcon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1 0 12 0c0-1.532-1.056-3.94-2-5-1.786 3-2 4-4 2z" />
      </svg>
    ),
  },
  {
    href: '/community',
    label: 'Community',
    tooltip: 'Questions shared by developers like you',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    activeIcon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
] as const

export function Sidebar() {
  const pathname = usePathname() ?? '/'
  const { isOpen, close } = useSidebar()

  // Close sidebar on Escape key (mobile behavior)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        close()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, close])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    const isMobile = window.innerWidth <= 1024
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay — only visible on mobile */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={close}
        aria-hidden="true"
      />
      {/* Sidebar panel */}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}
        aria-label="Navigation sidebar"
        role="navigation"
      >
        <div className={styles.top} />
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                title={item.tooltip}
                onClick={() => {
                  // On mobile, close sidebar after navigation
                  if (window.innerWidth <= 1024) {
                    close()
                  }
                }}
              >
                <span className={styles.icon}>{isActive ? item.activeIcon : item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className={styles.divider} />
      </aside>
    </>
  )
}
