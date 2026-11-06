import type { IconPath } from '@/lib/types/share'

interface SvgIconProps {
  icon: IconPath
  size?: number
  className?: string
}

/**
 * Renders an SVG icon from path data.
 * Single Responsibility: only concerns itself with SVG rendering.
 * Accepts icon config from the registry — no hardcoded paths.
 */
export function SvgIcon({ icon, size = 16, className }: SvgIconProps) {
  const isFill = icon.type === 'fill'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFill ? 'currentColor' : 'none'}
      stroke={isFill ? 'none' : 'currentColor'}
      strokeWidth={isFill ? undefined : 2}
      strokeLinecap={isFill ? undefined : 'round'}
      className={className}
      aria-hidden="true"
    >
      {icon.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}
