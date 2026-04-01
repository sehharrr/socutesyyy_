/**
 * Decorative bow — primary shop pink (#FF8FA3).
 */
export function BowIcon({ className = 'h-7 w-9 shrink-0', title, variant = 'brand' }) {
  const loop = variant === 'inverse' ? '#ffffff' : '#FF8FA3'
  const knot = variant === 'inverse' ? '#ffffff' : '#e0668f'

  return (
    <svg
      viewBox="0 0 40 28"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={!title}
      role={title ? 'img' : 'presentation'}
    >
      {title ? <title>{title}</title> : null}
      <ellipse cx="12" cy="12" rx="10" ry="8" fill={loop} />
      <ellipse cx="28" cy="12" rx="10" ry="8" fill={loop} />
      <rect x="16" y="8" width="8" height="8" rx="2.5" fill={knot} />
      <path d="M18 16 L14 26 L20 20 L26 26 L22 16" fill={loop} />
    </svg>
  )
}
