import { render, screen } from '@testing-library/react'
import { QuestionCardInteractive } from './QuestionCardInteractive'

let mockLiked = false
const mockToggleLike = jest.fn()

jest.mock('@/hooks/useLikes', () => ({
  useLikes: () => ({
    isLiked: () => mockLiked,
    toggle: mockToggleLike,
  }),
}))

describe('QuestionCardInteractive', () => {
  beforeEach(() => {
    mockLiked = false
    mockToggleLike.mockClear()
  })

  it('renders a like button', () => {
    render(<QuestionCardInteractive questionId="Q1" />)
    expect(screen.getByLabelText(/like this question/i)).toBeInTheDocument()
  })

  it('does not render a completion button', () => {
    render(<QuestionCardInteractive questionId="Q1" />)
    expect(screen.queryByTitle('Mark complete')).not.toBeInTheDocument()
    expect(screen.queryByTitle('Completed')).not.toBeInTheDocument()
  })
})
