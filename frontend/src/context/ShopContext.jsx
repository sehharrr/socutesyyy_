import { createContext, useContext, useMemo, useState } from 'react'

const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(null)

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      categoryFilter,
      setCategoryFilter,
    }),
    [searchQuery, categoryFilter],
  )

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  )
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used within ShopProvider')
  return ctx
}
