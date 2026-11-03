/**
 * Extracts key concept phrases from the full question title that are
 * not present in the short title.
 * Returns up to 3 complete phrases (not fragmented terms).
 */
export function extractKeyPoints(title: string, shortTitle: string): string[] {
  if (!title || !shortTitle || title === shortTitle) {
    return []
  }
  if (title.length - shortTitle.length < 15) {
    return []
  }

  const points: string[] = []

  // Extract parenthetical content (handles nested parens like Constructor.newInstance())
  const parenRegex = /\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g
  let m
  while ((m = parenRegex.exec(title)) !== null) {
    if (shortTitle.includes(m[0])) {
      continue
    }
    const inner = m[1].replace(/`/g, '').trim()
    if (inner.length < 10) {
      continue
    }
    points.push(inner)
  }

  // Extract em-dash explanations (only if no parenthetical points found)
  if (points.length === 0) {
    const dashParts = title.split(/\s[—–]\s/)
    if (dashParts.length >= 2) {
      for (let i = 1; i < dashParts.length; i++) {
        let seg = dashParts[i].replace(/\([^)]*\)/g, '').replace(/`/g, '').trim()
        if (/^(what|how|why|when|is|are|does|can|should)\s/i.test(seg)) {
          continue
        }
        seg = seg.replace(/,?\s+and\s+(what|how|why)\b.*$/i, '').trim()
        if (seg.length >= 15 && seg.length < 250) {
          points.push(seg)
          break
        }
      }
    }
  }

  return points.slice(0, 3)
}
