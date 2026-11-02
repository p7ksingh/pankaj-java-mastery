interface StructuredDataProps {
  data: Record<string, unknown>
}

/** Renders a JSON-LD script tag for search engine structured data. */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
