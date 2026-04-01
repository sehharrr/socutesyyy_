import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getMinPrice, defaultSelection, getPrice, getSelectionSummary } from '../utils/pricing'
import { useCart } from '../context/CartContext'
import { IconCartPlus } from './icons'

/**
 * Homepage / carousel card: name, starting price, links to product detail.
 */
export function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart()
  const { name, image, imageAlt, slug, featured } = product
  const from = getMinPrice(product)

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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      className="w-[min(100%,280px)] shrink-0 snap-start"
    >
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-[#fce7f3] bg-white shadow-md shadow-pink-100/50 transition duration-300 ease-out hover:scale-[1.02] hover:shadow-xl hover:shadow-rose-200/70">
        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-gradient-to-br from-[#fdf2f8] to-[#fff5f7]">
          <Link
            to={`/product/${slug}`}
            className="block h-full w-full focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f9a8d4]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <img
              src={image}
              alt={imageAlt ?? name}
              className="h-full w-full object-cover object-center transition duration-300 hover:brightness-[1.02]"
              loading="lazy"
              decoding="async"
            />
          </Link>
          {featured && (
            <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-[#ff8fa3] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              Customize
            </span>
          )}
          <button
            type="button"
            onClick={handleAddToCart}
            className="absolute bottom-2.5 right-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#fce7f3] bg-white/95 text-[#db2777] shadow-md shadow-pink-100/80 backdrop-blur-sm transition hover:bg-[#fdf2f8] hover:text-[#be185d] active:scale-95"
            aria-label={`Add ${name} to cart`}
          >
            <IconCartPlus className="h-5 w-5" />
          </button>
        </div>

        <Link
          to={`/product/${slug}`}
          className="group flex min-h-[7.5rem] flex-1 flex-col p-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f9a8d4]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-[#831843]">
            {name}
          </h3>
          <p className="mb-1 text-xs font-medium text-[#9d174d]/80">
            Starting from{' '}
            <span className="font-semibold tabular-nums text-[#831843]">
              RS. {from.toLocaleString()}
            </span>
          </p>
          <span className="mt-auto pt-2 text-xs font-semibold text-[#db2777] transition group-hover:text-[#be185d]">
            View options →
          </span>
        </Link>
      </div>
    </motion.article>
  )
}
