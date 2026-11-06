'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserProgress } from '@/hooks/useUserProgress'
import type { ChapterSummary } from '@/types'
import styles from './ChapterTable.module.css'

interface ChapterTableProps {
  chapters: ChapterSummary[]
  /** Map of chapterNumber → all questionIds. Used for progress computation. */
  questionIdMap: Record<number, string[]>
}

function UserLikeCount({ questionIds }: { questionIds: string[] }) {
  const { getTopicProgress } = useUserProgress()
  const progress = getTopicProgress(questionIds)
  const count = progress.likeCount
  const label = count === 0 ? 'No likes yet' : `${count} liked`

  return (
    <div className={styles.likes} title={label} aria-label={label}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill={count > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
      {count > 0 && <span className={styles.likeNum}>{count}</span>}
      <span className={styles.likesTooltip}>{label}</span>
    </div>
  )
}

function UserProgressBar({ questionIds }: { questionIds: string[] }) {
  const { getTopicProgress } = useUserProgress()
  const progress = getTopicProgress(questionIds)
  const label = progress.percentage === 0 ? 'Not Started' : `${progress.percentage}% complete`

  return (
    <div className={styles.progress} title={label} aria-label={label}>
      <div className={styles.progressFill} style={{ width: `${progress.percentage}%` }} />
      <span className={styles.progressTooltip}>{label}</span>
    </div>
  )
}

export function ChapterTable({ chapters, questionIdMap }: ChapterTableProps) {
  const router = useRouter()

  function handleRowClick(slug: string) {
    router.push(`/interview/${slug}/`)
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.colNum}>#</th>
            <th>Chapter</th>
            <th className={styles.colTopics}>Topics</th>
            <th className={styles.colQuestions}>Questions</th>
            <th className={styles.colStatus}>Status</th>
          </tr>
        </thead>
        <tbody>
          {chapters.map((chapter) => {
            const questionIds = questionIdMap[chapter.number] ?? []

            return (
              <tr
                key={chapter.number}
                className={styles.row}
                onClick={() => handleRowClick(chapter.slug)}
                role="link"
                tabIndex={0}
                aria-label={`${chapter.title} — ${chapter.questionCount} questions`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleRowClick(chapter.slug)
                  }
                }}
              >
                <td>
                  <span className={styles.chNum}>
                    {String(chapter.number).padStart(2, '0')}
                  </span>
                </td>
                <td className={styles.chName}>
                  <Link href={`/interview/${chapter.slug}/`} className={styles.chapterLink}>
                    {chapter.title}
                  </Link>
                </td>
                <td className={styles.cellTopics}>
                  <span className={styles.topicsPill}>
                    {chapter.topicCount} topics
                  </span>
                </td>
                <td className={styles.cellQuestions}>{chapter.questionCount}</td>
                <td className={styles.cellStatus}>
                  <div className={styles.statusCell}>
                    <UserLikeCount questionIds={questionIds} />
                    <UserProgressBar questionIds={questionIds} />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
