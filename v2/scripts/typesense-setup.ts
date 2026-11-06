/**
 * Typesense Setup: Creates collection, generates search-only key, indexes all questions + sub-questions.
 *
 * Run: npx ts-node --skip-project --compiler-options '{"module":"commonjs","esModuleInterop":true}' scripts/typesense-setup.ts
 *
 * Security:
 * - Uses TYPESENSE_ADMIN_KEY (server-side only, never in browser)
 * - Generates a scoped search-only key for frontend (NEXT_PUBLIC_TYPESENSE_SEARCH_KEY)
 * - Search key can ONLY search the 'questions' collection, nothing else
 */

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import Typesense from 'typesense'

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const DATA_DIR = path.resolve(__dirname, '../data/interview')

// ── Config from env ──
const ADMIN_KEY = process.env.TYPESENSE_ADMIN_KEY
const HOST = process.env.TYPESENSE_HOST
const PORT = parseInt(process.env.TYPESENSE_PORT || '443', 10)
const PROTOCOL = process.env.TYPESENSE_PROTOCOL || 'https'

if (!ADMIN_KEY || !HOST) {
  console.error('Missing TYPESENSE_ADMIN_KEY or TYPESENSE_HOST in .env.local')
  process.exit(1)
}

const client = new Typesense.Client({
  nodes: [{ host: HOST, port: PORT, protocol: PROTOCOL }],
  apiKey: ADMIN_KEY,
  connectionTimeoutSeconds: 10,
})

const COLLECTION_NAME = 'questions'

// ── Schema ──
const schema = {
  name: COLLECTION_NAME,
  fields: [
    { name: 'id', type: 'string' as const },
    { name: 'title', type: 'string' as const },
    { name: 'shortTitle', type: 'string' as const },
    { name: 'chapter', type: 'string' as const, facet: true },
    { name: 'topic', type: 'string' as const, facet: true },
    { name: 'url', type: 'string' as const },
    { name: 'type', type: 'string' as const, facet: true }, // 'question' or 'subquestion'
    { name: 'parentId', type: 'string' as const, optional: true }, // for sub-questions
    { name: 'content', type: 'string' as const }, // oneliner + keyPoints for scoring
    { name: 'questionNumber', type: 'int32' as const },
  ],
  default_sorting_field: 'questionNumber',
}

// ── Extract sub-question headings from s2_detail ──
function extractSubQuestions(s2Detail: string): string[] {
  if (!s2Detail) {
    return []
  }
  const headings: string[] = []
  const regex = /^### (.+)$/gm
  let match
  while ((match = regex.exec(s2Detail)) !== null) {
    const heading = match[1].trim()
    if (heading.length > 10 && heading.length < 200) {
      headings.push(heading)
    }
  }
  return headings
}

// ── Extract text content for search scoring ──
function extractContent(sections: Record<string, unknown>): string {
  const parts: string[] = []
  const s1 = sections?.s1_definition
  if (s1 && typeof s1 === 'object') {
    const def = s1 as Record<string, unknown>
    if (typeof def.oneliner === 'string') {
      parts.push(def.oneliner)
    }
    if (typeof def.profdef === 'string') {
      parts.push(def.profdef)
    }
  }
  return parts.join(' ').slice(0, 500)
}

async function run() {
  console.log('── Typesense Setup ──')
  console.log(`Host: ${HOST}`)

  // Step 1: Delete existing collection if exists
  try {
    await client.collections(COLLECTION_NAME).delete()
    console.log('Deleted existing collection')
  } catch {
    console.log('No existing collection to delete')
  }

  // Step 2: Create collection
  await client.collections().create(schema)
  console.log('Created collection:', COLLECTION_NAME)

  // Step 3: Index all questions + sub-questions
  const chaptersFile = path.join(DATA_DIR, 'chapters.json')
  const chapters = JSON.parse(fs.readFileSync(chaptersFile, 'utf-8')).chapters
  const documents: Record<string, unknown>[] = []
  let questionCount = 0
  let subQuestionCount = 0

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
        const sections = q.sections || {}
        const s2 = sections.s2_detail || ''
        const url = `/interview/${ch.slug}/${topic.slug}/${q.urlSlug || q.id}/`
        const content = extractContent(sections)
        const keyPoints = (q.keyPoints || []).join('. ')

        // Index the main question
        documents.push({
          id: q.id,
          title: q.title || q.shortTitle,
          shortTitle: q.shortTitle || q.title,
          chapter: ch.title,
          topic: topic.title,
          url,
          type: 'question',
          parentId: '',
          content: `${content} ${keyPoints}`,
          questionNumber: q.questionNumber || 0,
        })
        questionCount++

        // Index sub-questions (### headings from s2_detail)
        const subHeadings = extractSubQuestions(s2)
        for (let i = 0; i < subHeadings.length; i++) {
          documents.push({
            id: `${q.id}-sub-${i}`,
            title: subHeadings[i],
            shortTitle: subHeadings[i],
            chapter: ch.title,
            topic: topic.title,
            url: `${url}#${slugify(subHeadings[i])}`,
            type: 'subquestion',
            parentId: q.id,
            content: '',
            questionNumber: q.questionNumber || 0,
          })
          subQuestionCount++
        }
      }
    }
  }

  // Batch import
  console.log(`Indexing ${documents.length} documents (${questionCount} questions + ${subQuestionCount} sub-questions)...`)

  const BATCH_SIZE = 100
  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batch = documents.slice(i, i + BATCH_SIZE)
    try {
      await client.collections(COLLECTION_NAME).documents().import(batch, { action: 'upsert' })
    } catch (err) {
      console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, err)
    }
    if ((i / BATCH_SIZE + 1) % 50 === 0) {
      console.log(`  ...indexed ${Math.min(i + BATCH_SIZE, documents.length)} / ${documents.length}`)
    }
  }

  console.log(`Indexed: ${questionCount} questions + ${subQuestionCount} sub-questions = ${documents.length} total`)

  // Step 4: Create search-only API key
  const searchKey = await client.keys().create({
    description: 'Search-only key for javabypankaj frontend',
    actions: ['documents:search'],
    collections: [COLLECTION_NAME],
  })

  console.log('')
  console.log('── Search-Only API Key (safe for frontend) ──')
  console.log(`NEXT_PUBLIC_TYPESENSE_SEARCH_KEY=${searchKey.value}`)
  console.log(`NEXT_PUBLIC_TYPESENSE_HOST=${HOST}`)
  console.log('')
  console.log('Add these to your .env.local and .env.production')
  console.log('This key can ONLY search — it cannot create, update, or delete anything.')
  console.log('')
  console.log('── Done ──')
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)
}

run().catch((err) => {
  console.error('Setup failed:', err)
  process.exit(1)
})
