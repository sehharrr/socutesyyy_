import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Add your Q&As here — { q: string, a: string }
 * @type {{ q: string, a: string }[]}
 */
export const faqs = [
  {
    q: 'Payment method',
    a: 'Payment is completely online. We take 50% advance payment and the remaining 50% once you receive your order.',
  },
  {
    q: 'Delivery time',
    a: 'Delivery usually takes 4–7 working days. Delivery charges are fixed according to courier services.',
  },
  {
    q: 'About our magazines',
    a: 'Our magazines are A4 sized and available in two paper types: soft and hard. The difference is in the texture and thickness of the paper.',
  },
  {
    q: 'About our albums',
    a: 'Our albums are A5 sized and fully customizable. You can personalize them however you like.',
  },
  {
    q: 'Picture privacy',
    a: 'Your privacy is our priority. All pictures are deleted right after your order is completed. Plus, SoCutesy is girl-owned and handled with care.',
  },
  {
    q: 'Refund policy',
    a: 'Once your order is confirmed, refunds are not available.',
  },
]

function FaqItem({ item, open, onToggle }) {
  return (
    <div className="rounded-[24px] border border-[#f5d0e6]/90 bg-white/90 shadow-sm shadow-pink-100/40">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
        aria-expanded={open}
      >
        <span className="font-display text-base font-semibold text-[#831843] sm:text-lg">
          {item.q}
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FCECEF] text-lg font-medium text-[#D96B8C] transition ${
            open ? 'rotate-45' : ''
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="border-t border-[#fce7f3] px-5 pb-5 pt-3 text-sm leading-relaxed text-[#4b5563] sm:px-6 sm:pb-6 sm:text-[15px]">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  if (!faqs.length) return null

  return (
    <section
      id="faqs"
      className="border-t border-[#f3f4f6] bg-gradient-to-b from-white to-[#FCECEF]/50 px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-[900px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          className="mb-10 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D96B8C]">
            Help
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-[#831843] sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#6b7280]">
            Quick answers about ordering, delivery, and custom gifts.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FaqItem
              key={`${i}-${item.q}`}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex((prev) => (prev === i ? -1 : i))}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
