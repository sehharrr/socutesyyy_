import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  adminLogin,
  adminLogout,
  adminMe,
  adminFileUrl,
  fetchOrderDetail,
  fetchOrders,
} from '../api/adminApi'
import { formatOrderRef } from '../utils/formatOrderRef'

export default function AdminPage() {
  const [configured, setConfigured] = useState(null)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [listError, setListError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const me = await adminMe()
      setConfigured(me.configured)
      setAuthed(Boolean(me.admin))
    } catch {
      setConfigured(false)
      setAuthed(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!authed) return
    let cancelled = false
    ;(async () => {
      setListError(null)
      try {
        const { orders: list } = await fetchOrders()
        if (!cancelled) setOrders(list ?? [])
      } catch (e) {
        if (!cancelled)
          setListError(e instanceof Error ? e.message : 'Could not load orders')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authed])

  useEffect(() => {
    if (!selectedId || !authed) {
      setDetail(null)
      return
    }
    let cancelled = false
    setDetailLoading(true)
    ;(async () => {
      try {
        const d = await fetchOrderDetail(selectedId)
        if (!cancelled) setDetail(d)
      } catch {
        if (!cancelled) setDetail(null)
      } finally {
        if (!cancelled) setDetailLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [selectedId, authed])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError(null)
    try {
      await adminLogin(password)
      setPassword('')
      setAuthed(true)
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const handleLogout = async () => {
    await adminLogout()
    setAuthed(false)
    setOrders([])
    setSelectedId(null)
    setDetail(null)
    await refresh()
  }

  if (loading) {
    return (
      <main className="min-h-svh bg-[#fffafc] px-4 py-16 text-center text-sm text-[#6b7280]">
        Loading…
      </main>
    )
  }

  if (!configured) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Admin is not configured on the server. Set{' '}
          <code className="rounded bg-white/80 px-1">ADMIN_PASSWORD</code> and{' '}
          <code className="rounded bg-white/80 px-1">SESSION_SECRET</code> in the
          API environment, then restart.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm font-medium text-[#9d174d] hover:underline"
        >
          ← Back to shop
        </Link>
      </main>
    )
  }

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[#fce7f3] bg-white p-8 shadow-sm"
        >
          <h1 className="font-semibold text-xl text-[#831843]">Orders admin</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Sign in with your admin password.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {loginError && (
              <p className="text-sm text-[#b91c1c]" role="alert">
                {loginError}
              </p>
            )}
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-[#fbcfe8] px-4 py-3 text-sm text-[#831843] outline-none focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#fbcfe8]"
              placeholder="Password"
            />
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-[#f472b6] to-[#ec4899] py-3 text-sm font-semibold text-white shadow-lg shadow-pink-300/40"
            >
              Sign in
            </button>
          </form>
          <Link
            to="/"
            className="mt-6 inline-block text-sm font-medium text-[#9d174d] hover:underline"
          >
            ← Back to shop
          </Link>
        </motion.div>
      </main>
    )
  }

  const c = detail?.order?.customer

  return (
    <main className="min-h-svh bg-[#fffafc] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-semibold text-2xl text-[#831843]">Orders</h1>
            <p className="mt-1 text-sm text-[#6b7280]">
              Customer details and uploaded photos (newest first).
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl border border-[#fbcfe8] bg-white px-4 py-2 text-sm font-semibold text-[#db2777] hover:bg-[#fdf2f8]"
            >
              Log out
            </button>
            <Link
              to="/"
              className="rounded-2xl border border-[#fbcfe8] bg-white px-4 py-2 text-sm font-semibold text-[#db2777] hover:bg-[#fdf2f8]"
            >
              Shop
            </Link>
          </div>
        </div>

        {listError && (
          <p className="mt-4 text-sm text-[#b91c1c]" role="alert">
            {listError}
          </p>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ul className="max-h-[70vh] space-y-2 overflow-y-auto rounded-2xl border border-[#fce7f3] bg-white p-2">
              {orders.length === 0 && (
                <li className="px-3 py-3 text-sm text-[#9ca3af]">No orders yet.</li>
              )}
              {orders.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(o.id)}
                    className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      selectedId === o.id
                        ? 'bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white'
                        : 'text-[#374151] hover:bg-[#fdf2f8]'
                    }`}
                  >
                    <span className="block font-medium truncate">
                      {o.productName}
                    </span>
                    <span
                      className={`mt-0.5 block text-xs font-mono truncate ${
                        selectedId === o.id ? 'text-white/90' : 'text-[#9ca3af]'
                      }`}
                    >
                      {formatOrderRef(o.id)}
                    </span>
                    <span
                      className={`mt-0.5 block text-xs ${
                        selectedId === o.id ? 'text-white/90' : 'text-[#6b7280]'
                      }`}
                    >
                      {o.customerPreview?.fullName} · RS.{' '}
                      {typeof o.orderTotal === 'number'
                        ? o.orderTotal.toLocaleString()
                        : '—'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            {!selectedId && (
              <p className="rounded-2xl border border-[#fce7f3] bg-white p-8 text-center text-sm text-[#9ca3af]">
                Select an order to view details and photos.
              </p>
            )}
            {selectedId && detailLoading && (
              <p className="text-sm text-[#6b7280]">Loading…</p>
            )}
            {selectedId && !detailLoading && detail && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#fce7f3] bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-[#be185d]">
                    Order
                  </h2>
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-[#9ca3af]">Reference</dt>
                      <dd className="font-mono text-xs text-[#374151] break-all">
                        {formatOrderRef(detail.order.id)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#9ca3af]">Placed</dt>
                      <dd className="text-[#374151]">{detail.order.createdAt}</dd>
                    </div>
                    <div>
                      <dt className="text-[#9ca3af]">Product</dt>
                      <dd className="text-[#374151]">{detail.order.productName}</dd>
                    </div>
                    <div>
                      <dt className="text-[#9ca3af]">Total</dt>
                      <dd className="font-medium text-[#831843]">
                        RS. {detail.order.orderTotal?.toLocaleString?.() ?? '—'}
                      </dd>
                    </div>
                  </dl>
                  {detail.order.selectionSummary && (
                    <p className="mt-3 text-sm text-[#6b7280]">
                      <span className="font-medium text-[#9d174d]">Options: </span>
                      {detail.order.selectionSummary}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-[#fce7f3] bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-[#be185d]">
                    Customer
                  </h2>
                  {c && (
                    <ul className="mt-3 space-y-2 text-sm text-[#374151]">
                      <li>
                        <span className="text-[#9ca3af]">Name </span>
                        {c.fullName}
                      </li>
                      <li>
                        <span className="text-[#9ca3af]">Phone </span>
                        <a className="text-[#db2777] underline" href={`tel:${c.phone}`}>
                          {c.phone}
                        </a>
                      </li>
                      <li>
                        <span className="text-[#9ca3af]">City </span>
                        {c.city}
                      </li>
                      <li>
                        <span className="text-[#9ca3af]">Address </span>
                        {c.address}
                      </li>
                      {c.notes && (
                        <li>
                          <span className="text-[#9ca3af]">Notes </span>
                          {c.notes}
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="rounded-2xl border border-[#fce7f3] bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-[#be185d]">
                    Uploaded photos ({detail.uploads?.length ?? 0})
                  </h2>
                  {!detail.uploads?.length && (
                    <p className="mt-3 text-sm text-[#9ca3af]">No files for this order.</p>
                  )}
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {detail.uploads?.map((u) => (
                      <a
                        key={u.id}
                        href={adminFileUrl(detail.order.id, u.stored_filename)}
                        target="_blank"
                        rel="noreferrer"
                        className="group block overflow-hidden rounded-2xl border border-[#fce7f3] bg-[#fffafc]"
                      >
                        <img
                          src={adminFileUrl(detail.order.id, u.stored_filename)}
                          alt={u.original_name || 'Upload'}
                          className="aspect-square w-full object-cover transition group-hover:opacity-95"
                        />
                        <p className="truncate px-2 py-1.5 text-[10px] text-[#6b7280]">
                          {u.original_name}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
