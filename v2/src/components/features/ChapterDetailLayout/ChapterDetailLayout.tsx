import Link from 'next/link'
import { ChapterSidebar } from '@/components/features/ChapterSidebar'
import { QuestionCard, QuestionCardList } from '@/components/features/QuestionCard'
import { StructuredData } from '@/components/seo/StructuredData'
import { MobileTopicSelector } from './MobileTopicSelector'
import { APP_CONFIG } from '@/lib/constants/config'
import type { Chapter, ChapterSummary, TopicSummary, QuestionPreview } from '@/types'
import styles from './ChapterDetailLayout.module.css'

interface ChapterDetailLayoutProps {
  chapter: Chapter
  allChapters: ChapterSummary[]
  topic: TopicSummary
  questions: QuestionPreview[]
}

function EmptyTopicState({ chapterSlug }: { chapterSlug: string }) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon} aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </div>
      <h2 className={styles.emptyTitle}>No questions yet</h2>
      <p className={styles.emptyText}>
        This topic is coming soon. Try another topic in the sidebar.
      </p>
      <Link href={`/interview/${chapterSlug}/`} className={styles.emptyLink}>
        Browse all topics
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>
    </div>
  )
}

/**
 * Two-panel chapter detail layout.
 * Left: ChapterSidebar (chapter info, topic list, other chapters).
 * Right: Topic heading + question cards with keyboard navigation.
 *
 * Server component. All data passed as props.
 * Each topic is a real URL for full SEO indexing.
 */
export function ChapterDetailLayout({
  chapter,
  allChapters,
  topic,
  questions,
}: ChapterDetailLayoutProps) {
  const siteUrl = APP_CONFIG.site.url
  const topicPosition = `Topic ${topic.index + 1} of ${chapter.topicCount}`

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: chapter.title, item: `${siteUrl}/interview/${chapter.slug}/` },
      { '@type': 'ListItem', position: 3, name: topic.title },
    ],
  }

  return (
    <>
      <StructuredData data={structuredData} />

      <MobileTopicSelector
        chapterSlug={chapter.slug}
        topics={chapter.topics.map((t) => ({
          slug: t.slug,
          index: t.index,
          title: t.title,
          questionCount: t.questionCount,
        }))}
        activeTopicSlug={topic.slug}
      />

      <div className={styles.layout}>
        <ChapterSidebar
          chapter={chapter}
          allChapters={allChapters}
          activeTopicSlug={topic.slug}
        />

        <div className={styles.main} role="main">
          <div className={styles.mainInner}>
            <div className={styles.topicHeading}>
              <h1 className={styles.topicTitle}>{topic.title}</h1>
              <div className={styles.topicMeta}>
                <span>{chapter.title}</span>
                <span aria-hidden="true">&middot;</span>
                <span>{topicPosition}</span>
                <span aria-hidden="true">&middot;</span>
                <span className={styles.topicPill}>
                  {questions.length} {questions.length === 1 ? 'question' : 'questions'}
                </span>
              </div>
            </div>

            {questions.length > 0 ? (
              <QuestionCardList cardCount={questions.length}>
                {questions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    chapterSlug={chapter.slug}
                    topicSlug={topic.slug}
                  />
                ))}
              </QuestionCardList>
            ) : (
              <EmptyTopicState chapterSlug={chapter.slug} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
