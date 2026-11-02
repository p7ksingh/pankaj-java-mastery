import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import type { TopicSummary } from '@/types'
import styles from './TopicTable.module.css'

interface TopicTableProps {
  topics: TopicSummary[]
  chapterSlug: string
  chapterTitle: string
  chapterNumber: number
}

export function TopicTable({ topics, chapterSlug, chapterNumber }: TopicTableProps) {
  const chPad = String(chapterNumber).padStart(2, '0')

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.colNum}>#</th>
          <th className={styles.colTopic}>Topic</th>
          <th className={styles.colQuestions}>Questions</th>
          <th className={styles.colRange}>Range</th>
          <th className={styles.colStatus}>Status</th>
        </tr>
      </thead>
      <tbody>
        {topics.map((topic) => (
          <tr key={topic.index} className={styles.row}>
            <td className={styles.cellNum}>
              <Badge>{topic.index + 1}</Badge>
            </td>
            <td className={styles.cellTopic}>
              <Link
                href={`/interview/${chapterSlug}/${topic.slug}/`}
                className={styles.topicLink}
              >
                {topic.title}
              </Link>
            </td>
            <td className={styles.cellQuestions}>{topic.questionCount}</td>
            <td className={styles.cellRange}>
              <span className={styles.range}>Ch {chPad}</span>
            </td>
            <td className={styles.cellStatus}>
              <span className={styles.status}>New</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
