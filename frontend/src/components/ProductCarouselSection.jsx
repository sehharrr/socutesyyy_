import { useRef, useMemo } from 'react'
import { ProductCard } from './ProductCard'
import { IconChevronLeft, IconChevronRight } from './icons'
import { useShop } from '../context/ShopContext'
import { getProductsByCategory } from '../utils/products'

export function ProductCarouselSection({ categoryId, title, showBow }) {
  const { searchQuery, categoryFilter } = useShop()
  const scrollRef = useRef(null)

  const products = useMemo(() => {
    let list = getProductsByCategory(categoryId)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    if (categoryFilter && categoryFilter !== categoryId) return []
    return list
  }, [categoryId, searchQuery, categoryFilter])

  if (products.length === 0) return null

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <section
      id={`section-${categoryId}`}
      className="border-b border-[#f3f4f6] bg-white py-10 sm:py-14"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-8 font-semibold text-2xl text-[#111827] sm:text-3xl">
          {title}
          {showBow ? (
            <span className="ml-2 inline-block" aria-hidden>
              🎀
            </span>
          ) : null}
        </h2>

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#6b7280] shadow-md transition hover:bg-[#f9fafb] md:flex"
            aria-label="Scroll left"
          >
            <IconChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#6b7280] shadow-md transition hover:bg-[#f9fafb] md:flex"
            aria-label="Scroll right"
          >
            <IconChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scrollRef}
            className="scrollbar-hide flex gap-5 overflow-x-auto pb-2 pl-0 pr-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] md:px-12 [&::-webkit-scrollbar]:hidden"
          >
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
