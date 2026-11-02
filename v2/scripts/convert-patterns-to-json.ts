/**
 * Converts design pattern HTML files from content-review/ into JSON data files.
 * Each HTML file becomes one JSON file under data/learn/design-patterns/.
 *
 * Run: npx ts-node --skip-project --compiler-options '{"module":"commonjs","esModuleInterop":true}' scripts/convert-patterns-to-json.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const INPUT_DIR = path.resolve(__dirname, '../content-review')
const OUTPUT_DIR = path.resolve(__dirname, '../data/learn/design-patterns')

interface PatternSection {
  id: string
  title: string
  html: string
}

interface PatternData {
  slug: string
  title: string
  category: string
  subcategory: string
  difficulty: string
  readingTimeMinutes: number
  sections: PatternSection[]
  sectionCount: number
}

const PATTERN_META: Record<string, { title: string; subcategory: string; difficulty: string; readingTime: number }> = {
  '01-singleton-pattern': { title: 'Singleton Design Pattern', subcategory: 'creational', difficulty: 'Medium', readingTime: 25 },
  '02-factory-pattern': { title: 'Factory and Factory Method Pattern', subcategory: 'creational', difficulty: 'Medium', readingTime: 20 },
  '03-abstract-factory-pattern': { title: 'Abstract Factory Pattern', subcategory: 'creational', difficulty: 'Hard', readingTime: 18 },
  '04-template-method-pattern': { title: 'Template Method Pattern', subcategory: 'behavioral', difficulty: 'Medium', readingTime: 18 },
  '05-builder-pattern': { title: 'Builder Design Pattern', subcategory: 'creational', difficulty: 'Medium', readingTime: 18 },
  '06-strategy-pattern': { title: 'Strategy Design Pattern', subcategory: 'behavioral', difficulty: 'Medium', readingTime: 18 },
  '07-adapter-pattern': { title: 'Adapter Design Pattern', subcategory: 'structural', difficulty: 'Medium', readingTime: 15 },
  '08-decorator-pattern': { title: 'Decorator / Wrapper Pattern', subcategory: 'structural', difficulty: 'Medium', readingTime: 15 },
  '09-flyweight-pattern': { title: 'Flyweight Design Pattern', subcategory: 'structural', difficulty: 'Medium', readingTime: 14 },
  '10-proxy-pattern': { title: 'Proxy Design Pattern', subcategory: 'structural', difficulty: 'Hard', readingTime: 18 },
  '11-prototype-pattern': { title: 'Prototype Design Pattern', subcategory: 'creational', difficulty: 'Medium', readingTime: 16 },
  '12-dao-pattern': { title: 'DAO (Data Access Object) Pattern', subcategory: 'jee-integration', difficulty: 'Medium', readingTime: 15 },
  '13-business-delegate-pattern': { title: 'Business Delegate Pattern', subcategory: 'jee-business', difficulty: 'Hard', readingTime: 15 },
  '14-service-locator-pattern': { title: 'Service Locator Pattern', subcategory: 'jee-business', difficulty: 'Medium', readingTime: 14 },
  '15-session-message-facade-composite-view': { title: 'Session Facade, Message Facade, Composite View', subcategory: 'jee-mixed', difficulty: 'Medium', readingTime: 12 },
  '16-intercepting-filter-front-controller': { title: 'Intercepting Filter and Front Controller', subcategory: 'jee-presentation', difficulty: 'Medium', readingTime: 12 },
  '17-microservices-patterns': { title: 'Microservices Patterns (SAGA, CQRS, API Gateway)', subcategory: 'microservices', difficulty: 'Hard', readingTime: 14 },
}

function extractSections(html: string): PatternSection[] {
  const sections: PatternSection[] = []
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/g
  let match: RegExpExecArray | null
  const positions: Array<{ title: string; start: number; end: number }> = []

  while ((match = h2Regex.exec(html)) !== null) {
    const title = match[1].replace(/<[^>]*>/g, '').trim()
    positions.push({ title, start: match.index, end: 0 })
  }

  // Set end positions
  for (let i = 0; i < positions.length; i++) {
    positions[i].end = i + 1 < positions.length ? positions[i + 1].start : html.indexOf('</body>')
  }

  // Extract content between h2 tags
  for (let i = 0; i < positions.length; i++) {
    const p = positions[i]
    const content = html.substring(p.start, p.end).trim()
    const id = `section-${i + 1}`
    sections.push({ id, title: p.title, html: content })
  }

  return sections
}

function run(): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const files = fs.readdirSync(INPUT_DIR)
    .filter((f: string) => f.endsWith('.html'))
    .sort()

  const metaEntries: Array<{ slug: string; title: string; subcategory: string; difficulty: string; readingTimeMinutes: number; sectionCount: number; order: number }> = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const baseName = file.replace('.html', '')
    const slug = baseName
    const meta = PATTERN_META[baseName]

    if (!meta) {
      console.error(`No metadata for: ${baseName}`)
      continue
    }

    const html = fs.readFileSync(path.join(INPUT_DIR, file), 'utf-8')

    // Extract body content
    const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/)
    const bodyHtml = bodyMatch ? bodyMatch[1] : html

    const sections = extractSections(bodyHtml)

    const patternData: PatternData = {
      slug,
      title: meta.title,
      category: 'design-patterns',
      subcategory: meta.subcategory,
      difficulty: meta.difficulty,
      readingTimeMinutes: meta.readingTime,
      sections,
      sectionCount: sections.length,
    }

    const outFile = path.join(OUTPUT_DIR, `${slug}.json`)
    fs.writeFileSync(outFile, JSON.stringify(patternData, null, 2) + '\n')

    metaEntries.push({
      slug,
      title: meta.title,
      subcategory: meta.subcategory,
      difficulty: meta.difficulty,
      readingTimeMinutes: meta.readingTime,
      sectionCount: sections.length,
      order: i + 1,
    })

    console.log(`  ${slug}: ${sections.length} sections`)
  }

  // Write meta index
  const metaFile = path.join(OUTPUT_DIR, '_meta.json')
  fs.writeFileSync(metaFile, JSON.stringify({
    category: 'design-patterns',
    title: 'Java Design Patterns',
    description: '21 design patterns with complete tutorials, industry projects, HLD/LLD, and interview questions.',
    totalPatterns: metaEntries.length,
    patterns: metaEntries,
  }, null, 2) + '\n')

  console.log(`\nDone: ${metaEntries.length} patterns converted to JSON`)
}

run()
