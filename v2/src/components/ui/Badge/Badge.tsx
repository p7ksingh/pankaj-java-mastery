import styles from './Badge.module.css'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'chapter' | 'question'
}

export function Badge({ children, variant = 'chapter' }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>
}
