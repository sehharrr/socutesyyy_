import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProductBySlug } from '../utils/products'
import { BowIcon } from '../components/BowIcon'

/**
 * Placeholder until Fabric editor is wired per product.
 */
export default function CustomizePlaceholder() {
  const { productId } = useParams()
  const product = getProductBySlug(productId)

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-3xl border border-[#e5e7eb] bg-white p-8 shadow-sm"
      >
        <p className="flex justify-center text-4xl" aria-hidden>
          <BowIcon className="h-14 w-16" />
        </p>
        <h1 className="font-logo mt-4 text-2xl font-semibold tracking-wide text-[#111827]">
          {product?.name ?? 'Product'}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#4b5563]">
          The live canvas editor is coming next for this item. You can still add
          it to your cart from the shop and order on WhatsApp.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-2xl bg-[#ff8fa3] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ff7a91]"
        >
          Back to shop
        </Link>
      </motion.div>
    </main>
  )
}
