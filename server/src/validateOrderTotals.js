/** Must match [frontend/src/utils/orderFlow.js](frontend/src/utils/orderFlow.js) */
export const DELIVERY_CHARGE_RS = 400

function roundMoney(n) {
  return Math.max(0, Math.round(Number(n) || 0))
}

function splitAdvancePayment(fullTotal) {
  const n = roundMoney(fullTotal)
  const advance = Math.floor(n / 2)
  return { advance, balanceOnDelivery: n - advance }
}

function expectedOrderTotal(lineSubtotal, includeDelivery) {
  return roundMoney(lineSubtotal) + (includeDelivery ? DELIVERY_CHARGE_RS : 0)
}

/**
 * Ensures client-reported totals match shop rules (delivery + 50/50 split).
 * @param {object} body - same shape as POST /api/orders body
 * @returns {string | null} error message or null if ok
 */
export function validateOrderTotals(body) {
  const includeDelivery = body.includeDelivery === true
  const qty = Math.max(1, Math.min(99, Math.floor(Number(body.orderQty) || 1)))
  const unitPrice = Number(body.unitPrice)
  if (Number.isNaN(unitPrice) || unitPrice < 0) {
    return 'Invalid unitPrice'
  }

  let lineSubtotal
  if (body.checkoutSource === 'cart') {
    if (!Array.isArray(body.cartSnapshot) || body.cartSnapshot.length === 0) {
      return 'cartSnapshot required for cart checkout'
    }
    let sum = 0
    for (const line of body.cartSnapshot) {
      const q = Math.max(1, Math.min(99, Math.floor(Number(line.qty) || 1)))
      const p = Number(line.unitPrice)
      if (Number.isNaN(p) || p < 0) return 'Invalid cart line price'
      sum += p * q
    }
    lineSubtotal = sum
    const fromPayload = roundMoney(unitPrice * qty)
    if (roundMoney(lineSubtotal) !== fromPayload) {
      return 'Cart line totals do not match order subtotal'
    }
  } else {
    lineSubtotal = unitPrice * qty
  }

  const expectedTotal = expectedOrderTotal(lineSubtotal, includeDelivery)
  const orderTotal = roundMoney(body.orderTotal)
  if (orderTotal !== expectedTotal) {
    return `Order total mismatch (expected RS. ${expectedTotal})`
  }

  const { advance, balanceOnDelivery } = splitAdvancePayment(orderTotal)
  if (roundMoney(body.advanceAmount) !== advance) {
    return 'Advance amount does not match 50% split'
  }
  if (roundMoney(body.balanceOnDelivery) !== balanceOnDelivery) {
    return 'Balance on delivery does not match 50% split'
  }

  return null
}
