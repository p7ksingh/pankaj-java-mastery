'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

interface SidebarState {
  /** Whether the sidebar panel is open */
  isOpen: boolean
  /** Toggle sidebar open/close */
  toggle: () => void
  /** Close the sidebar */
  close: () => void
}

const SidebarContext = createContext<SidebarState>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
})

const DESKTOP_BREAKPOINT = 1024
const STORAGE_KEY = 'sidebar-open'

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // On desktop, default to open; on mobile, default to closed
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // After hydration, read desktop preference
  useEffect(() => {
    const isDesktop = window.innerWidth > DESKTOP_BREAKPOINT
    if (isDesktop) {
      const saved = localStorage.getItem(STORAGE_KEY)
      // Default open on desktop unless user explicitly closed it
      setIsOpen(saved === null ? true : saved === 'true')
    }
    setHydrated(true)
  }, [])

  // Persist desktop preference
  useEffect(() => {
    if (!hydrated) {
      return
    }
    if (window.innerWidth > DESKTOP_BREAKPOINT) {
      localStorage.setItem(STORAGE_KEY, String(isOpen))
    }
  }, [isOpen, hydrated])

  // On resize, adjust behavior
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= DESKTOP_BREAKPOINT) {
        // Mobile: always close sidebar on resize to mobile
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggle = useCallback(() => setIsOpen((p) => !p), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}
