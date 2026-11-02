import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShareButton } from './ShareButton'

describe('ShareButton', () => {
  it('renders the share button', () => {
    render(<ShareButton url="/interview/core-java/jdk/Q1/" title="JDK vs JRE" />)
    expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument()
  })

  it('shows menu on click', async () => {
    render(<ShareButton url="/test/" title="Test" />)
    await userEvent.click(screen.getByRole('button', { name: 'Share' }))
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('X')).toBeInTheDocument()
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
    expect(screen.getByText('Copy Link')).toBeInTheDocument()
  })

  it('hides menu initially', () => {
    render(<ShareButton url="/test/" title="Test" />)
    expect(screen.queryByText('LinkedIn')).not.toBeInTheDocument()
  })

  it('share links contain the encoded URL', async () => {
    render(<ShareButton url="/interview/core-java/Q1/" title="Test" />)
    await userEvent.click(screen.getByRole('button', { name: 'Share' }))
    const linkedIn = screen.getByText('LinkedIn').closest('a')
    expect(linkedIn?.href).toContain('linkedin.com')
  })
})
