import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getMinPrice, hasFixedPrice, defaultSelection, getPrice, getSelectionSummary } from '../utils/pricing'
import { useCart } from '../context/CartContext'
import { IconCartPlus } from './icons'

/**
 * Homepage / carousel card: name, starting price, links to product detail.
 */
export function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart()
  const { name, image, imageAlt, slug, featured } = product
  const from = getMinPrice(product)
  const fixedPrice = hasFixedPrice(product)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const sel = defaultSelection(product)
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      unitPrice: getPrice(product, sel),
      summary: getSelectionSummary(product, sel),
      qty: 1,
    })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        delay: (index % 4) * 0.06,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group/card w-[min(100%,280px)] shrink-0 snap-start"
    >
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-[#fce7f3] bg-white shadow-sm shadow-pink-100/60 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#f9a8d4] hover:shadow-xl hover:shadow-rose-200/60">
        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-gradient-to-br from-[#fdf2f8] to-[#fff5f7]">
          <Link
            to={`/product/${slug}`}
            className="block h-full w-full focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f9a8d4]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <img
              src={image}
              alt={imageAlt ?? name}
              className="h-full w-full object-cover object-center transition duration-500 ease-out group-hover/card:scale-105"
              loading="lazy"
              decoding="async"
            />
          </Link>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
            aria-hidden
          />
          {featured && (
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-[#be3d6a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md shadow-pink-900/20">
              Customize
            </span>
          )}
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold tabular-nums text-[#831843] shadow-sm backdrop-blur-sm">
            {!fixedPrice && (
              <span className="mr-1 text-[10px] font-medium text-[#9d174d]/70">
                from
              </span>
            )}
            RS. {from.toLocaleString()}
          </span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 z-10 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full bg-[#be3d6a] text-white opacity-0 shadow-lg shadow-pink-900/20 transition-all duration-300 hover:bg-[#a8335b] active:scale-95 group-hover/card:translate-y-0 group-hover/card:opacity-100"
            aria-label={`Add ${name} to cart`}
          >
            <IconCartPlus className="h-5 w-5" />
          </button>
        </div>

        <Link
          to={`/product/${slug}`}
          className="group flex min-h-[6.5rem] flex-1 flex-col p-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f9a8d4]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-[#831843] transition-colors group-hover:text-[#be3d6a]">
            {name}
          </h3>
          <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-[#be3d6a]">
            Order now
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </Link>
      </div>
    </motion.article>
  )
}
