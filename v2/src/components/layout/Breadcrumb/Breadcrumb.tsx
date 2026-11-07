import Link from 'next/link'
import styles from './Breadcrumb.module.css'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

function HomeIcon() {
  return (
    <svg
      className={styles.homeIcon}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className={styles.nav} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isHome = item.label === 'Home' && index === 0
          return (
            <li key={index} className={styles.item}>
              {index > 0 && <span className={styles.separator} aria-hidden="true">&rsaquo;</span>}
              {isLast || !item.href ? (
                <span
                  className={`${styles.current} ${isLast && !isHome ? styles.currentLast : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                  title={isLast && !isHome ? item.label : undefined}
                >
                  {isHome ? <HomeIcon /> : item.label}
                </span>
              ) : (
                <Link href={item.href} className={styles.link} aria-label={isHome ? 'Home' : undefined}>
                  {isHome ? <HomeIcon /> : item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
