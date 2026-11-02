import { getAllChapters } from '@/lib/data/chapters'
import { PageHeader } from '@/components/layout/PageHeader'
import { ChapterTable } from '@/components/features/ChapterTable'
import { SubmitForm, CommunityList } from '@/components/features/Community'

export default function HomePage() {
  const chapters = getAllChapters()
  const totalQuestions = chapters.reduce((sum, c) => sum + c.questionCount, 0)

  return (
    <main>
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
