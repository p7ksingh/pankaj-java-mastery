import styles from './Pill.module.css'

interface PillProps {
  children: React.ReactNode
  variant?: 'default' | 'info' | 'success' | 'warning' | 'muted'
}

export function Pill({ children, variant = 'default' }: PillProps) {
  return <span className={`${styles.pill} ${styles[variant]}`}>{children}</span>
}
