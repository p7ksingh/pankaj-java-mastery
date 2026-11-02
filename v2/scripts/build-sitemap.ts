/**
 * Generates sitemap.xml from all pre-built pages.
 * Output: public/sitemap.xml
 *
 * Run: npx ts-node --skip-project --compiler-options '{"module":"commonjs","esModuleInterop":true}' scripts/build-sitemap.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const DATA_DIR = path.resolve(__dirname, '../data/interview')
const OUT_FILE = path.resolve(__dirname, '../public/sitemap.xml')
const SITE_URL = 'https://www.javabypankaj.live'

interface SitemapEntry {
  url: string
  priority: string
  changefreq: string
}

function run(): void {
  const entries: SitemapEntry[] = []

  // Home page
  entries.push({ url: '/', priority: '1.0', changefreq: 'weekly' })

  // Search page
  entries.push({ url: '/search/', priority: '0.5', changefreq: 'monthly' })

  // Load chapters
  const chaptersFile = path.join(DATA_DIR, 'chapters.json')
  const chapters = JSON.parse(fs.readFileSync(chaptersFile, 'utf-8')).chapters

  for (const ch of chapters) {
    const chPad = String(ch.number).padStart(2, '0')

    // Chapter page
    entries.push({
      url: `/interview/${ch.slug}/`,
      priority: '0.9',
      changefreq: 'weekly',
    })

    // Load topics
    const metaFile = path.join(DATA_DIR, `ch${chPad}`, 'meta.json')
    if (!fs.existsSync(metaFile)) {
      continue
    }

    const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'))

    for (const topic of meta.topics) {
      // Topic page
      entries.push({
        url: `/interview/${ch.slug}/${topic.slug}/`,
        priority: '0.8',
        changefreq: 'monthly',
      })

      // Question pages
      const topicDir = path.join(DATA_DIR, `ch${chPad}`, 'topics', topic.slug)
      if (!fs.existsSync(topicDir)) {
        continue
      }

      const files = fs.readdirSync(topicDir).filter((f: string) => f.endsWith('.json'))
      for (const file of files) {
        const qId = file.replace('.json', '')
        entries.push({
          url: `/interview/${ch.slug}/${topic.slug}/${qId}/`,
          priority: '0.7',
          changefreq: 'monthly',
        })
      }
    }
  }

  // Build XML
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(
      (e) =>
        `  <url><loc>${SITE_URL}${e.url}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
    ),
    '</urlset>',
    '',
  ].join('\n')

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, xml)

  console.log(`Sitemap: ${entries.length} URLs`)
}

run()
