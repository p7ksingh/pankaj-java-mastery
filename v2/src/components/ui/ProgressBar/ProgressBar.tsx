import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  value: number
}

export function ProgressBar({ value }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className={styles.track} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div className={styles.fill} style={{ width: `${clamped}%` }} />
    </div>
  )
}
