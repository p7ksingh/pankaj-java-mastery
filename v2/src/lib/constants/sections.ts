/** Maps section keys to display labels. Add new section types here only. */
export const SECTION_LABELS: Record<string, string> = {
  s1_definition: 'Definition',
  s2_technical: 'Technical Deep Dive',
  s2_why: 'Why This Matters',
  s2_detail: 'Understanding the Concepts',
  s3_banking: 'Real-World Example',
  s3_answer: 'The Answer',
  s3_code: 'Code Example',
  s3_flow: 'Visual Overview',
  s4a_structure: 'Project Structure',
  s4_code: 'Code Example',
  s4_flow: 'How It Works',
  s4d_java: 'Java Code',
  s4e_build: 'Build and Run',
  s5_journey: 'Step-by-Step Journey',
  s5_senior: 'Senior-Level Nuances',
  s5b_flow: 'Flow Diagram',
  s5c_hld: 'High-Level Design',
  s5d_lld: 'Low-Level Design',
  s6_takeaway: 'Key Takeaway',
  s7_takeaway: 'Key Takeaway',
}

/** Returns the display label for a section key. Falls back to formatted key. */
export function getSectionLabel(key: string): string {
  if (SECTION_LABELS[key]) {
    return SECTION_LABELS[key]
  }
  // Fallback: strip prefix and format
  return key.replace(/^s\d+[a-z]?_/, '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}
