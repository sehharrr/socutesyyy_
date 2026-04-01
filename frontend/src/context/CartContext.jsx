import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

function lineKey(productId, summary) {
  return `${productId}::${summary}`
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const clampQty = (n) =>
    Math.max(1, Math.min(99, Math.floor(Number(n)) || 1))

  const addToCart = useCallback(
    ({ productId, name, slug, unitPrice, summary, qty: addQty = 1 }) => {
      const key = lineKey(productId, summary)
      const q = clampQty(addQty)
      setItems((prev) => {
        const i = prev.findIndex((x) => x.lineId === key)
        if (i >= 0) {
          const next = [...prev]
          next[i] = {
            ...next[i],
            qty: clampQty(next[i].qty + q),
          }
          return next
        }
        return [
          ...prev,
          {
            lineId: key,
            productId,
            name,
            slug,
            unitPrice,
            summary,
            qty: q,
          },
        ]
      })
    },
    [],
  )

  const updateLineQty = useCallback((lineId, delta) => {
    setItems((prev) =>
      prev.map((x) => {
        if (x.lineId !== lineId) return x
        return { ...x, qty: clampQty(x.qty + delta) }
      }),
    )
  }, [])

  const removeLine = useCallback((lineId) => {
    setItems((prev) => prev.filter((x) => x.lineId !== lineId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const count = useMemo(
    () => items.reduce((s, x) => s + x.qty, 0),
    [items],
  )

  const value = useMemo(
    () => ({ items, addToCart, updateLineQty, removeLine, clearCart, count }),
    [items, addToCart, updateLineQty, removeLine, clearCart, count],
  )

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
