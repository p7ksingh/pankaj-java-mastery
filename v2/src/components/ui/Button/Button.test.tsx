import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn()
    render(
      <Button onClick={handleClick} disabled>
        Go
      </Button>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies the primary variant class by default', () => {
    render(<Button>Go</Button>)
    expect(screen.getByRole('button')).toHaveClass('primary')
  })

  it('applies the outline variant class', () => {
    render(<Button variant="outline">Back</Button>)
    expect(screen.getByRole('button')).toHaveClass('outline')
  })

  it('applies the icon variant class', () => {
    render(<Button variant="icon">X</Button>)
    expect(screen.getByRole('button')).toHaveClass('icon')
  })

  it('applies the small size class', () => {
    render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('sm')
  })

  it('renders as disabled with aria-disabled', () => {
    render(<Button disabled>No</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
  })

  it('forwards additional className', () => {
    render(<Button className="extra">Go</Button>)
    expect(screen.getByRole('button')).toHaveClass('extra')
  })

  it('renders with type submit when specified', () => {
    render(<Button type="submit">Send</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})
