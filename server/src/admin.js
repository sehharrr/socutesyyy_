import path from 'path'
import fs from 'fs'
import rateLimit from 'express-rate-limit'
import { getDb } from './db.js'
import { isValidOrderIdParam } from './orderId.js'

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: 'Too many login attempts, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim())
}

export function requireAdmin(req, res, next) {
  if (!adminConfigured()) {
    return res.status(503).json({ error: 'Admin is not configured' })
  }
  if (!req.session?.admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

function parseRows(stmt) {
  const rows = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject())
  }
  stmt.free()
  return rows
}

/**
 * @param {import('express').Express} app
 * @param {{ uploadRoot: string }} opts
 */
export function registerAdminRoutes(app, { uploadRoot }) {
  app.post('/api/admin/login', adminLoginLimiter, (req, res) => {
    if (!adminConfigured()) {
      return res.status(503).json({ error: 'Admin not configured' })
    }
    const pwd = String(req.body?.password ?? '')
    if (pwd !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' })
    }
    req.session.admin = true
    return res.json({ ok: true })
  })

  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ ok: true })
    })
  })

  app.get('/api/admin/me', (req, res) => {
    if (!adminConfigured()) {
      return res.json({ admin: false, configured: false })
    }
    return res.json({
      configured: true,
      admin: Boolean(req.session?.admin),
    })
  })

  app.get('/api/admin/orders', requireAdmin, (_req, res) => {
    try {
      const db = getDb()
      const stmt = db.prepare(
        `SELECT id, created_at, checkout_source, slug, product_name, unit_price, order_qty,
                selection_summary, order_total, advance_amount, customer_json
         FROM orders
         ORDER BY datetime(created_at) DESC
         LIMIT 500`,
      )
      const raw = parseRows(stmt)
      const orders = raw.map((row) => {
        let customer = {}
        try {
          customer = JSON.parse(row.customer_json || '{}')
        } catch {
          /* ignore */
        }
        return {
          id: row.id,
          createdAt: row.created_at,
          checkoutSource: row.checkout_source,
          slug: row.slug,
          productName: row.product_name,
          unitPrice: row.unit_price,
          orderQty: row.order_qty,
          selectionSummary: row.selection_summary,
          orderTotal: row.order_total,
          advanceAmount: row.advance_amount,
          customerPreview: {
            fullName: customer.fullName,
            phone: customer.phone,
            city: customer.city,
          },
        }
      })
      res.json({ orders })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Failed to list orders' })
    }
  })

  app.get('/api/admin/orders/:id', requireAdmin, (req, res) => {
    const id = req.params.id
    if (!isValidOrderIdParam(id)) {
      return res.status(400).json({ error: 'Invalid order id' })
    }
    try {
      const db = getDb()
      const oStmt = db.prepare('SELECT * FROM orders WHERE id = ?')
      oStmt.bind([id])
      if (!oStmt.step()) {
        oStmt.free()
        return res.status(404).json({ error: 'Order not found' })
      }
      const orderRow = oStmt.getAsObject()
      oStmt.free()

      let customer = {}
      try {
        customer = JSON.parse(orderRow.customer_json || '{}')
      } catch {
        /* ignore */
      }

      let cartSnapshot = null
      if (orderRow.cart_snapshot_json) {
        try {
          cartSnapshot = JSON.parse(orderRow.cart_snapshot_json)
        } catch {
          cartSnapshot = null
        }
      }

      const uStmt = db.prepare(
        'SELECT id, original_name, stored_filename, mime_type, size_bytes FROM order_uploads WHERE order_id = ? ORDER BY id ASC',
      )
      uStmt.bind([id])
      const uploads = parseRows(uStmt)

      res.json({
        order: {
          id: orderRow.id,
          createdAt: orderRow.created_at,
          checkoutSource: orderRow.checkout_source,
          slug: orderRow.slug,
          productName: orderRow.product_name,
          unitPrice: orderRow.unit_price,
          orderQty: orderRow.order_qty,
          selectionSummary: orderRow.selection_summary,
          includeDelivery: Boolean(orderRow.include_delivery),
          orderTotal: orderRow.order_total,
          advanceAmount: orderRow.advance_amount,
          balanceOnDelivery: orderRow.balance_on_delivery,
          cartSnapshot,
          customer,
        },
        uploads,
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Failed to load order' })
    }
  })

  app.get(
    '/api/admin/orders/:orderId/files/:storedFilename',
    requireAdmin,
    (req, res) => {
      const orderId = req.params.orderId
      let storedFilename = req.params.storedFilename
      try {
        storedFilename = decodeURIComponent(storedFilename)
      } catch {
        return res.status(400).end()
      }
      if (!isValidOrderIdParam(orderId)) {
        return res.status(400).json({ error: 'Invalid order id' })
      }
      const base = path.basename(storedFilename)
      if (base !== storedFilename || base === '.' || base === '..') {
        return res.status(400).json({ error: 'Invalid filename' })
      }
      const dir = path.resolve(path.join(uploadRoot, orderId))
      const full = path.join(dir, base)
      const resolvedFile = path.resolve(full)
      const rel = path.relative(dir, resolvedFile)
      if (rel.startsWith('..') || path.isAbsolute(rel)) {
        return res.status(403).end()
      }
      if (!fs.existsSync(resolvedFile)) {
        return res.status(404).end()
      }
      res.sendFile(resolvedFile)
    },
  )
}
