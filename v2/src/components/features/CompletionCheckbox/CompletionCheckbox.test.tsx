import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CompletionCheckbox } from './CompletionCheckbox'

describe('CompletionCheckbox', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders unchecked by default', () => {
    render(<CompletionCheckbox questionId="Q1" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('shows label text', () => {
    render(<CompletionCheckbox questionId="Q1" />)
    expect(screen.getByText('Mark as completed')).toBeInTheDocument()
  })

  it('toggles checked state on click', async () => {
    render(<CompletionCheckbox questionId="Q1" />)
    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('toggles back on second click', async () => {
    render(<CompletionCheckbox questionId="Q1" />)
    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)
    await userEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })
})
