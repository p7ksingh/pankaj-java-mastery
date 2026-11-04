/**
 * Generates a search index JSON from all question data.
 * Includes keywords from ALL content (definitions, code, explanations, takeaways).
 * Output: public/search-index.json
 */

import * as fs from 'fs'
import * as path from 'path'

const DATA_DIR = path.resolve(__dirname, '../data/interview')
const OUT_FILE = path.resolve(__dirname, '../public/search-index.json')

// Common stop words to exclude
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her',
  'was', 'one', 'our', 'out', 'has', 'have', 'been', 'this', 'that', 'with',
  'they', 'from', 'what', 'when', 'where', 'which', 'will', 'would', 'could',
  'should', 'there', 'their', 'about', 'each', 'make', 'like', 'into', 'than',
  'then', 'them', 'these', 'some', 'other', 'also', 'just', 'more', 'very',
  'does', 'here', 'both', 'only', 'most', 'same', 'such', 'because', 'between',
  'through', 'before', 'after', 'while', 'being', 'every', 'those', 'over',
  'used', 'using', 'uses', 'example', 'first', 'second', 'method', 'class',
  'object', 'value', 'type', 'code', 'data', 'case', 'time', 'call', 'true',
  'false', 'null', 'void', 'return', 'public', 'private', 'static', 'final',
  'new', 'import', 'package', 'string', 'system', 'println',
])

interface SearchEntry {
  id: string
  t: string   // title
  ch: string  // chapter
  tp: string  // topic
  u: string   // url
  k: string   // keywords from all content
  kp: string  // key points
}

/** Extract meaningful keywords from text */
function extractKeywords(text: string, maxWords: number): string {
  if (!text) { return '' }

  // Remove code blocks, HTML tags, special chars
  const clean = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^\w\s-]/g, ' ')
    .toLowerCase()

  const words = clean.split(/\s+/)
  const unique = new Set<string>()

  for (const word of words) {
    if (word.length >= 4 && !STOP_WORDS.has(word) && !/^\d+$/.test(word)) {
      unique.add(word)
    }
  }

  return Array.from(unique).slice(0, maxWords).join(' ')
}

/** Extract all text from a question's sections */
function extractAllText(sections: Record<string, unknown>): string {
  const texts: string[] = []

  for (const value of Object.values(sections)) {
    if (typeof value === 'string') {
      texts.push(value)
    } else if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>
      for (const v of Object.values(obj)) {
        if (typeof v === 'string') {
          texts.push(v)
        }
      }
    }
  }

  return texts.join(' ')
}

function run(): void {
  const chaptersFile = path.join(DATA_DIR, 'chapters.json')
  const chapters = JSON.parse(fs.readFileSync(chaptersFile, 'utf-8')).chapters

  const entries: SearchEntry[] = []

  for (const ch of chapters) {
    const chPad = String(ch.number).padStart(2, '0')
    const metaFile = path.join(DATA_DIR, `ch${chPad}`, 'meta.json')

    if (!fs.existsSync(metaFile)) {
      continue
    }

    const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'))

    for (const topic of meta.topics) {
      const topicDir = path.join(DATA_DIR, `ch${chPad}`, 'topics', topic.slug)

      if (!fs.existsSync(topicDir)) {
        continue
      }

      const files = fs.readdirSync(topicDir).filter((f: string) => f.endsWith('.json'))

      for (const file of files) {
        const q = JSON.parse(fs.readFileSync(path.join(topicDir, file), 'utf-8'))

        // Extract keywords from all content sections
        const allText = extractAllText(q.sections || {})
        const keywords = extractKeywords(allText, 80)

        // Key points as searchable text
        const keyPoints = (q.keyPoints || []).join(' ').toLowerCase()

        entries.push({
          id: q.id,
          t: q.shortTitle || q.title,
          ch: ch.title,
          tp: topic.title,
          u: `/interview/${ch.slug}/${topic.slug}/${q.id}/`,
          k: keywords,
          kp: keyPoints,
        })
      }
    }
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, JSON.stringify(entries))

  const sizeKb = Math.round(fs.statSync(OUT_FILE).size / 1024)
  console.log(`Search index: ${entries.length} entries, ${sizeKb} KB`)
}

run()
