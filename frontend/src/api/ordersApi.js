/**
 * Persists orders + uploads. In dev, Vite proxies `/api` to the API server.
 * Production: set VITE_API_URL to your API origin (e.g. https://shop-api.example.com).
 */
function apiBase() {
  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''
  return base
}

/**
 * @param {object} payload
 * @returns {Promise<{ id: string }>}
 */
export async function createOrder(payload) {
  const url = `${apiBase()}/api/orders`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    let msg = res.statusText
    try {
      const j = await res.json()
      if (j.error) msg = j.error
    } catch {
      /* ignore */
    }
    throw new Error(msg || `Order save failed (${res.status})`)
  }
  const data = await res.json()
  const rawId = data?.id
  if (typeof rawId === 'string' && rawId.length > 12) {
    console.warn(
      '[orders] API returned a long order id — redeploy/restart the server so /api/health includes orderIdScheme "short8".',
    )
  }
  return data
}

/**
 * @param {string} orderId
 * @param {Array<{ file: File }>} fileEntries
 */
export async function uploadOrderPhotos(orderId, fileEntries) {
  if (!fileEntries?.length) return { ok: true, count: 0 }
  const fd = new FormData()
  for (const item of fileEntries) {
    const f = item.file
    if (f instanceof File) fd.append('photos', f, f.name)
  }
  const url = `${apiBase()}/api/orders/${encodeURIComponent(orderId)}/uploads`
  const res = await fetch(url, { method: 'POST', body: fd })
  if (!res.ok) {
    let msg = res.statusText
    try {
      const j = await res.json()
      if (j.error) msg = j.error
    } catch {
      /* ignore */
    }
    throw new Error(msg || `Upload failed (${res.status})`)
  }
  return res.json()
}
