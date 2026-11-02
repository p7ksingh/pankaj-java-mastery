import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CopyButton } from './CopyButton'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
})

describe('CopyButton', () => {
  it('renders with default label', () => {
    render(<CopyButton text="test" />)
    expect(screen.getByRole('button')).toHaveTextContent('Copy Answer')
  })

  it('renders with custom label', () => {
    render(<CopyButton text="test" label="Copy Code" />)
    expect(screen.getByRole('button')).toHaveTextContent('Copy Code')
  })

  it('copies text to clipboard on click', async () => {
    render(<CopyButton text="Hello World" />)
    await userEvent.click(screen.getByRole('button'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello World')
  })

  it('shows Copied after click', async () => {
    render(<CopyButton text="test" />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveTextContent('Copied')
  })
})
