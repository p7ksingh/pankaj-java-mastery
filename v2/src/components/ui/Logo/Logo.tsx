interface LogoProps {
  size?: number
  className?: string
}

/**
 * Bold J — javabypankaj brand mark.
 * Distinctive J letterform with blinking red accent dot.
 */
export function Logo({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M26 10H54V14C54 14 54 52 54 58C54 68 46 76 36 76C26 76 18 68 18 58V46"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="42" cy="10" r="6" fill="#ff0000">
        <animate attributeName="opacity" values="1;0.15;1" dur="1s" repeatCount="indefinite" />
        <animate attributeName="r" values="6;8;6" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
