import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProductBySlug } from '../utils/products'
import {
  UPLOAD_PRODUCT_SLUGS,
  getUploadPhotoRequirements,
  getOrderTotalAmount,
  splitAdvancePayment,
} from '../utils/orderFlow'
import {
  defaultSelection,
  getPrice,
  getSelectionSummary,
} from '../utils/pricing'
import { CustomerForm } from '../components/CustomerForm'
import { useOrderFlow } from '../context/OrderFlowContext'
import { createOrder, uploadOrderPhotos } from '../api/ordersApi'

export default function CustomerFormPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isCartCheckout = location.pathname === '/checkout/customer'
  const product = isCartCheckout ? null : getProductBySlug(slug)
  const {
    files,
    customer,
    setCustomer,
    setOrderMeta,
    setCheckoutFromCart,
    checkoutSource,
    cartSnapshot,
    productName,
    unitPrice,
    orderQty,
    selectionSummary,
    setServerOrderId,
  } = useOrderFlow()
  const [saveError, setSaveError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isCartCheckout) return
    const fromNav = location.state?.cartItems
    if (Array.isArray(fromNav) && fromNav.length && checkoutSource !== 'cart') {
      setCheckoutFromCart(fromNav)
    }
  }, [isCartCheckout, location.state, checkoutSource, setCheckoutFromCart])

  useEffect(() => {
    if (isCartCheckout) {
      if (checkoutSource === 'cart' && cartSnapshot?.length) return
      if (location.state?.cartItems?.length) return
      navigate('/', { replace: true })
      return
    }
    if (!product) {
      navigate('/', { replace: true })
    }
  }, [isCartCheckout, checkoutSource, cartSnapshot, location.state, product, navigate])

  useEffect(() => {
    if (isCartCheckout || !product) return
    const st = location.state
    if (st?.price != null && st?.summary != null) {
      setOrderMeta({
        slug: product.slug,
        name: product.name,
        price: st.price,
        summary: st.summary,
        quantity: st.quantity ?? 1,
      })
      return
    }
    if (UPLOAD_PRODUCT_SLUGS.has(slug)) return
    const sel = defaultSelection(product)
    setOrderMeta({
      slug: product.slug,
      name: product.name,
      price: getPrice(product, sel),
      summary: getSelectionSummary(product, sel),
      quantity: 1,
    })
  }, [isCartCheckout, product, slug, location.state, setOrderMeta])

  useEffect(() => {
    if (isCartCheckout || !product || !UPLOAD_PRODUCT_SLUGS.has(slug)) return
    if (files.length === 0) {
      navigate(`/order/${slug}/upload`, { replace: true })
    }
  }, [isCartCheckout, product, slug, files.length, navigate])

  if (isCartCheckout) {
    if (checkoutSource !== 'cart' || !cartSnapshot?.length) return null
  } else if (!product) {
    return null
  }

  const handleSubmit = async (data) => {
    setSaveError(null)
    setSaving(true)
    try {
      if (!isCartCheckout && slug && UPLOAD_PRODUCT_SLUGS.has(slug)) {
        const qty = Math.max(1, orderQty || 1)
        const { min, max } = getUploadPhotoRequirements(slug, qty)
        if (min != null && files.length < min) {
          setSaveError(`Please upload at least ${min} pictures for this product.`)
          setSaving(false)
          return
        }
        if (max != null && files.length > max) {
          setSaveError(`Please upload at most ${max} pictures for this product.`)
          setSaving(false)
          return
        }
      }

      const includeDelivery = data.includeDelivery !== false
      const qty = Math.max(1, orderQty || 1)
      const lineSubtotal = unitPrice * qty
      const orderTotal = getOrderTotalAmount(lineSubtotal, includeDelivery)
      const { advance, balanceOnDelivery } =
        splitAdvancePayment(orderTotal)

      const payload = {
        checkoutSource,
        slug: isCartCheckout ? 'checkout' : slug ?? null,
        productName,
        unitPrice,
        orderQty: qty,
        selectionSummary,
        cartSnapshot:
          checkoutSource === 'cart' ? cartSnapshot : null,
        customer: data,
        includeDelivery,
        orderTotal,
        advanceAmount: advance,
        balanceOnDelivery,
      }

      const { id } = await createOrder(payload)
      await uploadOrderPhotos(id, files)
      setCustomer(data)
      setServerOrderId(id)
      if (isCartCheckout) {
        navigate('/checkout/payment')
        return
      }
      navigate(`/order/${slug}/payment`)
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Could not save your order'
      setSaveError(msg)
    } finally {
      setSaving(false)
    }
  }

  const isUploadFlow = !isCartCheckout && product && UPLOAD_PRODUCT_SLUGS.has(slug)

  const backHref = isCartCheckout
    ? '/'
    : isUploadFlow
      ? `/order/${slug}/upload`
      : `/product/${slug}`

  const backLabel = isCartCheckout
    ? '← Back to shop'
    : isUploadFlow
      ? '← Back to upload'
      : '← Back to product'

  const headingContext = isCartCheckout
    ? 'your cart order'
    : product.name

  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-[#FCECEF]/60 via-white to-white px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-2xl">
        <Link
          to={backHref}
          className="mb-6 inline-flex text-sm font-medium text-[#9d174d] transition hover:text-[#831843]"
        >
          {backLabel}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-[2rem] border border-[#f5d0e6]/80 bg-white shadow-xl shadow-pink-100/50"
        >
          <div className="bg-gradient-to-r from-[#be3d6a] to-[#d1567f] px-6 py-6 sm:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
              Step 1 of 2
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">
              Your details
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/90">
              We need this to confirm{' '}
              <span className="font-semibold text-white">{headingContext}</span>.
            </p>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            {saveError && (
              <p
                className="mb-5 rounded-2xl border border-[#fecaca] bg-[#fef2f8] px-4 py-3 text-sm text-[#b91c1c]"
                role="alert"
              >
                {saveError}
              </p>
            )}
            <CustomerForm
              defaultValues={customer ?? undefined}
              onSubmit={handleSubmit}
              submitLabel="Proceed to payment"
              isSubmitting={saving}
            />
          </div>
        </motion.div>
      </div>
    </main>
  )
}
