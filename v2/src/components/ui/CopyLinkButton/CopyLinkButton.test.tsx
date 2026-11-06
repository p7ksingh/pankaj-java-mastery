import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CopyLinkButton } from './CopyLinkButton'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
})

describe('CopyLinkButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with default label', () => {
    render(<CopyLinkButton textToCopy="https://example.com" />)
    expect(screen.getByText('Copy link')).toBeInTheDocument()
  })

  it('renders with custom label', () => {
    render(<CopyLinkButton textToCopy="https://example.com" label="Copy URL" />)
    expect(screen.getByText('Copy URL')).toBeInTheDocument()
  })

  it('copies text to clipboard on click', async () => {
    render(<CopyLinkButton textToCopy="https://example.com" />)
    await userEvent.click(screen.getByRole('button'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com')
  })

  it('shows copied label after click', async () => {
    render(<CopyLinkButton textToCopy="https://example.com" />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Copied!')).toBeInTheDocument()
  })

  it('shows custom copied label', async () => {
    render(<CopyLinkButton textToCopy="https://example.com" copiedLabel="Done!" />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Done!')).toBeInTheDocument()
  })

  it('has correct aria-label', () => {
    render(<CopyLinkButton textToCopy="https://example.com" />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copy link')
  })
})
