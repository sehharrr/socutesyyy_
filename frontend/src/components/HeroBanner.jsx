import { motion } from 'framer-motion'

const doodles = [
  { t: 'star', style: { top: '8%', left: '6%', width: 28, height: 28 } },
  { t: 'heart', style: { top: '18%', right: '10%', width: 22, height: 22 } },
  { t: 'star', style: { bottom: '22%', left: '12%', width: 20, height: 20 } },
  { t: 'heart', style: { bottom: '12%', right: '18%', width: 26, height: 26 } },
  { t: 'star', style: { top: '42%', left: '4%', width: 16, height: 16 } },
  { t: 'star', style: { top: '30%', right: '6%', width: 24, height: 24 } },
]

function Doodle({ type, style }) {
  if (type === 'heart') {
    return (
      <svg
        className="pointer-events-none absolute text-[#111827]/25"
        style={style}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    )
  }
  return (
    <svg
      className="pointer-events-none absolute text-[#111827]/20"
      style={style}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
    </svg>
  )
}

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#ffe4e9] px-4 py-14 sm:py-20">
      {doodles.map((d, i) => (
        <Doodle key={i} type={d.t} style={d.style} />
      ))}

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-1"
        >
          <p className="font-logo text-base font-semibold uppercase tracking-[0.35em] text-[#111827] sm:text-lg md:text-xl">
            Welcome to
          </p>
          <p className="font-logo-wordmark text-4xl lowercase leading-none sm:text-5xl md:text-6xl">
            socutesy
          </p>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="font-logo mt-4 text-2xl font-semibold leading-snug tracking-normal text-[#111827] sm:text-3xl md:text-4xl"
        >
          {`Magazines • Newspapers • Stickers •`}
          <br className="hidden sm:block" />
          {`Polaroids • Albums • Frames • Coloring Books`}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-6 max-w-xl text-sm font-medium leading-relaxed text-[#4b5563] sm:text-base"
        >
          {'Personalized Gifts for your Loved ones <3'}
        </motion.p>
      </div>
    </section>
  )
}
