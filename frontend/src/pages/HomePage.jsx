import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { HeroBanner } from '../components/HeroBanner'
import { ProductCarouselSection } from '../components/ProductCarouselSection'
import { FaqSection } from '../components/FaqSection'
import { SiteFooter } from '../components/SiteFooter'
import { categories } from '../utils/products'

export default function HomePage() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash !== '#faqs') return
    const el = document.getElementById('faqs')
    if (!el) return
    const t = setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => clearTimeout(t)
  }, [location.hash])

  return (
    <div>
      <HeroBanner />
      <div id="products-top">
        {categories.map((c) => (
          <ProductCarouselSection
            key={c.id}
            categoryId={c.id}
            title={c.title}
          />
        ))}
      </div>
      <FaqSection />
      <SiteFooter />
    </div>
  )
}
