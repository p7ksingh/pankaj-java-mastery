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

  // Structured section (s1_definition): show profdef, analogy, oneliner
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
 * Converts basic markdown patterns to HTML. Handles code blocks, bold,
 * inline code, and line breaks. Intentionally minimal.
 */
function formatMarkdown(text: string): string {
  if (!text) {
    return ''
  }
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}
