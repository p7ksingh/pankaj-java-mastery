import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Hello</Card>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('wraps content in a styled container', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.firstChild).toHaveClass('card')
  })

  it('forwards additional className', () => {
    const { container } = render(<Card className="extra">Text</Card>)
    expect(container.firstChild).toHaveClass('extra')
  })

  it('renders nested elements', () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Body</p>
      </Card>,
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })
})
