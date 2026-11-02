/**
 * Generates a search index JSON file from all question data.
 * Output: public/search-index.json
 *
 * Run: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/build-search-index.ts
 * Also called during build via npm run prebuild.
 */

import * as fs from 'fs'
import * as path from 'path'

const DATA_DIR = path.resolve(__dirname, '../data/interview')
const OUT_FILE = path.resolve(__dirname, '../public/search-index.json')

interface SearchEntry {
  id: string
  t: string
  ch: string
  u: string
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
        entries.push({
          id: q.id,
          t: q.shortTitle || q.title,
          ch: ch.title,
          u: `/interview/${ch.slug}/${topic.slug}/${q.id}/`,
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
