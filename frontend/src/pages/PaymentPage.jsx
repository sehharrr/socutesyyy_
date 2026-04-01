import { useEffect } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProductBySlug } from '../utils/products'
import {
  buildOrderWhatsAppMessage,
  DELIVERY_CHARGE_RS,
  getOrderTotalAmount,
  splitAdvancePayment,
} from '../utils/orderFlow'
import { whatsappLink } from '../utils/whatsapp'
import { useOrderFlow } from '../context/OrderFlowContext'
import { formatOrderRef } from '../utils/formatOrderRef'
import { useCart } from '../context/CartContext'

/** JazzCash / Easypaisa — same mobile account for both */
const PAYMENT_DETAILS = [
  { label: 'JazzCash / Easypaisa', value: 'Send to this number for either wallet' },
  { label: 'Account number', value: '03227784397' },
  { label: 'Account name', value: 'Sahar Naseer' },
]

export default function PaymentPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isCartCheckout = location.pathname === '/checkout/payment'
  const product = !isCartCheckout && slug ? getProductBySlug(slug) : null
  const { clearCart } = useCart()
  const {
    productName,
    unitPrice,
    orderQty,
    checkoutSource,
    cartSnapshot,
    customer,
    serverOrderId,
    clearOrder,
  } = useOrderFlow()

  useEffect(() => {
    if (isCartCheckout) {
      if (checkoutSource !== 'cart' || !cartSnapshot?.length) {
        navigate('/', { replace: true })
      }
      return
    }
    if (!product) {
      navigate('/', { replace: true })
    }
  }, [isCartCheckout, checkoutSource, cartSnapshot, product, navigate])

  useEffect(() => {
    if (isCartCheckout) {
      if (!customer) {
        navigate('/checkout/customer', { replace: true })
      }
      return
    }
    if (!product) return
    if (!customer) {
      navigate(`/order/${slug}/customer`, { replace: true })
    }
  }, [isCartCheckout, product, slug, customer, navigate])

  const ready =
    customer &&
    (isCartCheckout
      ? checkoutSource === 'cart' && cartSnapshot?.length
      : Boolean(product))
  if (!ready || !customer) return null

  const includeDelivery = customer.includeDelivery !== false
  const qty = Math.max(1, orderQty || 1)
  const lineSubtotal = unitPrice * qty
  const orderTotal = getOrderTotalAmount(lineSubtotal, includeDelivery)
  const { advance, balanceOnDelivery } = splitAdvancePayment(orderTotal)

  const openWhatsApp = () => {
    const text = buildOrderWhatsAppMessage({
      productName,
      unitPrice,
      quantity: qty,
      includeDelivery,
      customer,
      orderRef: serverOrderId ? formatOrderRef(serverOrderId) : null,
    })
    window.open(whatsappLink(text), '_blank', 'noopener,noreferrer')
    if (isCartCheckout) {
      clearCart()
    }
    clearOrder()
    navigate('/')
  }

  const customerPath = isCartCheckout ? '/checkout/customer' : `/order/${slug}/customer`

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:py-14">
      <Link
        to={customerPath}
        className="mb-6 inline-flex text-sm font-medium text-[#9d174d] hover:text-[#831843]"
      >
        ← Back to details
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="rounded-3xl border border-[#fce7f3] bg-[#fffafc] p-6 shadow-inner shadow-pink-100/40 sm:p-8">
          <h1 className="font-semibold text-2xl text-[#831843] sm:text-3xl">
            Advance payment
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#4b5563] sm:text-base">
            Pay <span className="font-semibold text-[#9d174d]">50% now</span> to confirm
            your order. Send your payment screenshot on WhatsApp when done 💌
          </p>
          {serverOrderId && (
            <p className="mt-3 rounded-2xl border border-[#fbcfe8] bg-white/90 px-4 py-2 text-xs text-[#6b7280]">
              <span className="font-semibold text-[#9d174d]">Order reference</span>{' '}
              <span className="font-mono tracking-wide text-[#374151]">
                {formatOrderRef(serverOrderId)}
              </span>
              <span className="mt-1 block text-[11px] text-[#9ca3af]">
                Saved in our system—use this ID on WhatsApp if we ask for it.
              </span>
            </p>
          )}
          <div className="mt-4 rounded-2xl border border-[#fbcfe8] bg-white/90 px-4 py-3 text-xs leading-relaxed text-[#4b5563] sm:text-sm">
            <p className="font-semibold text-[#9d174d]">How payment works</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 marker:text-[#f472b6]">
              <li>
                We take <strong className="font-semibold text-[#831843]">50% payment in advance</strong> for order confirmation.
              </li>
              <li>
                The <strong className="font-semibold text-[#831843]">remaining 50%</strong> is due{' '}
                <strong className="font-semibold text-[#831843]">when your order is delivered</strong>.
              </li>
              <li>
                Payment is <strong className="font-semibold text-[#831843]">fully online</strong> (JazzCash / Easypaisa as below). We{' '}
                <strong className="font-semibold text-[#831843]">do not offer cash on delivery</strong>.
              </li>
            </ul>
          </div>
          <div className="mt-4 space-y-2 rounded-2xl border border-[#fbcfe8] bg-white px-4 py-4 text-sm text-[#831843]">
            {isCartCheckout && cartSnapshot ? (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#be185d]">
                  Cart items
                </p>
                <ul className="space-y-2 border-b border-[#fce7f3] pb-3">
                  {cartSnapshot.map((line) => (
                    <li
                      key={line.lineId}
                      className="flex justify-between gap-4 text-xs sm:text-sm"
                    >
                      <span className="text-[#6b7280]">
                        {line.name}
                        {line.summary ? ` (${line.summary})` : ''} × {line.qty}
                      </span>
                      <span className="shrink-0 tabular-nums">
                        RS. {(line.unitPrice * line.qty).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between gap-4 font-medium">
                  <span className="text-[#6b7280]">Subtotal</span>
                  <span className="tabular-nums">RS. {lineSubtotal.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between gap-4">
                  <span className="text-[#6b7280]">
                    Subtotal{qty > 1 ? ` (${qty}×)` : ''}
                  </span>
                  <span className="font-medium tabular-nums">
                    RS. {lineSubtotal.toLocaleString()}
                  </span>
                </div>
                {qty > 1 && (
                  <div className="flex justify-between gap-4 text-xs text-[#9ca3af]">
                    <span>Unit price</span>
                    <span className="tabular-nums">
                      RS. {unitPrice.toLocaleString()} each
                    </span>
                  </div>
                )}
              </>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-[#6b7280]">Delivery</span>
              <span className="font-medium tabular-nums">
                {includeDelivery
                  ? `RS. ${DELIVERY_CHARGE_RS.toLocaleString()}`
                  : '—'}
              </span>
            </div>
            <div className="border-t border-[#fce7f3] pt-2 flex justify-between gap-4 font-medium">
              <span className="text-[#6b7280]">Order total</span>
              <span className="tabular-nums text-[#831843]">
                RS. {orderTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-4 rounded-xl bg-[#fdf2f8] px-3 py-2 font-semibold">
              <span className="text-[#9d174d]">Pay now (50% advance)</span>
              <span className="tabular-nums text-[#9d174d]">
                RS. {advance.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-[#6b7280]">
              <span>Due on delivery (50%)</span>
              <span className="tabular-nums">
                RS. {balanceOnDelivery.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#fce7f3] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#be185d]">
            Payment options
          </h2>
          <p className="mt-2 text-xs text-[#6b7280]">
            Send the <span className="font-semibold text-[#831843]">50% advance</span> (RS.{' '}
            {advance.toLocaleString()}) to the account below.
          </p>
          <ul className="mt-4 space-y-3 text-sm text-[#374151]">
            {PAYMENT_DETAILS.map((row) => (
              <li
                key={row.label}
                className="flex flex-col gap-1 rounded-2xl bg-[#fdf2f8] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium text-[#9d174d]">{row.label}</span>
                <span className="font-mono text-xs text-[#6b7280] sm:text-right">
                  {row.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={openWhatsApp}
            className="rounded-2xl bg-gradient-to-r from-[#f472b6] to-[#ec4899] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-300/40 transition hover:brightness-105"
          >
            I have paid, continue to WhatsApp
          </button>
        </div>
      </motion.div>
    </main>
  )
}
