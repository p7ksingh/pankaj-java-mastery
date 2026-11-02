import { getSectionLabel } from './sections'

describe('getSectionLabel', () => {
  it('returns the mapped label for known keys', () => {
    expect(getSectionLabel('s1_definition')).toBe('Definition')
    expect(getSectionLabel('s2_technical')).toBe('Technical Deep Dive')
    expect(getSectionLabel('s3_banking')).toBe('Banking Example')
    expect(getSectionLabel('s5c_hld')).toBe('High-Level Design')
  })

  it('formats unknown keys by stripping prefix', () => {
    expect(getSectionLabel('s7_custom_section')).toBe('Custom section')
  })

  it('handles keys without prefix', () => {
    expect(getSectionLabel('unknown')).toBe('Unknown')
  })
})
