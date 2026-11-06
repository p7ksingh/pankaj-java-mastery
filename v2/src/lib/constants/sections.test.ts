import { getSectionLabel } from './sections'

describe('getSectionLabel', () => {
  it('returns the mapped label for known keys', () => {
    expect(getSectionLabel('s1_definition')).toBe('Definition')
    expect(getSectionLabel('s2_technical')).toBe('Technical Deep Dive')
    expect(getSectionLabel('s2_why')).toBe('Why This Matters')
    expect(getSectionLabel('s3_banking')).toBe('Real-World Example')
    expect(getSectionLabel('s3_answer')).toBe('The Answer')
    expect(getSectionLabel('s5c_hld')).toBe('High-Level Design')
    expect(getSectionLabel('s6_takeaway')).toBe('Key Takeaway')
    expect(getSectionLabel('s7_takeaway')).toBe('Key Takeaway')
  })

  it('formats unknown keys by stripping prefix', () => {
    expect(getSectionLabel('s7_custom_section')).toBe('Custom section')
  })

  it('handles keys without prefix', () => {
    expect(getSectionLabel('unknown')).toBe('Unknown')
  })
})
