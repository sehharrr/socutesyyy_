/** Per-product upload rules. */
export const UPLOAD_PHOTO_RULES = {
  'mini-photobook': { max: 10 },
  polaroids: { min: 5, perUnit: 1 },
  'photobooth-strips': { max: 4 },
  'keepsake-frame': { max: 10 },
  'mini-frame': { max: 13 },
}

/**
 * @param {string | null | undefined} slug
 * @param {number} [orderQty]
 * @returns {{ min: number | null, max: number | null }}
 */
export function getUploadPhotoRequirements(slug, orderQty = 1) {
  if (!slug) return { min: null, max: null }
  const rule = UPLOAD_PHOTO_RULES[slug]
  if (!rule) return { min: null, max: null }

  const qty = Math.max(1, Math.min(99, Math.floor(Number(orderQty)) || 1))
  let min = null
  if (rule.perUnit != null) {
    const fromUnits = qty * rule.perUnit
    min = rule.min != null ? Math.max(rule.min, fromUnits) : fromUnits
  } else if (rule.min != null) {
    min = rule.min
  }

  const max = rule.max != null && rule.max > 0 ? rule.max : null
  return { min, max }
}

/** @deprecated Use getUploadPhotoRequirements */
export function getUploadPhotoLimit(slug) {
  return getUploadPhotoRequirements(slug).max
}
