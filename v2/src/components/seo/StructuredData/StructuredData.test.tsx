import { render } from '@testing-library/react'
import { StructuredData } from './StructuredData'

describe('StructuredData', () => {
  it('renders a script tag with type application/ld+json', () => {
    const { container } = render(
      <StructuredData data={{ '@context': 'https://schema.org', '@type': 'WebSite' }} />,
    )
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
  })

  it('contains the serialized JSON data', () => {
    const data = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'javabypankaj' }
    const { container } = render(<StructuredData data={data} />)
    const script = container.querySelector('script')
    expect(script?.textContent).toContain('"name":"javabypankaj"')
  })

  it('renders valid JSON', () => {
    const data = { '@type': 'FAQPage', mainEntity: [{ name: 'Q1' }] }
    const { container } = render(<StructuredData data={data} />)
    const script = container.querySelector('script')
    expect(() => JSON.parse(script?.textContent || '')).not.toThrow()
  })
})
