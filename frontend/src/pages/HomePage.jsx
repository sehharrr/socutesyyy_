import { HeroBanner } from '../components/HeroBanner'
import { ProductCarouselSection } from '../components/ProductCarouselSection'
import { SiteFooter } from '../components/SiteFooter'
import { categories } from '../utils/products'

export default function HomePage() {
  return (
    <div id="products-top">
      <HeroBanner />
      {categories.map((c) => (
        <ProductCarouselSection
          key={c.id}
          categoryId={c.id}
          title={c.title}
          showBow={c.showBow}
        />
      ))}
      <SiteFooter />
    </div>
  )
}
