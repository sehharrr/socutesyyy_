import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GiftIcon } from './GiftIcon'

const MotionLink = motion.create(Link)
import { IconCart, IconMenu, IconClose } from './icons'
import { useCart } from '../context/CartContext'
import { useShop } from '../context/ShopContext'
import { categories } from '../utils/products'
import { useOrderFlow } from '../context/OrderFlowContext'

export function ShopHeader() {
  const { count } = useCart()
  const { categoryFilter, setCategoryFilter } = useShop()
  const navigate = useNavigate()
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const scrollToId = (id, top = false) => {
    setTimeout(() => {
      if (top) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 60)
  }

  const goHome = () => {
    setCategoryFilter(null)
    setMobileNavOpen(false)
    navigate('/')
    scrollToId(null, true)
  }

  const goShopAll = () => {
    setCategoryFilter(null)
    setMobileNavOpen(false)
    navigate('/')
    scrollToId('products-top')
  }

  const goCategory = (id) => {
    setCategoryFilter(id)
    setMobileNavOpen(false)
    navigate('/')
    scrollToId(`section-${id}`)
  }

  const navLinks = [
    { key: 'home', label: 'Home', onClick: goHome, active: false },
    {
      key: 'all',
      label: 'Shop All',
      onClick: goShopAll,
      active: categoryFilter == null,
    },
    ...categories.map((c) => ({
      key: c.id,
      label: c.title,
      onClick: () => goCategory(c.id),
      active: categoryFilter === c.id,
    })),
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-[#f5d0e6] bg-[#fdeef4]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <div className="flex min-w-0 shrink items-center gap-3 sm:gap-4">
          <MotionLink
            to="/"
            aria-label="socutesy gift shop — home"
            initial={false}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            onClick={() => setCategoryFilter(null)}
            className="group inline-flex h-12 w-fit max-w-full items-center gap-3 rounded-2xl bg-white/60 px-4 shadow-sm ring-1 ring-white/50 backdrop-blur-sm transition-[box-shadow,background-color] hover:bg-white/80 hover:shadow-md hover:ring-[#be3d6a]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#be3d6a] sm:gap-4 sm:px-5"
          >
            <motion.span
              className="inline-flex shrink-0"
              whileHover={{ rotate: [0, -10, 8, -6, 0] }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <GiftIcon className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
            </motion.span>
            <div className="min-w-0">
              <p className="truncate font-logo-wordmark text-xl lowercase leading-tight text-[#be3d6a] sm:text-2xl">
                socutesy
              </p>
              <p className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-[0.35em] text-[#c49aa8] transition-colors group-hover:text-[#be3d6a] sm:text-xs">
                GIFT SHOP
              </p>
            </div>
          </MotionLink>
        </div>

        <nav className="hidden flex-1 items-center justify-center lg:flex">
          <div className="flex items-center gap-1 rounded-full border border-white/60 bg-white/40 px-2 py-1.5 shadow-sm backdrop-blur-md">
            {navLinks.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  item.active
                    ? 'bg-[#be3d6a] text-white shadow-sm'
                    : 'text-[#831843] hover:bg-white/70'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setCartOpen((o) => !o)}
            className="relative flex h-12 items-center gap-2 rounded-xl bg-[#be3d6a] px-4 font-semibold text-white shadow-sm transition hover:bg-[#a8335b] hover:shadow-md active:scale-95"
          >
            <IconCart className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#111827] px-1 text-[10px] font-bold text-white"
                >
                  {count > 99 ? '99+' : count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            onClick={() => setMobileNavOpen((o) => !o)}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/60 bg-white/50 text-[#831843] shadow-sm backdrop-blur-sm transition hover:bg-white/80 active:scale-95 lg:hidden"
            aria-expanded={mobileNavOpen}
            aria-label="Menu"
          >
            {mobileNavOpen ? (
              <IconClose className="h-5 w-5" />
            ) : (
              <IconMenu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/50 lg:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
              {navLinks.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={item.onClick}
                  className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    item.active
                      ? 'bg-[#be3d6a] text-white shadow-sm'
                      : 'text-[#831843] hover:bg-white/70'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <CartPopover open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  )
}

function CartPopover({ open, onClose }) {
  const navigate = useNavigate()
  const { setCheckoutFromCart } = useOrderFlow()
  const { items, removeLine, updateLineQty } = useCart()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20"
            aria-label="Close cart"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed right-4 top-[5.5rem] z-50 max-h-[70vh] w-[min(100vw-2rem,22rem)] overflow-auto rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-xl sm:right-6"
          >
            <p className="font-semibold text-[#111827]">Your cart</p>
            {items.length === 0 ? (
              <p className="mt-4 text-sm text-[#6b7280]">No items yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {items.map((line) => (
                  <li
                    key={line.lineId}
                    className="flex items-start justify-between gap-2 border-b border-[#f3f4f6] pb-3 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[#111827]">{line.name}</p>
                      <p className="text-[#6b7280]">{line.summary}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-[#6b7280]">Qty</span>
                        <div className="inline-flex items-center rounded-lg border border-[#e5e7eb] bg-white">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            className="px-2 py-1 text-sm font-semibold text-[#374151] hover:bg-[#f9fafb] disabled:opacity-40"
                            disabled={line.qty <= 1}
                            onClick={() => updateLineQty(line.lineId, -1)}
                          >
                            −
                          </button>
                          <span className="min-w-[1.5rem] px-1 text-center text-sm font-semibold tabular-nums text-[#111827]">
                            {line.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            className="px-2 py-1 text-sm font-semibold text-[#374151] hover:bg-[#f9fafb] disabled:opacity-40"
                            disabled={line.qty >= 99}
                            onClick={() => updateLineQty(line.lineId, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-[#6b7280]">
                        RS. {line.unitPrice.toLocaleString()} × {line.qty} ={' '}
                        <span className="font-semibold tabular-nums text-[#831843]">
                          RS. {(line.unitPrice * line.qty).toLocaleString()}
                        </span>
                      </p>
                      <Link
                        to={`/product/${line.slug}`}
                        className="text-xs font-medium text-[#be3d6a]"
                        onClick={onClose}
                      >
                        View product
                      </Link>
                      <Link
                        to={`/customize/${line.slug}`}
                        className="ml-2 text-xs font-medium text-[#be3d6a]"
                        onClick={onClose}
                      >
                        Customize
                      </Link>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-[#9ca3af] hover:text-[#ef4444]"
                      onClick={() => removeLine(line.lineId)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              disabled={items.length === 0}
              className="mt-4 w-full rounded-xl bg-[#be3d6a] py-3 text-sm font-semibold text-white hover:bg-[#a8335b] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                if (items.length === 0) return
                setCheckoutFromCart(items)
                navigate('/checkout/customer', { state: { cartItems: items } })
                onClose()
              }}
            >
              Checkout
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
