/** Client-side search over the pre-built index with fuzzy matching. */

export interface SearchEntry {
  id: string
  t: string
  ch: string
  u: string
}

export interface SearchResultItem {
  id: string
  title: string
  chapter: string
  url: string
  score: number
}

export interface SearchResult {
  items: SearchResultItem[]
  suggestion: string | null
}

let cachedIndex: SearchEntry[] | null = null

/** Loads the search index from the public folder. Caches after first load. */
export async function loadSearchIndex(): Promise<SearchEntry[]> {
  if (cachedIndex) {
    return cachedIndex
  }
  const response = await fetch('/search-index.json')
  cachedIndex = await response.json()
  return cachedIndex!
}

/**
 * Searches the index with relevance ranking and fuzzy fallback.
 * 1. Exact/substring match first (fast, precise)
 * 2. If no results → fuzzy bigram match (handles typos)
 * Returns items sorted best-match-first + optional spelling suggestion.
 */
export function filterIndex(index: SearchEntry[], query: string, limit: number): SearchResult {
  if (!query || query.length < 2) {
    return { items: [], suggestion: null }
  }

  const lower = query.toLowerCase()

  // --- Pass 1: Exact / substring matching ---
  const exact = exactMatch(index, lower, limit)
  if (exact.length > 0) {
    return { items: exact, suggestion: null }
  }

  // --- Pass 2: Fuzzy matching (typo tolerance) ---
  return fuzzyMatch(index, lower, limit)
}

/** Exact and substring matching with relevance scoring. */
function exactMatch(index: SearchEntry[], lower: string, limit: number): SearchResultItem[] {
  const results: SearchResultItem[] = []

  for (const entry of index) {
    const titleLower = entry.t.toLowerCase()
    const idLower = entry.id.toLowerCase()
    let score = 0

    if (titleLower === lower) {
      score = 100
    } else if (titleLower.startsWith(lower)) {
      score = 80
    } else if (idLower === lower) {
      score = 75
    } else if (new RegExp(`\\b${escapeRegex(lower)}\\b`).test(titleLower)) {
      score = 60
    } else if (titleLower.includes(lower)) {
      score = 40
    } else if (idLower.includes(lower)) {
      score = 20
    }

    if (score > 0) {
      results.push({ id: entry.id, title: entry.t, chapter: entry.ch, url: entry.u, score })
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, limit)
}

/** Fuzzy matching using bigram similarity — handles typos like "cuncurrent" → "concurrent". */
function fuzzyMatch(index: SearchEntry[], lower: string, limit: number): SearchResult {
  const queryWords = lower.split(/\s+/).filter((w) => w.length >= 2)
  if (queryWords.length === 0) {
    return { items: [], suggestion: null }
  }

  const scored: SearchResultItem[] = []
  let bestTitle = ''
  let bestScore = 0

  for (const entry of index) {
    const titleLower = entry.t.toLowerCase()
    const titleWords = titleLower.split(/[\s,?!.()[\]{}:;/\\-]+/).filter((w) => w.length >= 2)

    // For each query word, find the best matching title word
    let totalSim = 0
    for (const qw of queryWords) {
      let bestWordSim = 0
      for (const tw of titleWords) {
        const sim = bigramSimilarity(qw, tw)
        if (sim > bestWordSim) {
          bestWordSim = sim
        }
      }
      totalSim += bestWordSim
    }

    const avgSim = totalSim / queryWords.length

    // Threshold: at least 40% bigram similarity on average
    if (avgSim >= 0.4) {
      const score = Math.round(avgSim * 100)
      scored.push({ id: entry.id, title: entry.t, chapter: entry.ch, url: entry.u, score })
      if (score > bestScore) {
        bestScore = score
        bestTitle = entry.t
      }
    }
  }

  scored.sort((a, b) => b.score - a.score)
  const items = scored.slice(0, limit)

  // Build suggestion from the best matching title's words
  let suggestion: string | null = null
  if (items.length > 0 && bestTitle) {
    suggestion = buildSuggestion(queryWords, bestTitle)
  }

  return { items, suggestion }
}

/**
 * Bigram similarity (Dice coefficient).
 * "cuncurrent" vs "concurrent" → ~0.78 (high match despite typo)
 */
function bigramSimilarity(a: string, b: string): number {
  if (a.length < 2 || b.length < 2) {
    return 0
  }
  const setA = new Set<string>()
  const setB = new Set<string>()
  for (let i = 0; i < a.length - 1; i++) {
    setA.add(a.slice(i, i + 2))
  }
  for (let i = 0; i < b.length - 1; i++) {
    setB.add(b.slice(i, i + 2))
  }
  let matches = 0
  for (const bg of setA) {
    if (setB.has(bg)) {
      matches++
    }
  }
  return (2 * matches) / (setA.size + setB.size)
}

/** Builds a "Did you mean: concurrent" suggestion from the best matching title. */
function buildSuggestion(queryWords: string[], bestTitle: string): string | null {
  const titleWords = bestTitle.toLowerCase().split(/[\s,?!.()[\]{}:;/\\-]+/).filter((w) => w.length >= 2)
  const corrected: string[] = []

  for (const qw of queryWords) {
    let bestWord = qw
    let bestSim = 0
    for (const tw of titleWords) {
      const sim = bigramSimilarity(qw, tw)
      if (sim > bestSim) {
        bestSim = sim
        bestWord = tw
      }
    }
    corrected.push(bestWord)
  }

  const suggestion = corrected.join(' ')
  // Only suggest if it's actually different from the query
  if (suggestion !== queryWords.join(' ')) {
    return suggestion
  }
  return null
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
