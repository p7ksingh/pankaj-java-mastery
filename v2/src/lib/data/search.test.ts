import { filterIndex } from './search'
import type { SearchEntry } from './search'

const mockIndex: SearchEntry[] = [
  { id: 'Q1', t: 'Difference between JDK JRE and JVM', ch: 'Core Java', tp: 'JDK JRE JVM', u: '/interview/core-java/jdk/Q1/', k: 'java development compilation bytecode runtime environment virtual machine platform', kp: 'jdk includes compiler jre includes jvm' },
  { id: 'Q148', t: 'HashMap vs Hashtable vs ConcurrentHashMap', ch: 'Collections', tp: 'HashMap Internals', u: '/interview/collections/hashmap/Q148/', k: 'hashing bucket collision thread safety synchronization concurrent', kp: 'hashmap not thread safe hashtable synchronized concurrenthashmap segments' },
  { id: 'Q500', t: 'What is Spring Boot Auto Configuration', ch: 'Spring', tp: 'Auto Config', u: '/interview/spring/auto/Q500/', k: 'spring boot autoconfigure conditional annotation starter dependency injection', kp: 'auto configuration scans classpath creates beans automatically' },
  { id: 'Q800', t: 'Explain SAGA pattern in microservices', ch: 'Microservices', tp: 'Patterns', u: '/interview/micro/saga/Q800/', k: 'saga orchestration choreography distributed transaction compensation rollback eventual consistency', kp: 'saga manages distributed transactions across services' },
  { id: 'Q50', t: 'What is concurrent modification exception', ch: 'Collections', tp: 'Iterator', u: '/interview/collections/concurrent/Q50/', k: 'iterator fail-fast comodification structural modification arraylist', kp: 'thrown when collection modified during iteration' },
]

describe('filterIndex', () => {
  it('returns matching results for title match', () => {
    const { items } = filterIndex(mockIndex, 'hashmap', 50)
    expect(items.length).toBeGreaterThanOrEqual(1)
    expect(items[0].id).toBe('Q148')
  })

  it('is case insensitive', () => {
    const { items } = filterIndex(mockIndex, 'SPRING', 50)
    expect(items.length).toBeGreaterThanOrEqual(1)
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

  it('searches through keywords (full content)', () => {
    // "bytecode" only appears in keywords, not title
    const { items } = filterIndex(mockIndex, 'bytecode', 50)
    expect(items.length).toBeGreaterThanOrEqual(1)
    expect(items[0].id).toBe('Q1')
  })

  it('searches through key points', () => {
    // "classpath" only appears in key points
    const { items } = filterIndex(mockIndex, 'classpath', 50)
    expect(items.length).toBeGreaterThanOrEqual(1)
    expect(items[0].id).toBe('Q500')
  })

  it('searches through topic name', () => {
    const { items } = filterIndex(mockIndex, 'Iterator', 50)
    expect(items.length).toBeGreaterThanOrEqual(1)
  })

  it('ranks title matches higher than keyword matches', () => {
    // "concurrent" appears in title of Q50 and in keywords of Q148
    const { items } = filterIndex(mockIndex, 'concurrent', 50)
    expect(items.length).toBeGreaterThanOrEqual(1)
    // Title match should be ranked first
    expect(items[0].score).toBeGreaterThanOrEqual(50)
  })

  it('multi-word query matches across keywords', () => {
    const { items } = filterIndex(mockIndex, 'distributed transaction', 50)
    expect(items.length).toBeGreaterThanOrEqual(1)
    expect(items[0].id).toBe('Q800')
  })

  it('fuzzy matches typos', () => {
    const { items, suggestion } = filterIndex(mockIndex, 'cuncurrent', 50)
    expect(items.length).toBeGreaterThan(0)
    expect(suggestion).not.toBeNull()
  })

  it('returns empty for no matches at all', () => {
    const { items } = filterIndex(mockIndex, 'xqzwvbnm', 50)
    expect(items).toEqual([])
  })
})
