import { getSectionLabel } from '@/lib/constants/sections'
import type { SectionContent } from '@/types'
import { CodeBlockEnhancer } from './CodeBlockEnhancer'
import styles from './AnswerSection.module.css'

interface AnswerSectionProps {
  sectionKey: string
  content: SectionContent | string
}

export function AnswerSection({ sectionKey, content }: AnswerSectionProps) {
  const label = getSectionLabel(sectionKey)
  const isTakeaway = sectionKey === 's6_takeaway'

  if (typeof content === 'string') {
    // Takeaway section gets distinct styling
    if (isTakeaway) {
      return (
        <section className={styles.section}>
          <h2 className={styles.label}>{label}</h2>
          <div className={styles.takeaway} dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} />
        </section>
      )
    }

    return (
      <section className={styles.section}>
        <h2 className={styles.label}>{label}</h2>
        <CodeBlockEnhancer html={formatMarkdown(content)} className={styles.body} />
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.label}>{label}</h2>
      {content.oneliner && (
        <div className={styles.oneliner}>{content.oneliner}</div>
      )}
      {content.profdef && (
        <CodeBlockEnhancer html={formatMarkdown(content.profdef)} className={styles.body} />
      )}
      {content.analogy && (
        <div className={styles.analogy} dangerouslySetInnerHTML={{ __html: formatMarkdown(content.analogy) }} />
      )}
    </section>
  )
}

/**
 * Lightweight syntax highlighting for code blocks (GFG color palette).
 * Operates on already-escaped HTML text. Adds <span> wrappers around tokens.
 */
const JAVA_KEYWORDS = new Set([
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
  'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
  'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
  'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new',
  'package', 'private', 'protected', 'public', 'return', 'short', 'static',
  'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
  'transient', 'try', 'var', 'void', 'volatile', 'while',
  'true', 'false', 'null', 'record', 'sealed', 'permits', 'yield',
])

function highlightCode(escaped: string, lang: string): string {
  const l = (lang || '').toLowerCase()

  if (l === 'bash' || l === 'sh' || l === 'shell') {
    return escaped.replace(/(#[^\n]*)/g, '<span class="syn-cm">$1</span>')
  }

  if (l === 'xml' || l === 'html') {
    return escaped
      .replace(/(&lt;\/?[\w-]+)/g, '<span class="syn-kw">$1</span>')
      .replace(/(&gt;)/g, '<span class="syn-kw">$1</span>')
      .replace(/"([^"]*)"/g, '"<span class="syn-str">$1</span>"')
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="syn-cm">$1</span>')
  }

  if (l === 'json') {
    return escaped
      .replace(/"([^"]*)"(\s*:)/g, '<span class="syn-kw">"$1"</span>$2')
      .replace(/:(\s*)"([^"]*)"/g, ':$1<span class="syn-str">"$2"</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="syn-kw">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-num">$1</span>')
  }

  if (l === 'sql') {
    const sqlKw = /\b(SELECT|FROM|WHERE|INSERT|INTO|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AND|OR|NOT|IN|EXISTS|BETWEEN|LIKE|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|AS|DISTINCT|UNION|ALL|VALUES|PRIMARY|KEY|FOREIGN|REFERENCES|NULL|DEFAULT|AUTO_INCREMENT|VARCHAR|INT|INTEGER|BIGINT|BOOLEAN|TEXT|DATE|TIMESTAMP)\b/gi
    return escaped
      .replace(/(--[^\n]*)/g, '<span class="syn-cm">$1</span>')
      .replace(sqlKw, '<span class="syn-kw">$1</span>')
      .replace(/'([^']*)'/g, '\'<span class="syn-str">$1</span>\'')
  }

  // Java / default — tokenize with a single regex
  // Order: multi-line comments, single-line comments, strings, annotations, keywords/identifiers, numbers
  const tokenPattern = /\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|@\w+|\b[A-Za-z_]\w*\b|\b\d+\.?\d*[fFdDlL]?\b/g

  return escaped.replace(tokenPattern, (match) => {
    // Multi-line comment
    if (match.startsWith('/*')) {
      return `<span class="syn-cm">${match}</span>`
    }
    // Single-line comment
    if (match.startsWith('//')) {
      return `<span class="syn-cm">${match}</span>`
    }
    // String literal
    if (match.startsWith('"') || match.startsWith("'")) {
      return `<span class="syn-str">${match}</span>`
    }
    // Annotation
    if (match.startsWith('@')) {
      return `<span class="syn-ann">${match}</span>`
    }
    // Keyword
    if (JAVA_KEYWORDS.has(match)) {
      return `<span class="syn-kw">${match}</span>`
    }
    // Type (PascalCase — starts with uppercase)
    if (/^[A-Z]/.test(match)) {
      return `<span class="syn-tp">${match}</span>`
    }
    // Number
    if (/^\d/.test(match)) {
      return `<span class="syn-num">${match}</span>`
    }
    return match
  })
}

/**
 * Converts raw text to structured HTML matching design-sample.html.
 * Code blocks get wrapper divs with headers. Diagrams get blue headers.
 */
function formatMarkdown(text: string): string {
  if (!text) {
    return ''
  }

  // Extract fenced code blocks with language-aware wrappers
  const codeBlocks: string[] = []
  const processed = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const index = codeBlocks.length
    const escaped = escapeHtml(code)

    // Detect ASCII diagrams inside ```text blocks
    const isDiagram = (!lang || lang === 'text') && /[┌┐└┘├┤┬┴─│═╔╗╚╝║▼▲→←]/.test(code)

    if (isDiagram) {
      codeBlocks.push(
        `<div class="diagram-block">` +
        `<div class="diagram-header">` +
        `<span class="diagram-label">DIAGRAM</span>` +
        `</div>` +
        `<pre class="diagram-pre">${escaped}</pre>` +
        `</div>`
      )
    } else {
      const langLabel = lang ? lang.toUpperCase() : 'CODE'
      const highlighted = highlightCode(escaped, lang)
      codeBlocks.push(
        `<div class="code-block">` +
        `<div class="code-header">` +
        `<span class="code-lang">${langLabel}</span>` +
        `</div>` +
        `<pre class="code-pre"><code${lang ? ` class="lang-${lang}"` : ''}>${highlighted}</code></pre>` +
        `</div>`
      )
    }

    return `\n__CODE_BLOCK_${index}__\n`
  })

  const blocks = processed.split(/\n\n+/)
  const htmlBlocks: string[] = []

  for (const block of blocks) {
    const trimmed = block.trim()
    if (!trimmed) {
      continue
    }

    const codeMatch = trimmed.match(/^__CODE_BLOCK_(\d+)__$/)
    if (codeMatch) {
      htmlBlocks.push(codeBlocks[parseInt(codeMatch[1], 10)])
      continue
    }

    // ASCII diagram with blue-tinted wrapper
    if (looksLikeDiagram(trimmed)) {
      htmlBlocks.push(
        `<div class="diagram-block">` +
        `<div class="diagram-header">` +
        `<span class="diagram-label">DIAGRAM</span>` +
        `</div>` +
        `<pre class="diagram-pre">${escapeHtml(trimmed)}</pre>` +
        `</div>`
      )
      continue
    }

    if (looksLikeList(trimmed)) {
      htmlBlocks.push(formatList(trimmed))
      continue
    }

    htmlBlocks.push(formatParagraph(trimmed))
  }

  return htmlBlocks.join('\n')
}

function formatParagraph(text: string): string {
  const formatted = formatInline(text)

  const stepMatch = formatted.match(/^(Step\s+\d+\s*[:\u2014\u2013\u2212—-])\s*/)
  if (stepMatch) {
    const label = stepMatch[1]
    const rest = formatted.slice(stepMatch[0].length)
    return `<div class="step"><span class="step-label">${label}</span> ${rest}</div>`
  }

  const problemMatch = formatted.match(/^(Problem\s+\d+\s*[:\u2014\u2013\u2212—-])\s*/)
  if (problemMatch) {
    const label = problemMatch[1]
    const rest = formatted.slice(problemMatch[0].length)
    return `<div class="step"><span class="step-label">${label}</span> ${rest}</div>`
  }

  const inputMatch = formatted.match(/^((?:Input data|Output|Result|Note|Rule|Key|Summary)\s*:)\s*/i)
  if (inputMatch) {
    const label = inputMatch[1]
    const rest = formatted.slice(inputMatch[0].length)
    return `<p><strong>${label}</strong> ${rest}</p>`
  }

  return `<p>${formatted}</p>`
}

function formatInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function looksLikeDiagram(block: string): boolean {
  const lines = block.split('\n')
  if (lines.length < 2) {
    return false
  }
  const boxChars = /[┌┐└┘├┤┬┴─│═╔╗╚╝║▼▲►◄⊇⊆→←↓↑]/
  const asciiBox = /[+\-|]{3,}/
  const arrow = /[-=]>|<[-=]|-->|<--/
  const treeChar = /[├└│──]/

  let count = 0
  for (const line of lines) {
    if (boxChars.test(line) || asciiBox.test(line) || arrow.test(line) || treeChar.test(line)) {
      count++
    }
  }
  return count >= Math.min(2, lines.length * 0.3)
}

function looksLikeList(block: string): boolean {
  const lines = block.split('\n').filter((l) => l.trim())
  if (lines.length < 2) {
    return false
  }
  const listLines = lines.filter((l) => /^\s*[-*]\s/.test(l) || /^\s*\d+[.)]\s/.test(l))
  return listLines.length >= lines.length * 0.5
}

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
