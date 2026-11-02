import { getSectionLabel } from '@/lib/constants/sections'
import type { SectionContent } from '@/types'
import styles from './AnswerSection.module.css'

interface AnswerSectionProps {
  sectionKey: string
  content: SectionContent | string
}

export function AnswerSection({ sectionKey, content }: AnswerSectionProps) {
  const label = getSectionLabel(sectionKey)

  if (typeof content === 'string') {
    return (
      <section className={styles.section}>
        <h3 className={styles.label}>{label}</h3>
        <div className={styles.body} dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} />
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.label}>{label}</h3>
      {content.oneliner && (
        <p className={styles.oneliner}>{content.oneliner}</p>
      )}
      {content.profdef && (
        <div className={styles.body} dangerouslySetInnerHTML={{ __html: formatMarkdown(content.profdef) }} />
      )}
      {content.analogy && (
        <div className={styles.analogy} dangerouslySetInnerHTML={{ __html: formatMarkdown(content.analogy) }} />
      )}
    </section>
  )
}

/**
 * Converts markdown content to structured HTML.
 * Handles: code blocks, inline code, bold, paragraphs, lists, and text diagrams.
 */
function formatMarkdown(text: string): string {
  if (!text) {
    return ''
  }

  // Step 1: Extract code blocks and replace with placeholders
  const codeBlocks: string[] = []
  const processed = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const index = codeBlocks.length
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    codeBlocks.push(`<pre><code class="lang-${lang}">${escaped}</code></pre>`)
    return `\n__CODE_BLOCK_${index}__\n`
  })

  // Step 2: Split into paragraphs by double newlines
  const blocks = processed.split(/\n\n+/)
  const htmlBlocks: string[] = []

  for (const block of blocks) {
    const trimmed = block.trim()
    if (!trimmed) {
      continue
    }

    // Check if it is a code block placeholder
    const codeMatch = trimmed.match(/^__CODE_BLOCK_(\d+)__$/)
    if (codeMatch) {
      htmlBlocks.push(codeBlocks[parseInt(codeMatch[1], 10)])
      continue
    }

    // Check if it looks like a text diagram (has box chars or alignment patterns)
    if (looksLikeDiagram(trimmed)) {
      const escaped = trimmed
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      htmlBlocks.push(`<pre class="diagram">${escaped}</pre>`)
      continue
    }

    // Check if it is a list (lines starting with - or numbers)
    if (looksLikeList(trimmed)) {
      htmlBlocks.push(formatList(trimmed))
      continue
    }

    // Regular paragraph: apply inline formatting
    const formatted = formatInline(trimmed)
    htmlBlocks.push(`<p>${formatted}</p>`)
  }

  return htmlBlocks.join('\n')
}

/** Applies inline markdown: bold, inline code, line breaks within a paragraph. */
function formatInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}

/** Detects if a block looks like a text/ASCII diagram. */
function looksLikeDiagram(block: string): boolean {
  const lines = block.split('\n')
  if (lines.length < 2) {
    return false
  }
  const boxChars = /[┌┐└┘├┤┬┴─│═╔╗╚╝║▼▲►◄⊇⊆→←↓↑]/
  const asciiBox = /[+\-|]{3,}/
  const arrow = /[-=]>|<[-=]|-->|<--/
  const treeChar = /[├└│──]/

  let diagramLineCount = 0
  for (const line of lines) {
    if (boxChars.test(line) || asciiBox.test(line) || arrow.test(line) || treeChar.test(line)) {
      diagramLineCount++
    }
  }
  return diagramLineCount >= Math.min(2, lines.length * 0.3)
}

/** Detects if a block looks like a list. */
function looksLikeList(block: string): boolean {
  const lines = block.split('\n').filter((l) => l.trim())
  if (lines.length < 2) {
    return false
  }
  const listLines = lines.filter((l) => /^\s*[-*]\s/.test(l) || /^\s*\d+[.)]\s/.test(l))
  return listLines.length >= lines.length * 0.5
}

/** Formats a list block into HTML ul/ol. */
function formatList(block: string): string {
  const lines = block.split('\n').filter((l) => l.trim())
  const isOrdered = /^\s*\d+[.)]\s/.test(lines[0])
  const tag = isOrdered ? 'ol' : 'ul'
  const items = lines.map((line) => {
    const content = line.replace(/^\s*[-*]\s/, '').replace(/^\s*\d+[.)]\s/, '')
    return `<li>${formatInline(content)}</li>`
  })
  return `<${tag}>${items.join('\n')}</${tag}>`
}
