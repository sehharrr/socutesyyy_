import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const dataDir = process.env.DATA_DIR?.trim()
const dbPath =
  process.env.SQLITE_PATH?.trim() ||
  (dataDir
    ? path.join(dataDir, 'socutesy.db')
    : path.join(__dirname, '..', 'data', 'socutesy.db'))

/** @type {import('sql.js').Database | null} */
let db = null

export async function initDb() {
  const SQL = await initSqlJs()
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath)
    db = new SQL.Database(fileBuffer)
  } else {
    db = new SQL.Database()
  }

  db.run('PRAGMA foreign_keys = ON;')

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      checkout_source TEXT NOT NULL,
      slug TEXT,
      product_name TEXT NOT NULL,
      unit_price REAL NOT NULL,
      order_qty INTEGER NOT NULL,
      selection_summary TEXT,
      cart_snapshot_json TEXT,
      customer_json TEXT NOT NULL,
      include_delivery INTEGER NOT NULL,
      order_total REAL NOT NULL,
      advance_amount REAL NOT NULL,
      balance_on_delivery REAL NOT NULL
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS order_uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      original_name TEXT NOT NULL,
      stored_filename TEXT NOT NULL,
      mime_type TEXT,
      size_bytes INTEGER
    );
  `)

  db.run(
    `CREATE INDEX IF NOT EXISTS idx_order_uploads_order ON order_uploads(order_id);`,
  )

  persist()
}

export function persist() {
  if (!db) return
  const data = db.export()
  fs.writeFileSync(dbPath, Buffer.from(data))
}

export function getDb() {
  if (!db) throw new Error('Database not initialized')
  return db
}
