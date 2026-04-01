import { Navigate, useParams, useLocation } from 'react-router-dom'
import { getProductBySlug } from '../utils/products'
import { UPLOAD_PRODUCT_SLUGS } from '../utils/orderFlow'

/** Legacy `/order/:slug/contact` — order flow uses customer → payment for all products. */
export default function ContactRedirect() {
  const { slug } = useParams()
  const location = useLocation()
  const product = getProductBySlug(slug)

  if (!product) {
    return <Navigate to="/" replace />
  }

  if (UPLOAD_PRODUCT_SLUGS.has(slug)) {
    return (
      <Navigate
        to={`/order/${slug}/upload`}
        replace
        state={location.state}
      />
    )
  }

  return (
    <Navigate
      to={`/order/${slug}/customer`}
      replace
      state={location.state}
    />
  )
}
