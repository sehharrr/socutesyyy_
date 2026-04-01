import { customAlphabet } from 'nanoid'

/** Uppercase A–Z and 2–9 only (no 0/O/1/I confusion). Length 8. */
const SHORT_ORDER_ID_LEN = 8
const ORDER_ID_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

/** Legacy rows created with randomUUID() */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const SHORT_ORDER_ID_RE = new RegExp(
  `^[${ORDER_ID_CHARS}]{${SHORT_ORDER_ID_LEN}}$`,
)

/** @returns {string} always exactly 8 characters */
export const generateShortOrderId = customAlphabet(ORDER_ID_CHARS, SHORT_ORDER_ID_LEN)

/** For /api/health — proves this server build issues short ids */
export const ORDER_ID_SCHEME = `short${SHORT_ORDER_ID_LEN}`

/** Accept new short ids or old UUIDs (admin / file routes). */
export function isValidOrderIdParam(id) {
  if (typeof id !== 'string') return false
  return SHORT_ORDER_ID_RE.test(id) || UUID_RE.test(id)
}
