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

  // Community, Library, Popular pages
  entries.push({ url: '/community/', priority: '0.7', changefreq: 'daily' })
  entries.push({ url: '/library/', priority: '0.4', changefreq: 'monthly' })
  entries.push({ url: '/popular/', priority: '0.6', changefreq: 'weekly' })
  entries.push({ url: '/about/', priority: '0.5', changefreq: 'monthly' })

  // Learn pages
  entries.push({ url: '/learn/', priority: '0.8', changefreq: 'monthly' })
  entries.push({ url: '/learn/design-patterns/', priority: '0.8', changefreq: 'monthly' })

  const learnDir = path.resolve(__dirname, '../data/learn/design-patterns')
  if (fs.existsSync(learnDir)) {
    const patternFiles = fs.readdirSync(learnDir).filter((f: string) => f.endsWith('.json'))
    for (const file of patternFiles) {
      const slug = file.replace('.json', '')
      entries.push({ url: `/learn/design-patterns/${slug}/`, priority: '0.7', changefreq: 'monthly' })
    }
  }

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
        const q = JSON.parse(fs.readFileSync(path.join(topicDir, file), 'utf-8'))
        const slug = q.urlSlug || file.replace('.json', '')
        entries.push({
          url: `/interview/${ch.slug}/${topic.slug}/${slug}/`,
          priority: '0.7',
          changefreq: 'monthly',
        })
      }
    }
  }

  // Build XML
  const today = new Date().toISOString().split('T')[0]
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(
      (e) =>
        `  <url><loc>${SITE_URL}${e.url}</loc><lastmod>${today}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
    ),
    '</urlset>',
    '',
  ].join('\n')

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, xml)

  console.log(`Sitemap: ${entries.length} URLs`)
}

run()
