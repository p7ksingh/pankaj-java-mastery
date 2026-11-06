import { render, screen } from '@testing-library/react'
import { ChapterTable } from './ChapterTable'
import type { ChapterSummary } from '@/types'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// Mock useUserProgress
jest.mock('@/hooks/useUserProgress', () => ({
  useUserProgress: () => ({
    getTopicProgress: () => ({ completed: 0, total: 0, percentage: 0, isComplete: false, likeCount: 0 }),
  }),
}))

const mockChapters: ChapterSummary[] = [
  { number: 1, slug: 'core-java', title: 'Core Java', topicCount: 76, questionCount: 155 },
  { number: 2, slug: 'oop', title: 'OOP', topicCount: 21, questionCount: 32 },
]

describe('ChapterTable', () => {
  it('renders table headers', () => {
    render(<ChapterTable chapters={mockChapters} questionIdMap={{}} />)
    expect(screen.getByText('#')).toBeInTheDocument()
    expect(screen.getByText('Chapter')).toBeInTheDocument()
    expect(screen.getByText('Topics')).toBeInTheDocument()
    expect(screen.getByText('Questions')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders a row for each chapter', () => {
    render(<ChapterTable chapters={mockChapters} questionIdMap={{}} />)
    expect(screen.getByText('Core Java')).toBeInTheDocument()
    expect(screen.getByText('OOP')).toBeInTheDocument()
  })

  it('renders chapter numbers padded to two digits', () => {
    render(<ChapterTable chapters={mockChapters} questionIdMap={{}} />)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
  })

  it('renders topic counts', () => {
    render(<ChapterTable chapters={mockChapters} questionIdMap={{}} />)
    expect(screen.getByText('76 topics')).toBeInTheDocument()
    expect(screen.getByText('21 topics')).toBeInTheDocument()
  })

  it('renders question counts', () => {
    render(<ChapterTable chapters={mockChapters} questionIdMap={{}} />)
    expect(screen.getByText('155')).toBeInTheDocument()
    expect(screen.getByText('32')).toBeInTheDocument()
  })

  it('renders chapter links pointing to the correct URL', () => {
    render(<ChapterTable chapters={mockChapters} questionIdMap={{}} />)
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs.some((h) => h?.includes('/interview/core-java'))).toBe(true)
    expect(hrefs.some((h) => h?.includes('/interview/oop'))).toBe(true)
  })

  it('renders like counts for each chapter', () => {
    render(<ChapterTable chapters={mockChapters} questionIdMap={{}} />)
    const likes = screen.getAllByTitle(/liked|No likes/)
    expect(likes.length).toBe(2)
  })

  it('renders progress bars for each chapter', () => {
    render(<ChapterTable chapters={mockChapters} questionIdMap={{}} />)
    const bars = screen.getAllByTitle('Not Started')
    expect(bars.length).toBe(2)
  })

  it('renders an empty table without crashing', () => {
    render(<ChapterTable chapters={[]} questionIdMap={{}} />)
    expect(screen.getByText('#')).toBeInTheDocument()
  })
})
