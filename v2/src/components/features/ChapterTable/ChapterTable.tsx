import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Pill } from '@/components/ui/Pill'
import type { ChapterSummary } from '@/types'
import styles from './ChapterTable.module.css'

interface ChapterTableProps {
  chapters: ChapterSummary[]
}

export function ChapterTable({ chapters }: ChapterTableProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.colNum}>#</th>
          <th className={styles.colName}>Chapter</th>
          <th className={styles.colTopics}>Topics</th>
          <th className={styles.colQuestions}>Questions</th>
          <th className={styles.colStatus}>Status</th>
        </tr>
      </thead>
      <tbody>
        {chapters.map((chapter) => (
          <tr key={chapter.number} className={styles.row}>
            <td className={styles.cellNum}>
              <Badge>{String(chapter.number).padStart(2, '0')}</Badge>
            </td>
            <td className={styles.cellName}>
              <Link href={`/interview/${chapter.slug}/`} className={styles.chapterLink}>
                {chapter.title}
              </Link>
            </td>
            <td className={styles.cellTopics}>
              <Pill variant="info">{chapter.topicCount} topics</Pill>
            </td>
            <td className={styles.cellQuestions}>{chapter.questionCount}</td>
            <td className={styles.cellStatus}>
              <Pill variant="muted">Not Started</Pill>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
