import { getAllChapters } from '@/lib/data/chapters'
import { PageHeader } from '@/components/layout/PageHeader'
import { ChapterTable } from '@/components/features/ChapterTable'
import { SubmitForm, CommunityList } from '@/components/features/Community'
import { StructuredData } from '@/components/seo/StructuredData'

export default function HomePage() {
  const chapters = getAllChapters()
  const totalQuestions = chapters.reduce((sum, c) => sum + c.questionCount, 0)

  return (
    <main>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'javabypankaj',
          alternateName: ['Java by Pankaj', 'Java Interview Mastery'],
          url: 'https://www.javabypankaj.live/',
        }}
      />
      <PageHeader
        title="Interview Topics"
        stats={[
          { label: 'Questions', value: totalQuestions.toLocaleString() },
          { label: 'Chapters', value: chapters.length },
        ]}
      />
      <ChapterTable chapters={chapters} />
      <SubmitForm />
      <CommunityList />
    </main>
  )
}
