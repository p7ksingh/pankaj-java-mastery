import { getAllChapters } from '@/lib/data/chapters'
import { PageHeader } from '@/components/layout/PageHeader'
import { ChapterTable } from '@/components/features/ChapterTable'
import { StructuredData } from '@/components/seo/StructuredData'

export default function HomePage() {
  const chapters = getAllChapters()

  return (
    <main>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'javabypankaj',
          alternateName: ['Java by Pankaj', 'Java Interview Mastery'],
          url: 'https://www.javabypankaj.live/',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://www.javabypankaj.live/search#{search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <PageHeader title="Interview Topics" />
      <ChapterTable chapters={chapters} />
    </main>
  )
}
