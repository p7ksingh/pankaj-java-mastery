import { render, screen } from '@testing-library/react'
import { Pill } from './Pill'

describe('Pill', () => {
  it('renders its text content', () => {
    render(<Pill>76 topics</Pill>)
    expect(screen.getByText('76 topics')).toBeInTheDocument()
  })

  it('applies default variant class', () => {
    const { container } = render(<Pill>text</Pill>)
    expect(container.firstChild).toHaveClass('default')
  })

  it('applies info variant', () => {
    const { container } = render(<Pill variant="info">info</Pill>)
    expect(container.firstChild).toHaveClass('info')
  })

  it('applies success variant', () => {
    const { container } = render(<Pill variant="success">done</Pill>)
    expect(container.firstChild).toHaveClass('success')
  })

  it('applies warning variant', () => {
    const { container } = render(<Pill variant="warning">pending</Pill>)
    expect(container.firstChild).toHaveClass('warning')
  })

  it('applies muted variant', () => {
    const { container } = render(<Pill variant="muted">Not Started</Pill>)
    expect(container.firstChild).toHaveClass('muted')
  })
})
