import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookmarkButton } from './BookmarkButton'

describe('BookmarkButton', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders as not bookmarked by default', () => {
    render(<BookmarkButton questionId="Q1" />)
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('toggles bookmark state on click', async () => {
    render(<BookmarkButton questionId="Q1" />)
    const btn = screen.getByRole('button')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'true')
  })

  it('toggles back on second click', async () => {
    render(<BookmarkButton questionId="Q1" />)
    const btn = screen.getByRole('button')
    await userEvent.click(btn)
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })
})
