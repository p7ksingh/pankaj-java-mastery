import styles from './Logo.module.css'

interface LogoProps {
  size?: 'header' | 'footer' | 'hero'
  className?: string
}

/**
 * javabypankaj wordmark — Medium-style text-only logo.
 * Font: "Noe Display" → Georgia serif fallback.
 * No icon, no dot — the name IS the logo.
 */
export function Logo({ size = 'header', className }: LogoProps) {
  return (
    <span
      className={`${styles.wordmark} ${styles[size]} ${className ?? ''}`}
      aria-label="javabypankaj"
    >
      javabypankaj
    </span>
  )
}
