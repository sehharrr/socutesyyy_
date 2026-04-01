import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProductBySlug } from '../utils/products'
import { UPLOAD_PRODUCT_SLUGS } from '../utils/orderFlow'
import {
  defaultSelection,
  getPrice,
  getSelectionSummary,
} from '../utils/pricing'
import { CustomerForm } from '../components/CustomerForm'
import { useOrderFlow } from '../context/OrderFlowContext'
import { createOrder, uploadOrderPhotos } from '../api/ordersApi'
import {
  getOrderTotalAmount,
  splitAdvancePayment,
} from '../utils/orderFlow'

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
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:py-14">
      <Link
        to={backHref}
        className="mb-6 inline-flex text-sm font-medium text-[#9d174d] hover:text-[#831843]"
      >
        {backLabel}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-[#fce7f3] bg-[#fffafc] p-6 shadow-inner shadow-pink-100/40 sm:p-8"
      >
        <h1 className="font-semibold text-2xl text-[#831843] sm:text-3xl">
          Your details
        </h1>
        <p className="mt-2 text-sm text-[#6b7280]">
          We need this to confirm{' '}
          <span className="font-medium text-[#9d174d]">{headingContext}</span>.
        </p>

        <div className="mt-8">
          {saveError && (
            <p
              className="mb-4 rounded-2xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]"
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
    </main>
  )
}
