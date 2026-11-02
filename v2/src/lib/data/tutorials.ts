import * as fs from 'fs'
import * as path from 'path'

const LEARN_DIR = path.resolve(process.cwd(), 'data/learn/design-patterns')

interface PatternSummary {
  slug: string
  title: string
  subcategory: string
  difficulty: string
  readingTimeMinutes: number
  sectionCount: number
  order: number
}

interface PatternMeta {
  category: string
  title: string
  description: string
  totalPatterns: number
  patterns: PatternSummary[]
}

interface PatternSection {
  id: string
  title: string
  html: string
}

interface PatternFull {
  slug: string
  title: string
  category: string
  subcategory: string
  difficulty: string
  readingTimeMinutes: number
  sections: PatternSection[]
  sectionCount: number
}

/** Returns all design pattern summaries sorted by order. */
export function getAllPatterns(): PatternSummary[] {
  const metaPath = path.join(LEARN_DIR, '_meta.json')
  const raw = fs.readFileSync(metaPath, 'utf-8')
  const meta: PatternMeta = JSON.parse(raw)
  return meta.patterns.sort((a, b) => a.order - b.order)
}

/** Returns the category metadata. */
export function getPatternsMeta(): PatternMeta {
  const metaPath = path.join(LEARN_DIR, '_meta.json')
  return JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
}

/** Returns a full pattern by slug. Returns null if not found. */
export function getPatternBySlug(slug: string): PatternFull | null {
  const filePath = path.join(LEARN_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) {
    return null
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}
