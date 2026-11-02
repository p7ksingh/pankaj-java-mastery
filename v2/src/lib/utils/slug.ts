/**
 * Converts a title string to a URL-safe slug.
 * Lowercases, strips non-alphanumeric characters, replaces spaces with hyphens,
 * collapses multiple hyphens, and trims leading/trailing hyphens.
 */
export function generateSlug(title: string): string {
  if (!title) {
    return ''
  }

  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
