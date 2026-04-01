import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { initDb, getDb, persist } from './db.js'
import { registerAdminRoutes } from './admin.js'
import { validateOrderTotals } from './validateOrderTotals.js'
import {
  generateShortOrderId,
  ORDER_ID_SCHEME,
  SHORT_ORDER_ID_RE,
} from './orderId.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT) || 3000
const dataDir = process.env.DATA_DIR?.trim()
const uploadRoot = process.env.UPLOAD_ROOT?.trim()
  ? path.resolve(process.env.UPLOAD_ROOT.trim())
  : dataDir
    ? path.join(dataDir, 'uploads')
    : path.join(__dirname, '..', 'uploads')
const MAX_FILE_MB = Number(process.env.UPLOAD_MAX_MB) || 15
const MAX_FILES = Number(process.env.UPLOAD_MAX_FILES) || 30

fs.mkdirSync(uploadRoot, { recursive: true })

const app = express()
app.set('trust proxy', 1)

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)

const orderCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: { error: 'Too many orders from this IP, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: { error: 'Too many uploads from this IP, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

const corsList = process.env.CORS_ORIGIN?.split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const corsOrigin = corsList?.length ? corsList : true
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(
  session({
    name: 'socutesy.sid',
    secret:
      process.env.SESSION_SECRET ||
      'socutesy-dev-only-change-SESSION_SECRET-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
)
app.use(express.json({ limit: '2mb' }))

registerAdminRoutes(app, { uploadRoot })

function validateOrderBody(body) {
  const errors = []
  if (!body || typeof body !== 'object') {
    return ['Invalid JSON body']
  }
  if (body.checkoutSource !== 'product' && body.checkoutSource !== 'cart') {
    errors.push('checkoutSource must be "product" or "cart"')
  }
  if (typeof body.productName !== 'string' || !body.productName.trim()) {
    errors.push('productName required')
  }
  if (typeof body.unitPrice !== 'number' || body.unitPrice < 0) {
    errors.push('unitPrice must be a non-negative number')
  }
  if (
    typeof body.orderQty !== 'number' ||
    body.orderQty < 1 ||
    body.orderQty > 99
  ) {
    errors.push('orderQty must be 1–99')
  }
  if (!body.customer || typeof body.customer !== 'object') {
    errors.push('customer object required')
  } else {
    const c = body.customer
    ;['fullName', 'phone', 'city', 'address'].forEach((k) => {
      if (typeof c[k] !== 'string' || !c[k].trim()) {
        errors.push(`customer.${k} required`)
      }
    })
  }
  if (typeof body.includeDelivery !== 'boolean') {
    errors.push('includeDelivery must be boolean')
  }
  if (typeof body.orderTotal !== 'number' || body.orderTotal < 0) {
    errors.push('orderTotal must be a non-negative number')
  }
  if (typeof body.advanceAmount !== 'number' || body.advanceAmount < 0) {
    errors.push('advanceAmount must be a non-negative number')
  }
  if (
    typeof body.balanceOnDelivery !== 'number' ||
    body.balanceOnDelivery < 0
  ) {
    errors.push('balanceOnDelivery must be a non-negative number')
  }
  return errors
}

function orderExists(id) {
  const db = getDb()
  const stmt = db.prepare('SELECT 1 FROM orders WHERE id = ? LIMIT 1')
  stmt.bind([id])
  const ok = stmt.step()
  stmt.free()
  return ok
}

function allocateOrderId() {
  for (let i = 0; i < 50; i++) {
    const id = generateShortOrderId()
    if (!orderExists(id)) return id
  }
  throw new Error('Could not allocate unique order id')
}

function deleteOrderAndFiles(orderId) {
  const dir = path.join(uploadRoot, orderId)
  try {
    fs.rmSync(dir, { recursive: true, force: true })
  } catch {
    /* ignore */
  }
  const db = getDb()
  db.run('DELETE FROM orders WHERE id = ?', [orderId])
  persist()
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, orderIdScheme: ORDER_ID_SCHEME })
})

app.post('/api/orders', orderCreateLimiter, (req, res) => {
  const err = validateOrderBody(req.body)
  if (err.length) {
    return res.status(400).json({ error: err.join('; ') })
  }
  const totalErr = validateOrderTotals(req.body)
  if (totalErr) {
    return res.status(400).json({ error: totalErr })
  }

  let id
  try {
    id = allocateOrderId()
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Could not create order id' })
  }
  const created_at = new Date().toISOString()
  const {
    checkoutSource,
    slug,
    productName,
    unitPrice,
    orderQty,
    selectionSummary,
    cartSnapshot,
    customer,
    includeDelivery,
    orderTotal,
    advanceAmount,
    balanceOnDelivery,
  } = req.body

  let cart_snapshot_json = null
  if (cartSnapshot != null) {
    try {
      cart_snapshot_json = JSON.stringify(cartSnapshot)
    } catch {
      return res.status(400).json({ error: 'cartSnapshot must be JSON-serializable' })
    }
  }

  try {
    const db = getDb()
    db.run(
      `INSERT INTO orders (
        id, created_at, checkout_source, slug, product_name, unit_price, order_qty,
        selection_summary, cart_snapshot_json, customer_json, include_delivery,
        order_total, advance_amount, balance_on_delivery
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        created_at,
        checkoutSource,
        typeof slug === 'string' ? slug : null,
        productName.trim(),
        unitPrice,
        Math.floor(orderQty),
        typeof selectionSummary === 'string' ? selectionSummary : '',
        cart_snapshot_json,
        JSON.stringify(customer),
        includeDelivery ? 1 : 0,
        orderTotal,
        advanceAmount,
        balanceOnDelivery,
      ],
    )
    persist()
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Failed to save order' })
  }

  if (!SHORT_ORDER_ID_RE.test(id)) {
    console.error('[orders] internal error: id is not short format:', id)
    return res.status(500).json({ error: 'Internal order id error' })
  }

  res.status(201).json({ id })
})

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const orderId = req.params.id
    const dir = path.join(uploadRoot, orderId)
    fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ''
    const base = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
    cb(null, base)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_MB * 1024 * 1024,
    files: MAX_FILES,
  },
})

app.post(
  '/api/orders/:id/uploads',
  uploadLimiter,
  upload.array('photos', MAX_FILES),
  (req, res) => {
    const orderId = req.params.id
    if (!orderExists(orderId)) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const files = req.files
    if (!files?.length) {
      return res.status(400).json({ error: 'No files (use field name "photos")' })
    }

    const db = getDb()
    try {
      db.run('BEGIN')
      for (const f of files) {
        db.run(
          `INSERT INTO order_uploads (order_id, original_name, stored_filename, mime_type, size_bytes)
           VALUES (?, ?, ?, ?, ?)`,
          [
            orderId,
            f.originalname || 'unknown',
            f.filename,
            f.mimetype || null,
            f.size ?? null,
          ],
        )
      }
      db.run('COMMIT')
      persist()
    } catch (e) {
      console.error(e)
      try {
        db.run('ROLLBACK')
      } catch {
        /* ignore */
      }
      deleteOrderAndFiles(orderId)
      return res.status(500).json({ error: 'Failed to record uploads' })
    }

    res.json({ ok: true, count: files.length })
  },
)

/** Multer / body-parser errors */
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: `File too large (max ${MAX_FILE_MB} MB)` })
    }
    if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Too many files' })
    }
    return res.status(400).json({ error: err.message || 'Upload error' })
  }
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body too large' })
  }
  next(err)
})

app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) return next()
  res.status(404).json({ error: 'Not found' })
})

const staticDir = process.env.STATIC_DIR?.trim()
if (staticDir) {
  const abs = path.resolve(staticDir)
  if (fs.existsSync(abs)) {
    app.use(express.static(abs))
    app.get(/^(?!\/api).*/, (req, res, next) => {
      if (req.method !== 'GET') return next()
      if (req.path.includes('.') && !req.path.endsWith('.html')) {
        return res.status(404).end()
      }
      res.sendFile(path.join(abs, 'index.html'), (e) => {
        if (e) next(e)
      })
    })
    console.log(`Serving static files from ${abs}`)
  } else {
    console.warn(`STATIC_DIR set but path does not exist: ${abs}`)
  }
}

app.use((err, _req, res, _next) => {
  console.error(err)
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

await initDb()
app.listen(PORT, () => {
  console.log(`SoCutesy API listening on http://localhost:${PORT}`)
})
