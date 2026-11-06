import Link from 'next/link'
import { SidebarProgressRing } from './SidebarProgressRing'
import { TopicProgressBar } from './TopicProgressBar'
import { TopicLikeCount } from './TopicLikeCount'
import { CollapsibleChapterNav } from './CollapsibleChapterNav'
import { ActiveTopicScroller } from './ActiveTopicScroller'
import type { ChapterSummary, Chapter, TopicSummary } from '@/types'
import styles from './ChapterSidebar.module.css'

interface ChapterSidebarProps {
  chapter: Chapter
  allChapters: ChapterSummary[]
  activeTopicSlug: string
}

function TopicListItem({ topic, chapterSlug, isActive }: {
  topic: TopicSummary
  chapterSlug: string
  isActive: boolean
}) {
  const questionIds = topic.questionIds ?? []

  const content = (
    <Link
      href={`/interview/${chapterSlug}/${topic.slug}/`}
      className={`${styles.topicItem} ${isActive ? styles.topicItemSelected : ''}`}
      aria-current={isActive ? 'true' : undefined}
      title={topic.title}
    >
      <span className={styles.topicNum}>{topic.index + 1}</span>
      <span className={styles.topicInfo}>
        <span className={styles.topicName}>{topic.title}</span>
        {questionIds.length > 0 && (
          <TopicProgressBar questionIds={questionIds} />
        )}
      </span>
      <span className={styles.topicRight}>
        <span className={styles.topicCount}>{topic.questionCount}</span>
        {questionIds.length > 0 && (
          <TopicLikeCount questionIds={questionIds} />
        )}
      </span>
    </Link>
  )

  if (isActive) {
    return <ActiveTopicScroller>{content}</ActiveTopicScroller>
  }

  return content
}

/**
 * Left panel of the chapter detail two-panel layout.
 * Contains: chapter hero with progress ring, topic list with
 * per-topic progress bars and like counts, and a collapsible
 * other-chapters nav.
 *
 * Server component. Client interactivity is delegated to child
 * components marked with 'use client'.
 */
export function ChapterSidebar({ chapter, allChapters, activeTopicSlug }: ChapterSidebarProps) {
  const padded = String(chapter.number).padStart(2, '0')

  const topicsWithIds = chapter.topics.map((t) => ({
    questionIds: t.questionIds ?? [],
  }))

  return (
    <aside className={styles.sidebar} aria-label={`${chapter.title} navigation`}>
      <div className={styles.hero}>
        <div className={styles.heroTop}>
          <span className={styles.heroBadge}>{padded}</span>
          <span className={styles.heroTitle}>{chapter.title}</span>
        </div>
        <div className={styles.heroStats}>
          <span className={styles.heroPillGreen}>{chapter.topicCount} topics</span>
          <span className={styles.heroPillMuted}>{chapter.questionCount} questions</span>
        </div>
        <SidebarProgressRing topics={topicsWithIds} />
      </div>

      <nav className={styles.topicList} aria-label="Topics in this chapter">
        <div className={styles.topicListTitle}>Topics</div>
        {chapter.topics.map((topic) => (
          <TopicListItem
            key={topic.slug}
            topic={topic}
            chapterSlug={chapter.slug}
            isActive={topic.slug === activeTopicSlug}
          />
        ))}
      </nav>

      <CollapsibleChapterNav
        allChapters={allChapters}
        currentChapterNumber={chapter.number}
      />
    </aside>
  )
}
