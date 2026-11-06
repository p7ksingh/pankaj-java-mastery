'use client'

import { useSidebar } from '@/contexts/SidebarContext'
import styles from './LayoutShell.module.css'

interface LayoutShellProps {
  children: React.ReactNode
}

/**
 * Client wrapper that shifts page content when the sidebar is open on desktop.
 * On mobile (<= 1024px) the sidebar overlays, so no shift is needed.
 */
export function LayoutShell({ children }: LayoutShellProps) {
  const { isOpen } = useSidebar()

  return (
    <div className={`${styles.shell} ${isOpen ? styles.shifted : ''}`}>
      {children}
    </div>
  )
}
