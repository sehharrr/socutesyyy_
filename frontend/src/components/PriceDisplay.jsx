/**
 * Shows a formatted RS. price with optional label.
 */
export function PriceDisplay({ amount, className = '' }) {
  const n = typeof amount === 'number' && !Number.isNaN(amount) ? amount : 0
  return (
    <p
      className={`font-semibold tabular-nums text-[#9d174d] ${className}`}
      aria-live="polite"
      aria-label={`Price RS. ${n.toLocaleString()}`}
    >
      <span className="text-[#db2777]/85">RS. </span>
      <span className="text-2xl text-[#831843] sm:text-3xl">
        {n.toLocaleString()}
      </span>
    </p>
  )
}
