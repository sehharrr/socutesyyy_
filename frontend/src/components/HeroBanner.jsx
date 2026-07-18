import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const BG = '#FCECEF'
const PINK = '#D96B8C'
const PINK_SOFT = '#E89BB3'
const INK = '#1E1B3A'
const HEADING = '#831843'

const SLIDE_MS = 5000

const bestsellers = [
  'Custom Magazines',
  'Newspapers',
  'Mini Albums',
  'Polaroids',
  'Photo Booth Strips',
]

const mockupImages = [
  { src: '/images/magazine-1.png', label: 'Magazine', className: 'left-[4%] top-[8%] w-[38%] rotate-[-6deg]' },
  { src: '/images/newspaper-1.png', label: 'Newspaper', className: 'right-[6%] top-[4%] w-[36%] rotate-[5deg]' },
  { src: '/images/polaroids-1.png', label: 'Polaroids', className: 'left-[10%] bottom-[10%] w-[28%] rotate-[4deg]' },
  { src: '/images/keepsake-frame-1.png', label: 'Frame', className: 'right-[8%] bottom-[8%] w-[30%] rotate-[-4deg]' },
  { src: '/images/photobooth-strips-1.png', label: 'Strips', className: 'left-[42%] top-[28%] w-[18%] rotate-[8deg]' },
  { src: '/images/mini-album-1.png', label: 'Album', className: 'right-[36%] bottom-[18%] w-[24%] rotate-[-8deg]' },
]

const whyCards = [
  { title: 'Fully Personalized', icon: 'bow' },
  { title: 'Premium Printing', icon: 'sparkle' },
  { title: 'Pakistan Wide Delivery', icon: 'truck' },
  { title: 'Handmade with Love', icon: 'heart' },
]

function CtaLink({ children }) {
  return (
    <a
      href="#products-top"
      className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wide transition sm:text-base"
      style={{ color: PINK }}
    >
      {children}
      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
        →
      </span>
    </a>
  )
}

function FloatingDecor() {
  const items = [
    { type: 'heart', top: '12%', left: '8%', delay: 0, size: 18 },
    { type: 'star', top: '18%', right: '12%', delay: 0.4, size: 14 },
    { type: 'sparkle', top: '55%', left: '6%', delay: 0.8, size: 12 },
    { type: 'heart', bottom: '18%', right: '10%', delay: 1.2, size: 16 },
    { type: 'star', bottom: '12%', left: '16%', delay: 0.2, size: 20 },
    { type: 'sparkle', top: '40%', right: '7%', delay: 1.6, size: 10 },
    { type: 'heart', top: '70%', left: '48%', delay: 0.6, size: 12 },
  ]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((item, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            width: item.size,
            height: item.size,
            color: PINK_SOFT,
          }}
          animate={{ y: [0, -10, 0], opacity: [0.35, 0.7, 0.35] }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut',
          }}
        >
          {item.type === 'heart' && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          {item.type === 'star' && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
              <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
            </svg>
          )}
          {item.type === 'sparkle' && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
              <path d="M12 2l1.2 6.3L19 10l-5.8 1.7L12 18l-1.2-6.3L5 10l5.8-1.7L12 2zm7 11l.7 3.3L23 17l-3.3.7L19 21l-.7-3.3L15 17l3.3-.7L19 13z" />
            </svg>
          )}
        </motion.span>
      ))}
    </div>
  )
}

function WhyIcon({ type }) {
  const common = 'h-7 w-7'
  if (type === 'bow') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M12 12c2-3 5-4 7-2s1 5-2 6c-2 1-4 0-5-2-1 2-3 3-5 2-3-1-4-4-2-6s5 1 7 2z" strokeLinejoin="round" />
        <path d="M12 12v7" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'sparkle') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'truck') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7V10z" strokeLinejoin="round" />
        <circle cx="7" cy="18" r="1.5" />
        <circle cx="17" cy="18" r="1.5" />
      </svg>
    )
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" strokeLinejoin="round" />
    </svg>
  )
}

function SlideWelcome() {
  return (
    <div className="relative flex min-h-[28rem] flex-col items-center justify-center px-6 py-16 text-center sm:min-h-[32rem] sm:py-20">
      <FloatingDecor />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-3xl"
      >
        <p
          className="font-display text-xs font-semibold uppercase tracking-[0.4em] sm:text-sm"
          style={{ color: PINK }}
        >
          Welcome to
        </p>
        <h2
          className="mt-3 font-logo text-5xl font-bold lowercase tracking-wide sm:text-6xl md:text-7xl"
          style={{ color: HEADING }}
        >
          socutesy
        </h2>
        <p
          className="mt-4 font-display text-xl italic sm:text-2xl"
          style={{ color: HEADING }}
        >
          Personalized gifts made with love ♡
        </p>
        <p
          className="mx-auto mt-6 max-w-2xl text-xs font-medium leading-relaxed tracking-wide sm:text-sm"
          style={{ color: `${INK}99` }}
        >
          Magazines • Newspapers • Frames • Albums • Stickers • Coloring Books •
          Polaroids
        </p>
        <div className="mt-10">
          <CtaLink>Explore Collection</CtaLink>
        </div>
      </motion.div>
    </div>
  )
}

function SlideBestsellers() {
  return (
    <div className="mx-auto grid min-h-[28rem] max-w-[1200px] items-center gap-8 px-6 py-12 sm:min-h-[32rem] sm:py-16 lg:grid-cols-2 lg:gap-12 lg:px-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto aspect-[4/3] w-full max-w-lg"
      >
        {mockupImages.map((m) => (
          <motion.div
            key={m.label}
            className={`absolute overflow-hidden rounded-[1.5rem] bg-white shadow-lg shadow-pink-200/40 ring-1 ring-white/80 ${m.className}`}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <img
              src={m.src}
              alt={m.label}
              className="aspect-square w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="text-center lg:text-left"
      >
        <h2
          className="font-display text-4xl font-semibold sm:text-5xl"
          style={{ color: HEADING }}
        >
          Our Best Sellers
        </h2>
        <ul className="mt-6 space-y-3">
          {bestsellers.map((item) => (
            <li
              key={item}
              className="text-sm font-medium sm:text-base"
              style={{ color: `${INK}cc` }}
            >
              <span style={{ color: PINK }}>♡</span> {item}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <CtaLink>Browse Collection</CtaLink>
        </div>
      </motion.div>
    </div>
  )
}

function SlideWhy() {
  return (
    <div className="mx-auto flex min-h-[28rem] max-w-[1200px] flex-col items-center justify-center px-6 py-14 sm:min-h-[32rem] sm:py-16">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-center text-4xl font-semibold sm:text-5xl"
        style={{ color: HEADING }}
      >
        Why Choose SoCutesy?
      </motion.h2>

      <div className="mt-10 grid w-full grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {whyCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.45 }}
            className="flex flex-col items-center rounded-[30px] bg-white/80 px-4 py-7 text-center shadow-md shadow-pink-100/50 ring-1 ring-white backdrop-blur-sm"
          >
            <span className="mb-3" style={{ color: PINK }}>
              <WhyIcon type={card.icon} />
            </span>
            <p
              className="font-display text-base font-semibold leading-snug sm:text-lg"
              style={{ color: HEADING }}
            >
              {card.title}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10">
        <CtaLink>Create Yours</CtaLink>
      </div>
    </div>
  )
}

const slides = [
  { id: 'welcome', bg: `linear-gradient(165deg, #FCECEF 0%, #F9E0E6 45%, #FCECEF 100%)`, node: <SlideWelcome /> },
  { id: 'bestsellers', bg: `linear-gradient(180deg, #FDF6F7 0%, #FCECEF 100%)`, node: <SlideBestsellers /> },
  { id: 'why', bg: `linear-gradient(180deg, #FCECEF 0%, #FFF8FA 50%, #FCECEF 100%)`, node: <SlideWhy /> },
]

export function HeroBanner() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, SLIDE_MS)
    return () => clearInterval(id)
  }, [])

  const slide = slides[index]

  return (
    <section
      className="relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label="SoCutesy highlights"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          style={{ background: slide.bg }}
          className="w-full"
        >
          {slide.node}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
