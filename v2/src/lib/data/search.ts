/** Client-side search over the pre-built index. */

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

/** Searches the index by query. Case-insensitive substring match. */
export function filterIndex(index: SearchEntry[], query: string, limit: number): SearchResultItem[] {
  if (!query || query.length < 2) {
    return []
  }

  const lower = query.toLowerCase()
  const results: SearchResultItem[] = []

  for (const entry of index) {
    if (results.length >= limit) {
      break
    }
    if (entry.t.toLowerCase().includes(lower) || entry.id.toLowerCase().includes(lower)) {
      results.push({
        id: entry.id,
        title: entry.t,
        chapter: entry.ch,
        url: entry.u,
      })
    }
  }

  return results
}
