/**
 * Share platform types — used by ShareLinks, Footer, and share URL builders.
 * Adding a new platform = adding a config entry in constants/share.ts.
 */

/** Unique identifier for each share platform */
export type SharePlatformId = 'linkedin' | 'x' | 'whatsapp' | 'telegram' | 'email'

/** SVG path data for a share platform icon */
export interface IconPath {
  /** SVG path 'd' attribute values */
  readonly paths: readonly string[]
  /** 'fill' uses currentColor fill, 'stroke' uses stroke outline */
  readonly type: 'fill' | 'stroke'
}

/** Configuration for a single share platform (Open/Closed: extend without modifying) */
export interface SharePlatform {
  readonly id: SharePlatformId
  readonly label: string
  readonly icon: IconPath
  /** Function to build the share URL from page URL and optional title */
  readonly buildUrl: (pageUrl: string, title?: string) => string
}

/** Social profile link (for the "Connect" icons like GitHub, LinkedIn profile) */
export interface SocialProfile {
  readonly id: string
  readonly label: string
  readonly url: string
  readonly icon: IconPath
}
