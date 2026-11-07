/**
 * Sanitize HTML to allow only safe highlight tags (<mark>).
 * Strips all other HTML tags to prevent XSS from search results.
 *
 * Used for Typesense highlighted snippets which inject <mark> tags
 * around matched terms.
 */
export function sanitizeHighlight(html: string): string {
  // Replace all tags EXCEPT <mark> and </mark>
  return html.replace(/<\/?(?!mark\b)[^>]*>/gi, '')
}
