/** Maps section keys to display labels. Add new section types here only. */
export const SECTION_LABELS: Record<string, string> = {
  s1_definition: 'Definition',
  s2_technical: 'Technical Deep Dive',
  s3_banking: 'Banking Example',
  s4a_structure: 'Project Structure',
  s4d_java: 'Java Code',
  s4e_build: 'Build and Run',
  s5_journey: 'Step-by-Step Journey',
  s5b_flow: 'Flow Diagram',
  s5c_hld: 'High-Level Design',
  s5d_lld: 'Low-Level Design',
  s6_takeaway: 'Key Takeaway',
}

/** Returns the display label for a section key. Falls back to formatted key. */
export function getSectionLabel(key: string): string {
  if (SECTION_LABELS[key]) {
    return SECTION_LABELS[key]
  }
  // Fallback: strip prefix and format
  return key.replace(/^s\d+[a-z]?_/, '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}
