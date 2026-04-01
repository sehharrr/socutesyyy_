const opts = { credentials: 'include' }

export async function adminMe() {
  const r = await fetch('/api/admin/me', opts)
  if (!r.ok) throw new Error('Failed to check admin')
  return r.json()
}

export async function adminLogin(password) {
  const r = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password }),
  })
  if (!r.ok) {
    let msg = 'Login failed'
    try {
      const j = await r.json()
      if (j.error) msg = j.error
    } catch {
      /* ignore */
    }
    throw new Error(msg)
  }
  return r.json()
}

export async function adminLogout() {
  await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
}

export async function fetchOrders() {
  const r = await fetch('/api/admin/orders', opts)
  if (r.status === 401) throw new Error('Unauthorized')
  if (!r.ok) throw new Error('Failed to load orders')
  return r.json()
}

export async function fetchOrderDetail(id) {
  const r = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, opts)
  if (r.status === 401) throw new Error('Unauthorized')
  if (r.status === 404) throw new Error('Not found')
  if (!r.ok) throw new Error('Failed to load order')
  return r.json()
}

/** Same-origin URL for <img src> (session cookie sent automatically). */
export function adminFileUrl(orderId, storedFilename) {
  const q = encodeURIComponent(storedFilename)
  return `/api/admin/orders/${encodeURIComponent(orderId)}/files/${q}`
}
