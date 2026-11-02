import { filterIndex } from './search'
import type { SearchEntry } from './search'

const mockIndex: SearchEntry[] = [
  { id: 'Q1', t: 'Difference between JDK JRE and JVM', ch: 'Core Java', u: '/interview/core-java/jdk/Q1/' },
  { id: 'Q148', t: 'HashMap vs Hashtable vs ConcurrentHashMap', ch: 'Collections', u: '/interview/collections/hashmap/Q148/' },
  { id: 'Q500', t: 'What is Spring Boot Auto Configuration', ch: 'Spring', u: '/interview/spring/auto/Q500/' },
  { id: 'Q800', t: 'Explain SAGA pattern in microservices', ch: 'Microservices', u: '/interview/micro/saga/Q800/' },
]

describe('filterIndex', () => {
  it('returns matching results for a query', () => {
    const results = filterIndex(mockIndex, 'hashmap', 50)
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('Q148')
  })

  it('is case insensitive', () => {
    const results = filterIndex(mockIndex, 'SPRING', 50)
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('Q500')
  })

  it('matches by question ID', () => {
    const results = filterIndex(mockIndex, 'Q800', 50)
    expect(results).toHaveLength(1)
    expect(results[0].title).toContain('SAGA')
  })

  it('returns empty for query shorter than 2 characters', () => {
    expect(filterIndex(mockIndex, 'a', 50)).toEqual([])
    expect(filterIndex(mockIndex, '', 50)).toEqual([])
  })

  it('respects the limit parameter', () => {
    const results = filterIndex(mockIndex, 'a', 50)
    expect(results.length).toBeLessThanOrEqual(50)
  })

  it('returns multiple matches when query matches several entries', () => {
    const results = filterIndex(mockIndex, 'in', 50)
    expect(results.length).toBeGreaterThan(1)
  })

  it('returns empty for no matches', () => {
    expect(filterIndex(mockIndex, 'zzzznothing', 50)).toEqual([])
  })
})
