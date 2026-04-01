import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

/**
 * @typedef {{ file: File; previewUrl: string }} OrderFile
 * @typedef {{
 *   lineId: string
 *   productId: string
 *   name: string
 *   slug: string
 *   unitPrice: number
 *   summary: string
 *   qty: number
 * }} CartLineSnapshot
 * @typedef {{
 *   fullName: string
 *   phone: string
 *   city: string
 *   address: string
 *   notes: string
 *   includeDelivery: boolean
 * }} CustomerData
 */

const OrderFlowContext = createContext(null)

export function OrderFlowProvider({ children }) {
  /** 'product' = single product order; 'cart' = cart checkout snapshot */
  const [checkoutSource, setCheckoutSource] = useState('product')
  /** Set when checkoutSource === 'cart' (copy of cart lines at checkout start) */
  const [cartSnapshot, setCartSnapshot] = useState(null)
  const [slug, setSlug] = useState(null)
  const [productName, setProductName] = useState('')
  const [unitPrice, setUnitPrice] = useState(0)
  /** Units ordered (line quantity); subtotal = unitPrice × orderQty */
  const [orderQty, setOrderQty] = useState(1)
  const [selectionSummary, setSelectionSummary] = useState('')
  /** @type {[OrderFile[], function]} */
  const [files, setFiles] = useState([])
  /** @type {[CustomerData | null, function]} */
  const [customer, setCustomer] = useState(null)
  /** Set after order + uploads are persisted on the server (short order ref). */
  const [serverOrderId, setServerOrderId] = useState(null)

  const clearOrder = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => URL.revokeObjectURL(f.previewUrl))
      return []
    })
    setCheckoutSource('product')
    setCartSnapshot(null)
    setSlug(null)
    setProductName('')
    setUnitPrice(0)
    setOrderQty(1)
    setSelectionSummary('')
    setCustomer(null)
    setServerOrderId(null)
  }, [])

  const setCheckoutFromCart = useCallback((items) => {
    if (!items?.length) return
    const snapshot = items.map((i) => ({ ...i }))
    const subtotal = snapshot.reduce((s, i) => s + i.unitPrice * i.qty, 0)
    const nameLine = snapshot.map((i) => i.name).join(', ')
    setCheckoutSource('cart')
    setCartSnapshot(snapshot)
    setSlug('checkout')
    setProductName(nameLine)
    setUnitPrice(subtotal)
    setOrderQty(1)
    setSelectionSummary(
      snapshot.map((i) => `${i.name} ×${i.qty}`).join('; '),
    )
  }, [])

  const setOrderMeta = useCallback(
    ({ slug: s, name, price, summary, quantity }) => {
      setCheckoutSource('product')
      setCartSnapshot(null)
      setServerOrderId(null)
      setSlug(s)
      setProductName(name ?? '')
      setUnitPrice(typeof price === 'number' ? price : 0)
      setSelectionSummary(summary ?? '')
      const q = Math.max(1, Math.min(99, Math.floor(Number(quantity)) || 1))
      setOrderQty(q)
    },
    [],
  )

  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => URL.revokeObjectURL(f.previewUrl))
      return []
    })
  }, [])

  const addFiles = useCallback((fileList) => {
    const incoming = Array.from(fileList ?? [])
    setFiles((prev) => {
      const added = incoming.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }))
      return [...prev, ...added]
    })
  }, [])

  const removeFileAt = useCallback((index) => {
    setFiles((prev) => {
      const copy = [...prev]
      const [removed] = copy.splice(index, 1)
      if (removed) URL.revokeObjectURL(removed.previewUrl)
      return copy
    })
  }, [])

  const value = useMemo(
    () => ({
      checkoutSource,
      cartSnapshot,
      slug,
      productName,
      unitPrice,
      orderQty,
      selectionSummary,
      files,
      customer,
      serverOrderId,
      setCheckoutFromCart,
      setOrderMeta,
      clearFiles,
      addFiles,
      removeFileAt,
      setCustomer,
      setServerOrderId,
      clearOrder,
    }),
    [
      checkoutSource,
      cartSnapshot,
      slug,
      productName,
      unitPrice,
      orderQty,
      selectionSummary,
      files,
      customer,
      serverOrderId,
      setCheckoutFromCart,
      setOrderMeta,
      clearFiles,
      addFiles,
      removeFileAt,
      setCustomer,
      clearOrder,
    ],
  )

  return (
    <OrderFlowContext.Provider value={value}>
      {children}
    </OrderFlowContext.Provider>
  )
}

export function useOrderFlow() {
  const ctx = useContext(OrderFlowContext)
  if (!ctx) {
    throw new Error('useOrderFlow must be used within OrderFlowProvider')
  }
  return ctx
}
