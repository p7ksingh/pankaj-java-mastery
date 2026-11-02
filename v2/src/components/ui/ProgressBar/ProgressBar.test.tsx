import { render } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('renders with the correct width percentage', () => {
    const { container } = render(<ProgressBar value={45} />)
    const fill = container.querySelector('[class*="fill"]')
    expect(fill).toHaveStyle({ width: '45%' })
  })

  it('clamps value at 0 for negative input', () => {
    const { container } = render(<ProgressBar value={-10} />)
    const fill = container.querySelector('[class*="fill"]')
    expect(fill).toHaveStyle({ width: '0%' })
  })

  it('clamps value at 100 for input above 100', () => {
    const { container } = render(<ProgressBar value={150} />)
    const fill = container.querySelector('[class*="fill"]')
    expect(fill).toHaveStyle({ width: '100%' })
  })

  it('renders at 0% by default', () => {
    const { container } = render(<ProgressBar value={0} />)
    const fill = container.querySelector('[class*="fill"]')
    expect(fill).toHaveStyle({ width: '0%' })
  })

  it('renders at 100% for completed', () => {
    const { container } = render(<ProgressBar value={100} />)
    const fill = container.querySelector('[class*="fill"]')
    expect(fill).toHaveStyle({ width: '100%' })
  })

  it('has accessible role progressbar', () => {
    const { container } = render(<ProgressBar value={50} />)
    const bar = container.querySelector('[role="progressbar"]')
    expect(bar).toBeInTheDocument()
    expect(bar).toHaveAttribute('aria-valuenow', '50')
  })
})
