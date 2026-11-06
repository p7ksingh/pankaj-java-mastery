import { SOCIAL_ICONS } from '@/lib/constants/share'
import type { SocialProfile, IconPath } from '@/lib/types/share'

/** Human-readable labels for social platform IDs */
const SOCIAL_LABELS: ReadonlyMap<string, string> = new Map([
  ['linkedin', 'LinkedIn'],
  ['github', 'GitHub'],
  ['instagram', 'Instagram'],
])

/** Fallback icon for unknown social platforms */
const FALLBACK_ICON: IconPath = {
  paths: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
  type: 'stroke',
}

/**
 * Builds SocialProfile[] from a flat key→url record.
 * Pure function — no side effects, easy to test.
 * Filters out undefined/empty URLs automatically.
 */
export function buildSocialProfiles(
  social: Readonly<Record<string, string | undefined>>
): SocialProfile[] {
  return Object.entries(social)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([id, url]) => ({
      id,
      label: SOCIAL_LABELS.get(id) ?? id,
      url,
      icon: SOCIAL_ICONS.get(id) ?? FALLBACK_ICON,
    }))
}
