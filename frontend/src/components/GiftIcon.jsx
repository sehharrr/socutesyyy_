/**
 * Kawaii gift box — matches SoCutesy logo (bubblegum pink box + bow + smile).
 */
export function GiftIcon({ className = 'h-10 w-10 shrink-0' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Bow loops */}
      <ellipse cx="15" cy="13" rx="8" ry="6" fill="#FF99BB" />
      <ellipse cx="33" cy="13" rx="8" ry="6" fill="#FF99BB" />
      <circle cx="24" cy="13" r="4.5" fill="#E0668F" />
      {/* Lid */}
      <rect x="6" y="16" width="36" height="11" rx="4" fill="#FFB7CD" />
      {/* Box */}
      <rect x="8" y="25" width="32" height="24" rx="4" fill="#FF99BB" />
      {/* Ribbon vertical */}
      <rect x="22" y="25" width="4" height="24" rx="1" fill="#FF87B0" opacity="0.45" />
      {/* Kawaii face */}
      <path
        d="M15 33 Q18 36 21 33"
        stroke="#CE6684"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M27 33 Q30 36 33 33"
        stroke="#CE6684"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M17 39 Q24 44 31 39"
        stroke="#CE6684"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
