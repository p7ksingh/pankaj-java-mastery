/** Client-side full-content search with fuzzy matching. */

export interface SearchEntry {
  id: string
  t: string   // title
  ch: string  // chapter
  tp?: string // topic
  u: string   // url
  k?: string  // keywords from all content
  kp?: string // key points
  qn?: number // question number (sequential in topic)
}

export interface SearchResultItem {
  id: string
  title: string
  chapter: string
  topic: string
  url: string
  score: number
  questionNumber: number
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
 * Full-content search with relevance ranking and fuzzy fallback.
 * Searches: title → key points → topic name → keywords (all content) → ID
 * Best matches on top.
 */
export function filterIndex(index: SearchEntry[], query: string, limit: number): SearchResult {
  if (!query || query.length < 2) {
    return { items: [], suggestion: null }
  }

  const lower = query.toLowerCase()
  const queryWords = lower.split(/\s+/).filter((w) => w.length >= 2)

  // --- Pass 1: Score every entry ---
  const scored: SearchResultItem[] = []

  for (const entry of index) {
    const titleLower = entry.t.toLowerCase()
    const idLower = entry.id.toLowerCase()
    const keywordsLower = (entry.k || '').toLowerCase()
    const keyPointsLower = (entry.kp || '').toLowerCase()
    const topicLower = (entry.tp || '').toLowerCase()
    let score = 0

    // Title matches (highest priority)
    if (titleLower === lower) {
      score = 100
    } else if (titleLower.startsWith(lower)) {
      score = 90
    } else if (new RegExp(`\\b${escapeRegex(lower)}\\b`).test(titleLower)) {
      score = 80
    } else if (titleLower.includes(lower)) {
      score = 70
    }

    // ID exact match
    if (idLower === lower) {
      score = Math.max(score, 85)
    }

    // Key points match
    if (score === 0 && keyPointsLower.includes(lower)) {
      score = 55
    }

    // Topic name match
    if (score === 0 && topicLower.includes(lower)) {
      score = 50
    }

    // Full content keywords match
    if (score === 0 && keywordsLower) {
      // Check if ALL query words appear in keywords
      const allWordsMatch = queryWords.every((w) => keywordsLower.includes(w))
      if (allWordsMatch) {
        score = 45
      } else {
        // Check how many query words match
        const matchCount = queryWords.filter((w) => keywordsLower.includes(w)).length
        if (matchCount > 0) {
          score = 20 + Math.round((matchCount / queryWords.length) * 20)
        }
      }
    }

    // Chapter name match (lowest)
    if (score === 0 && entry.ch.toLowerCase().includes(lower)) {
      score = 15
    }

    if (score > 0) {
      scored.push({
        id: entry.id,
        title: entry.t,
        chapter: entry.ch,
        topic: entry.tp || '',
        url: entry.u,
        score,
        questionNumber: entry.qn || 0,
      })
    }
  }

  if (scored.length > 0) {
    scored.sort((a, b) => b.score - a.score)
    return { items: scored.slice(0, limit), suggestion: null }
  }

  // --- Pass 2: Fuzzy matching (typo tolerance) ---
  return fuzzyMatch(index, lower, queryWords, limit)
}

/** Fuzzy matching using bigram similarity */
function fuzzyMatch(index: SearchEntry[], _lower: string, queryWords: string[], limit: number): SearchResult {
  if (queryWords.length === 0) {
    return { items: [], suggestion: null }
  }

  const scored: SearchResultItem[] = []
  let bestTitle = ''
  let bestScore = 0

  for (const entry of index) {
    const titleLower = entry.t.toLowerCase()
    const allText = titleLower + ' ' + (entry.kp || '').toLowerCase() + ' ' + (entry.k || '').toLowerCase()
    const allWords = allText.split(/[\s,?!.()[\]{}:;/\\-]+/).filter((w) => w.length >= 2)

    let totalSim = 0
    for (const qw of queryWords) {
      let bestWordSim = 0
      for (const tw of allWords) {
        const sim = bigramSimilarity(qw, tw)
        if (sim > bestWordSim) {
          bestWordSim = sim
        }
      }
      totalSim += bestWordSim
    }

    const avgSim = totalSim / queryWords.length

    if (avgSim >= 0.4) {
      const score = Math.round(avgSim * 100)
      scored.push({
        id: entry.id,
        title: entry.t,
        chapter: entry.ch,
        topic: entry.tp || '',
        url: entry.u,
        score,
        questionNumber: entry.qn || 0,
      })
      if (score > bestScore) {
        bestScore = score
        bestTitle = entry.t
      }
    }
  }

  scored.sort((a, b) => b.score - a.score)
  const items = scored.slice(0, limit)

  let suggestion: string | null = null
  if (items.length > 0 && bestTitle) {
    suggestion = buildSuggestion(queryWords, bestTitle)
  }

  return { items, suggestion }
}

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
  if (suggestion !== queryWords.join(' ')) {
    return suggestion
  }
  return null
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
