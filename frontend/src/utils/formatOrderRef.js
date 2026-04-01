/**
 * Pretty-print 8-char server order ids as XXXX-XXXX. Passes through legacy UUIDs.
 * Must match server [orderId.js](server/src/orderId.js) character set.
 */
export function formatOrderRef(id) {
  if (!id) return ''
  if (/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/.test(id)) {
    return `${id.slice(0, 4)}-${id.slice(4)}`
  }
  return id
}
