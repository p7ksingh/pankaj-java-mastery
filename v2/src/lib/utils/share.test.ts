import { buildSocialProfiles } from './share'

describe('buildSocialProfiles', () => {
  it('builds profiles from a social record', () => {
    const profiles = buildSocialProfiles({
      linkedin: 'https://linkedin.com/in/test',
      github: 'https://github.com/test',
    })

    expect(profiles).toHaveLength(2)
    expect(profiles[0].id).toBe('linkedin')
    expect(profiles[0].label).toBe('LinkedIn')
    expect(profiles[0].url).toBe('https://linkedin.com/in/test')
    expect(profiles[1].id).toBe('github')
    expect(profiles[1].label).toBe('GitHub')
  })

  it('filters out undefined values', () => {
    const profiles = buildSocialProfiles({
      linkedin: 'https://linkedin.com/in/test',
      github: undefined,
    })

    expect(profiles).toHaveLength(1)
    expect(profiles[0].id).toBe('linkedin')
  })

  it('filters out empty strings', () => {
    const profiles = buildSocialProfiles({
      linkedin: '',
      github: 'https://github.com/test',
    })

    expect(profiles).toHaveLength(1)
    expect(profiles[0].id).toBe('github')
  })

  it('returns empty array for empty input', () => {
    expect(buildSocialProfiles({})).toEqual([])
  })

  it('uses fallback label for unknown platforms', () => {
    const profiles = buildSocialProfiles({
      mastodon: 'https://mastodon.social/@test',
    })

    expect(profiles).toHaveLength(1)
    expect(profiles[0].id).toBe('mastodon')
    expect(profiles[0].label).toBe('mastodon')
  })

  it('provides icon data for known platforms', () => {
    const profiles = buildSocialProfiles({
      github: 'https://github.com/test',
    })

    expect(profiles[0].icon).toBeDefined()
    expect(profiles[0].icon.paths.length).toBeGreaterThan(0)
    expect(profiles[0].icon.type).toBe('fill')
  })

  it('provides fallback icon for unknown platforms', () => {
    const profiles = buildSocialProfiles({
      mastodon: 'https://mastodon.social/@test',
    })

    expect(profiles[0].icon).toBeDefined()
    expect(profiles[0].icon.type).toBe('stroke')
  })
})
