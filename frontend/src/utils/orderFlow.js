/**
 * Product-specific ordering: upload vs contact-only WhatsApp flows.
 */

/** @type {Set<string>} */
export const UPLOAD_PRODUCT_SLUGS = new Set([
  'polaroids',
  'mini-photobook',
  'photobooth-strips',
  'mini-bouquet',
])

/** @type {Set<string>} */
export const CONTACT_PRODUCT_SLUGS = new Set([
  'custom-magazine',
  'newspaper',
  'mini-album',
  'coloring-book',
  'mini-frame',
])

/**
 * @param {string} slug
 * @returns {'upload' | 'contact'}
 */
export function getOrderFlowType(slug) {
  if (UPLOAD_PRODUCT_SLUGS.has(slug)) return 'upload'
  if (CONTACT_PRODUCT_SLUGS.has(slug)) return 'contact'
  return 'contact'
}

/** Fixed delivery charge (PKR) when customer opts in. */
export const DELIVERY_CHARGE_RS = 400

/**
 * @param {number} unitPrice
 * @param {boolean} includeDelivery
 */
export function getOrderTotalAmount(unitPrice, includeDelivery) {
  const n = typeof unitPrice === 'number' && !Number.isNaN(unitPrice) ? unitPrice : 0
  return n + (includeDelivery ? DELIVERY_CHARGE_RS : 0)
}

/**
 * 50% advance now, 50% on delivery. Uses floor/remainder so amounts sum to full total.
 * @param {number} fullTotal
 * @returns {{ advance: number, balanceOnDelivery: number }}
 */
export function splitAdvancePayment(fullTotal) {
  const n =
    typeof fullTotal === 'number' && !Number.isNaN(fullTotal)
      ? Math.max(0, Math.round(fullTotal))
      : 0
  const advance = Math.floor(n / 2)
  return { advance, balanceOnDelivery: n - advance }
}

/**
 * @param {{
 *   productName: string
 *   selectionLine?: string
 *   unitPrice: number
 *   quantity?: number
 *   includeDelivery?: boolean
 *   customer: { fullName: string; phone: string; city: string; address: string; notes?: string; includeDelivery?: boolean }
 *   imageCount?: number
 *   orderRef?: string | null
 * }} p
 */
export function buildOrderWhatsAppMessage(p) {
  const qty = Math.max(1, Math.min(99, Math.floor(Number(p.quantity) || 1)))
  const unit =
    typeof p.unitPrice === 'number' && !Number.isNaN(p.unitPrice)
      ? p.unitPrice
      : 0
  const subtotal = unit * qty
  const includeDel =
    (p.includeDelivery ?? p.customer.includeDelivery) !== false
  const total = getOrderTotalAmount(subtotal, includeDel)
  const c = p.customer
  const ref =
    p.orderRef && String(p.orderRef).trim()
      ? `\nOrder ref: ${String(p.orderRef).trim()}\n`
      : '\n'
  return `Hey socutesy! I've completed the advance payment — below is the ss.${ref}
Product: ${p.productName}

Total payment: RS. ${total.toLocaleString()}

Customer details:
Name: ${c.fullName}
Phone: ${c.phone}
City: ${c.city}
Address: ${c.address}`
}

/**
 * Contact-only products (no upload) — short WhatsApp intro.
 * @param {{ productName: string; selectionLine?: string; unitPrice?: number }} p
 */
export function buildContactWhatsAppMessage(p) {
  const price =
    p.unitPrice != null
      ? `\nEstimated price: RS. ${p.unitPrice.toLocaleString()}`
      : ''
  const sel = p.selectionLine?.trim()
  const opt = sel ? `\nOptions: ${sel}` : ''
  return `Hi SoCutesy! I'd like to discuss a custom order for: ${p.productName}${opt}${price}

Please advise on next steps. Thank you!`
}
