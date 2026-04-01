/**
 * Dynamic price helpers for products with fixed price, flat variants, or paper + sides options.
 */

export function getMinPrice(product) {
  if (product.price != null) return product.price
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

/** @returns {{ kind: 'simple' } | { kind: 'options', paperIndex: number, sideIndex: number } | { kind: 'variants', index: number }} */
export function defaultSelection(product) {
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
