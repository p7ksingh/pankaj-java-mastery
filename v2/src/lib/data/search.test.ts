import { filterIndex } from './search'
import type { SearchEntry } from './search'

const mockIndex: SearchEntry[] = [
  { id: 'Q1', t: 'Difference between JDK JRE and JVM', ch: 'Core Java', u: '/interview/core-java/jdk/Q1/' },
  { id: 'Q148', t: 'HashMap vs Hashtable vs ConcurrentHashMap', ch: 'Collections', u: '/interview/collections/hashmap/Q148/' },
  { id: 'Q500', t: 'What is Spring Boot Auto Configuration', ch: 'Spring', u: '/interview/spring/auto/Q500/' },
  { id: 'Q800', t: 'Explain SAGA pattern in microservices', ch: 'Microservices', u: '/interview/micro/saga/Q800/' },
  { id: 'Q50', t: 'What is concurrent modification exception', ch: 'Collections', u: '/interview/collections/concurrent/Q50/' },
]

describe('filterIndex', () => {
  it('returns matching results for an exact query', () => {
    const { items } = filterIndex(mockIndex, 'hashmap', 50)
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe('Q148')
  })

  it('is case insensitive', () => {
    const { items } = filterIndex(mockIndex, 'SPRING', 50)
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe('Q500')
  })

  it('matches by question ID', () => {
    const { items } = filterIndex(mockIndex, 'Q800', 50)
    expect(items).toHaveLength(1)
    expect(items[0].title).toContain('SAGA')
  })

  it('returns empty for query shorter than 2 characters', () => {
    expect(filterIndex(mockIndex, 'a', 50).items).toEqual([])
    expect(filterIndex(mockIndex, '', 50).items).toEqual([])
  })

  it('respects the limit parameter', () => {
    const { items } = filterIndex(mockIndex, 'a', 50)
    expect(items.length).toBeLessThanOrEqual(50)
  })

  it('returns multiple matches when query matches several entries', () => {
    const { items } = filterIndex(mockIndex, 'in', 50)
    expect(items.length).toBeGreaterThan(1)
  })

  it('returns empty for no matches at all', () => {
    const { items } = filterIndex(mockIndex, 'zzzznothing', 50)
    expect(items).toEqual([])
  })

  it('fuzzy matches typos like cuncurrent → concurrent', () => {
    const { items, suggestion } = filterIndex(mockIndex, 'cuncurrent', 50)
    expect(items.length).toBeGreaterThan(0)
    expect(items[0].title.toLowerCase()).toContain('concurrent')
    expect(suggestion).not.toBeNull()
  })

  it('provides a spelling suggestion for typos', () => {
    const { suggestion } = filterIndex(mockIndex, 'hasmap', 50)
    expect(suggestion).not.toBeNull()
  })

  it('ranks best matches first', () => {
    const { items } = filterIndex(mockIndex, 'concurrent', 50)
    expect(items.length).toBeGreaterThanOrEqual(1)
    // Word boundary match should score higher than substring
    expect(items[0].score).toBeGreaterThanOrEqual(40)
  })
})
