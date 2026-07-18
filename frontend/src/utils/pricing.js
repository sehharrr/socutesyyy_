/**
 * Dynamic price helpers for products with fixed price, flat variants, or paper + sides options.
 */

/** True when the product should show a single price on cards (no "from"). */
export function hasFixedPrice(product) {
  if (product.price != null) return true
  if (product.designs?.length && product.sizes?.length) {
    const prices = product.sizes.map((s) => s.price)
    return new Set(prices).size === 1
  }
  if (product.options?.length) return false
  if (product.variants?.length) {
    if (product.variants.length === 1) return true
    const prices = product.variants.map((v) => v.price)
    return new Set(prices).size === 1
  }
  return true
}

export function getMinPrice(product) {
  if (product.price != null) return product.price
  if (product.sizes?.length) {
    return Math.min(...product.sizes.map((s) => s.price))
  }
  if (product.options?.length) {
    let min = Infinity
    for (const g of product.options) {
      for (const v of g.variants) {
        min = Math.min(min, v.price)
      }
    }
    return Number.isFinite(min) ? min : 0
  }
  if (product.variants?.length) {
    return Math.min(...product.variants.map((v) => v.price))
  }
  return 0
}

/**
 * @returns {{ kind: 'simple' } | { kind: 'options', paperIndex: number, sideIndex: number } | { kind: 'variants', index: number } | { kind: 'keepsake', designIndex: number, sizeIndex: number }}
 */
export function defaultSelection(product) {
  if (product.designs?.length && product.sizes?.length) {
    return { kind: 'keepsake', designIndex: 0, sizeIndex: 0 }
  }
  if (product.price != null) return { kind: 'simple' }
  if (product.options?.length) {
    return { kind: 'options', paperIndex: 0, sideIndex: 0 }
  }
  if (product.variants?.length) {
    return { kind: 'variants', index: 0 }
  }
  return { kind: 'simple' }
}

export function getPrice(product, selection) {
  if (product.price != null) return product.price
  if (selection.kind === 'keepsake') {
    const s = product.sizes?.[selection.sizeIndex]
    return s?.price ?? 0
  }
  if (selection.kind === 'options') {
    const g = product.options[selection.paperIndex]
    if (!g) return 0
    const v = g.variants[selection.sideIndex]
    return v?.price ?? 0
  }
  if (selection.kind === 'variants') {
    const v = product.variants[selection.index]
    return v?.price ?? 0
  }
  return 0
}

export function getSelectionSummary(product, selection) {
  if (selection.kind === 'simple') return 'Standard'
  if (selection.kind === 'keepsake') {
    const d = product.designs?.[selection.designIndex]
    const s = product.sizes?.[selection.sizeIndex]
    if (!d || !s) return ''
    return `${d.label} · Size ${s.size}`
  }
  if (selection.kind === 'options') {
    const g = product.options[selection.paperIndex]
    const v = g?.variants[selection.sideIndex]
    if (!g || !v) return ''
    return `${g.type} · ${v.sides} sides`
  }
  if (selection.kind === 'variants') {
    const v = product.variants[selection.index]
    if (!v) return ''
    if (v.label) return v.label
    if (v.size) return `Size ${v.size}`
    if (v.sides != null) return `${v.sides} sides`
    return 'Selected'
  }
  return ''
}

/** Normalize side index when paper type changes (all groups have same side counts in our catalog). */
export function clampSideIndex(product, paperIndex, sideIndex) {
  const g = product.options?.[paperIndex]
  if (!g?.variants?.length) return 0
  const max = g.variants.length - 1
  return Math.min(Math.max(0, sideIndex), max)
}
