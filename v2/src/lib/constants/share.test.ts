import { SHARE_PLATFORMS, SOCIAL_ICONS, COPY_LINK_ICON } from './share'

describe('SHARE_PLATFORMS', () => {
  it('contains all expected platforms', () => {
    const ids = SHARE_PLATFORMS.map((p) => p.id)
    expect(ids).toEqual(['linkedin', 'x', 'whatsapp', 'telegram', 'email'])
  })

  it('each platform has a label', () => {
    for (const platform of SHARE_PLATFORMS) {
      expect(platform.label).toBeTruthy()
    }
  })

  it('each platform has icon paths', () => {
    for (const platform of SHARE_PLATFORMS) {
      expect(platform.icon.paths.length).toBeGreaterThan(0)
      expect(['fill', 'stroke']).toContain(platform.icon.type)
    }
  })

  it('each platform buildUrl returns a valid URL string', () => {
    const testUrl = 'https://example.com/test'
    for (const platform of SHARE_PLATFORMS) {
      const result = platform.buildUrl(testUrl, 'Test Title')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    }
  })

  describe('buildUrl correctness', () => {
    const url = 'https://www.javabypankaj.live/interview/core-java'

    it('linkedin builds correct share URL', () => {
      const result = SHARE_PLATFORMS[0].buildUrl(url)
      expect(result).toContain('linkedin.com/sharing/share-offsite')
      expect(result).toContain(encodeURIComponent(url))
    })

    it('x/twitter includes text when title provided', () => {
      const result = SHARE_PLATFORMS[1].buildUrl(url, 'Java Interview')
      expect(result).toContain('twitter.com/intent/tweet')
      expect(result).toContain('text=')
    })

    it('whatsapp combines title and url', () => {
      const result = SHARE_PLATFORMS[2].buildUrl(url, 'Check this out')
      expect(result).toContain('wa.me')
      expect(result).toContain(encodeURIComponent('Check this out'))
    })

    it('telegram builds correct share URL', () => {
      const result = SHARE_PLATFORMS[3].buildUrl(url, 'Java')
      expect(result).toContain('t.me/share/url')
      expect(result).toContain('text=')
    })

    it('email builds mailto with subject and body', () => {
      const result = SHARE_PLATFORMS[4].buildUrl(url, 'Java Interview')
      expect(result).toContain('mailto:')
      expect(result).toContain('subject=')
      expect(result).toContain('body=')
    })
  })
})

describe('SOCIAL_ICONS', () => {
  it('contains linkedin and github icons', () => {
    expect(SOCIAL_ICONS.get('linkedin')).toBeDefined()
    expect(SOCIAL_ICONS.get('github')).toBeDefined()
  })

  it('returns undefined for unknown platforms', () => {
    expect(SOCIAL_ICONS.get('mastodon')).toBeUndefined()
  })
})

describe('COPY_LINK_ICON', () => {
  it('has stroke type for the link icon', () => {
    expect(COPY_LINK_ICON.type).toBe('stroke')
    expect(COPY_LINK_ICON.paths.length).toBe(2)
  })
})
