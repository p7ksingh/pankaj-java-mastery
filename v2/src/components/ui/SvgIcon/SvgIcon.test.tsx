import { render } from '@testing-library/react'
import { SvgIcon } from './SvgIcon'
import type { IconPath } from '@/lib/types/share'

const fillIcon: IconPath = {
  paths: ['M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12'],
  type: 'fill',
}

const strokeIcon: IconPath = {
  paths: ['M10 13a5 5 0 0 0 7.54.54l3-3', 'M14 11a5 5 0 0 0-7.54-.54l-3 3'],
  type: 'stroke',
}

describe('SvgIcon', () => {
  it('renders an svg element', () => {
    const { container } = render(<SvgIcon icon={fillIcon} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('sets correct size', () => {
    const { container } = render(<SvgIcon icon={fillIcon} size={24} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
  })

  it('uses fill for fill-type icons', () => {
    const { container } = render(<SvgIcon icon={fillIcon} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('fill', 'currentColor')
    expect(svg).toHaveAttribute('stroke', 'none')
  })

  it('uses stroke for stroke-type icons', () => {
    const { container } = render(<SvgIcon icon={strokeIcon} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
  })

  it('renders all paths', () => {
    const { container } = render(<SvgIcon icon={strokeIcon} />)
    const paths = container.querySelectorAll('path')
    expect(paths).toHaveLength(2)
  })

  it('is hidden from screen readers', () => {
    const { container } = render(<SvgIcon icon={fillIcon} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})
