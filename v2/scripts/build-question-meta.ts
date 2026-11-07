/**
 * Generates a slim question metadata JSON for Library + Popular pages.
 * Only includes: id, title, url, chapter, topic, questionNumber.
 * NO keywords, NO keypoints — that's what makes search-index.json 3.7MB.
 *
 * Output: public/question-meta.json (~635KB vs 3.7MB)
 */

import * as fs from 'fs'
import * as path from 'path'

const DATA_DIR = path.resolve(__dirname, '../data/interview')
const OUT_FILE = path.resolve(__dirname, '../public/question-meta.json')

interface MetaEntry {
  id: string
  t: string   // title (shortTitle)
  u: string   // url
  ch: string  // chapter
  tp: string  // topic
  qn: number  // question number
}

function run(): void {
  const chaptersFile = path.join(DATA_DIR, 'chapters.json')
  const chapters = JSON.parse(fs.readFileSync(chaptersFile, 'utf-8')).chapters
  const entries: MetaEntry[] = []

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
          u: `/interview/${ch.slug}/${topic.slug}/${q.urlSlug || q.id}/`,
          ch: ch.title,
          tp: topic.title,
          qn: q.questionNumber || 0,
        })
      }
    }
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, JSON.stringify(entries))

  const sizeKb = Math.round(fs.statSync(OUT_FILE).size / 1024)
  console.log(`Question meta: ${entries.length} entries, ${sizeKb} KB`)
}

run()
