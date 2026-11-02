import { generateSlug } from './slug'

describe('generateSlug', () => {
  it('converts a simple title to lowercase with hyphens', () => {
    expect(generateSlug('Core Java')).toBe('core-java')
  })

  it('removes special characters', () => {
    expect(generateSlug('What is == and .equals?')).toBe('what-is-and-equals')
  })

  it('collapses multiple hyphens into one', () => {
    expect(generateSlug('HashMap --- internal working')).toBe('hashmap-internal-working')
  })

  it('trims leading and trailing hyphens', () => {
    expect(generateSlug('--leading and trailing--')).toBe('leading-and-trailing')
  })

  it('handles empty string', () => {
    expect(generateSlug('')).toBe('')
  })

  it('handles null-like input', () => {
    expect(generateSlug(undefined as unknown as string)).toBe('')
    expect(generateSlug(null as unknown as string)).toBe('')
  })

  it('handles long titles', () => {
    const long = 'What is the difference between the JDK the JRE and the JVM and who needs which one'
    const expected = 'what-is-the-difference-between-the-jdk-the-jre-and-the-jvm-and-who-needs-which-one'
    expect(generateSlug(long)).toBe(expected)
  })

  it('handles titles with numbers', () => {
    expect(generateSlug('Java 8 Functional')).toBe('java-8-functional')
  })

  it('strips HTML-like characters', () => {
    expect(generateSlug('<script>alert(1)</script>')).toBe('scriptalert1script')
  })

  it('handles unicode dashes and special spaces', () => {
    expect(generateSlug('HashMap vs ConcurrentHashMap differences')).toBe(
      'hashmap-vs-concurrenthashmap-differences',
    )
  })
})
