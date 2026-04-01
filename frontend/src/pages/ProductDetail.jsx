import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProductBySlug } from '../utils/products'
import {
  clampSideIndex,
  defaultSelection,
  getPrice,
  getSelectionSummary,
} from '../utils/pricing'
import { PriceDisplay } from '../components/PriceDisplay'
import { ShopSelect } from '../components/ShopSelect'
import { useCart } from '../context/CartContext'
import { getOrderFlowType } from '../utils/orderFlow'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product = getProductBySlug(slug)
  const { addToCart } = useCart()

  const [selection, setSelection] = useState(() =>
    product ? defaultSelection(product) : { kind: 'simple' },
  )
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (product) setSelection(defaultSelection(product))
  }, [slug, product])

  useEffect(() => {
    setActiveImageIndex(0)
    setLightboxOpen(false)
    setQuantity(1)
  }, [slug])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [lightboxOpen])

  const price = useMemo(
    () => (product ? getPrice(product, selection) : 0),
    [product, selection],
  )

  const summary = useMemo(
    () => (product ? getSelectionSummary(product, selection) : ''),
    [product, selection],
  )

  const galleryImages = useMemo(() => {
    if (!product) return []
    if (product.sharedVariantGallery?.length) {
      return product.sharedVariantGallery
    }
    if (product.variants?.length && product.variants[0]?.image) {
      if (
        selection.kind === 'variants' &&
        product.variants[selection.index]?.images?.length
      ) {
        return product.variants[selection.index].images
      }
      return product.variants.map((v) => v.image)
    }
    if (product.images?.length > 0) return product.images
    return [product.image]
  }, [product, selection])

  const syncThumbnailToVariant =
    Boolean(product?.variants?.[0]?.image) &&
    (!product?.variants?.[0]?.images?.length ||
      Boolean(product.sharedVariantGallery?.length))

  if (!product) {
    return (
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-[#6b7280]">Product not found.</p>
        <Link to="/" className="mt-4 inline-block font-medium text-[#db2777]">
          ← Back to shop
        </Link>
      </main>
    )
  }

  const hasPaperOptions = Boolean(product.options?.length)
  const hasFlatVariants = Boolean(product.variants?.length)

  const onPaperSelect = (paperIndex) => {
    setSelection((prev) => {
      if (prev.kind !== 'options') return prev
      const sideIndex = clampSideIndex(product, paperIndex, prev.sideIndex)
      return { kind: 'options', paperIndex, sideIndex }
    })
  }

  const onSidesSelect = (sideIndex) => {
    setSelection((prev) => {
      if (prev.kind !== 'options') return prev
      return { ...prev, sideIndex }
    })
  }

  const onVariantSelect = (index) => {
    setSelection({ kind: 'variants', index })
    const v = product.variants[index]
    if (product.sharedVariantGallery?.length) {
      setActiveImageIndex(index)
    } else if (v?.images?.length) {
      setActiveImageIndex(0)
    } else if (product.variants?.[0]?.image) {
      setActiveImageIndex(index)
    }
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      unitPrice: price,
      summary,
      qty: quantity,
    })
  }

  const handlePlaceOrder = () => {
    const state = { price, summary, quantity }
    if (getOrderFlowType(product.slug) === 'upload') {
      navigate(`/order/${product.slug}/upload`, { state })
      return
    }
    navigate(`/order/${product.slug}/customer`, { state })
  }

  const variantOptionLabel = (v) => {
    if (v.label) return v.label
    if (v.size != null) return v.size
    if (v.sides != null) return `${v.sides} sides`
    return 'Option'
  }

  const v0 = product.variants?.[0]
  const variantGroupLabel =
    product.variantSelectLabel ??
    (v0?.size != null ? 'Size' : v0?.sides != null ? 'Sides' : 'Option')

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
      <Link
        to="/"
        className="mb-6 inline-flex text-sm font-medium text-[#9d174d] hover:text-[#831843]"
      >
        ← Back to shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-[#fce7f3] bg-gradient-to-br from-[#fdf2f8] to-[#fff5f7] shadow-lg shadow-pink-100/60"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="group relative block w-full cursor-zoom-in p-0 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f472b6]/50 focus-visible:ring-offset-2"
            aria-label="View full image"
          >
            <img
              src={galleryImages[activeImageIndex]}
              alt={product.imageAlt ?? product.name}
              className="aspect-square w-full object-cover transition group-hover:brightness-[1.02]"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white opacity-0 shadow-sm transition group-hover:opacity-100 sm:text-xs">
              Full size
            </span>
          </button>
          {galleryImages.length > 1 && (
            <div className="flex gap-2 border-t border-[#fce7f3] bg-white/80 p-3">
              {galleryImages.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(i)
                    if (
                      syncThumbnailToVariant &&
                      selection.kind === 'variants'
                    ) {
                      setSelection({ kind: 'variants', index: i })
                    }
                  }}
                  className={`relative shrink-0 overflow-hidden rounded-xl ring-2 ring-offset-2 transition ${
                    activeImageIndex === i
                      ? 'ring-[#f472b6]'
                      : 'ring-transparent opacity-80 hover:opacity-100'
                  }`}
                  aria-label={`View photo ${i + 1}`}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-16 w-16 object-cover sm:h-20 sm:w-20"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-col"
        >
          <h1 className="font-semibold text-2xl text-[#831843] sm:text-3xl">
            {product.name}
          </h1>

          {product.description && (
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-[#6b7280] sm:text-[15px] sm:leading-relaxed">
              {product.description}
            </p>
          )}

          {product.detailBullets?.length > 0 && (
            <div className="mt-5 rounded-2xl border border-[#fce7f3] bg-[#fffafc]/90 px-4 py-3.5 sm:px-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#be185d]">
                Details
              </p>
              <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-[#4b5563] marker:text-[#f472b6] sm:text-sm sm:leading-relaxed">
                {product.detailBullets.map((line, i) => (
                  <li key={`${i}-${line}`}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 space-y-5 rounded-2xl border border-[#fce7f3] bg-[#fffafc] p-5 shadow-inner shadow-pink-100/40">
            {hasPaperOptions && selection.kind === 'options' && (
              <>
                <label className="block text-sm font-semibold text-[#9d174d]">
                  Paper type
                  <ShopSelect
                    value={selection.paperIndex}
                    options={product.options.map((opt) => opt.type)}
                    onChange={onPaperSelect}
                  />
                </label>
                <label className="block text-sm font-semibold text-[#9d174d]">
                  Sides
                  <ShopSelect
                    value={selection.sideIndex}
                    options={product.options[selection.paperIndex].variants.map(
                      (v) => `${v.sides} sides`,
                    )}
                    onChange={onSidesSelect}
                  />
                </label>
              </>
            )}

            {hasFlatVariants && selection.kind === 'variants' && (
                <label className="block text-sm font-semibold text-[#9d174d]">
                {variantGroupLabel}
                <ShopSelect
                  value={selection.index}
                  options={product.variants.map((v) => variantOptionLabel(v))}
                  onChange={onVariantSelect}
                />
              </label>
            )}

            <div className="border-t border-[#fce7f3] pt-5">
              <p className="text-sm font-semibold text-[#9d174d]">Quantity</p>
              <div className="mt-2 flex max-w-[12rem] items-center gap-1 rounded-2xl border border-[#fbcfe8] bg-white p-1 shadow-sm">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-semibold text-[#831843] transition hover:bg-[#fdf2f8] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="min-w-[2.5rem] flex-1 text-center text-base font-semibold tabular-nums text-[#831843]">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-semibold text-[#831843] transition hover:bg-[#fdf2f8] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={quantity >= 99}
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                >
                  +
                </button>
              </div>
              <div className="mt-4">
                <PriceDisplay amount={price} />
                <p className="mt-1 text-xs text-[#6b7280]">Price per item</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[#f472b6] to-[#ec4899] py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-300/40 transition hover:brightness-105 active:scale-[0.99]"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={handlePlaceOrder}
              className="flex flex-1 items-center justify-center rounded-2xl border-2 border-[#fbcfe8] bg-white py-3.5 text-center text-sm font-semibold text-[#db2777] shadow-sm transition hover:bg-[#fdf2f8]"
            >
              Place order
            </button>
          </div>
        </motion.div>
      </div>

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full size product image"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 p-4 sm:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close"
          >
            ×
          </button>
          <img
            src={galleryImages[activeImageIndex]}
            alt={product.imageAlt ?? product.name}
            className="max-h-[min(92vh,100%)] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  )
}
