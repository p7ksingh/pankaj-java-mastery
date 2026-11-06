import { getAllChapters, getChapterBySlug } from '@/lib/data/chapters'
import { ChapterTable } from '@/components/features/ChapterTable'
import { StructuredData } from '@/components/seo/StructuredData'
import styles from './page.module.css'

/** Build a map of chapterNumber → all questionIds for progress tracking. */
function buildQuestionIdMap(chapters: ReturnType<typeof getAllChapters>): Record<number, string[]> {
  const map: Record<number, string[]> = {}
  for (const ch of chapters) {
    const full = getChapterBySlug(ch.slug)
    if (full) {
      const ids: string[] = []
      for (const topic of full.topics) {
        if (topic.questionIds) {
          ids.push(...topic.questionIds)
        }
      }
      map[ch.number] = ids
    }
  }
  return map
}

export default function HomePage() {
  const chapters = getAllChapters()
  const questionIdMap = buildQuestionIdMap(chapters)

  return (
    <main>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'javabypankaj',
          alternateName: ['Java by Pankaj', 'javabypankaj.live'],
          url: 'https://www.javabypankaj.live/',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://www.javabypankaj.live/search#{search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <h1 className={styles.pageTitle}>Interview Topics</h1>
      <ChapterTable chapters={chapters} questionIdMap={questionIdMap} />
    </main>
  )
}
