import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
  stats?: Array<{ label: string; value: string | number; variant?: string }>
}

export function PageHeader({ title, stats }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {stats && stats.length > 0 && (
        <div className={styles.stats}>
          {stats.map((stat) => (
            <span key={stat.label} className={styles.stat}>
              {stat.value} {stat.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
