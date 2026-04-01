import { GiftIcon } from './GiftIcon'
import { IconInstagram, IconMail, IconWhatsApp } from './icons'
import { whatsappLink } from '../utils/whatsapp'

const INSTAGRAM_URL = 'https://www.instagram.com/socutesyyy_/'
const WHATSAPP_DISPLAY = '0322 7784397'
const EMAIL = 'socutesy124@gmail.com'

export function SiteFooter() {
  const whatsappHref = whatsappLink('Hi SoCutesy! 💕')

  return (
    <footer className="border-t border-[#f5d0e6] bg-[#fdeef4] px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex w-full flex-col items-center text-center sm:w-auto">
          <GiftIcon className="mx-auto mb-1.5 h-9 w-[2.1rem] shrink-0 sm:mb-2 sm:h-10 sm:w-[2.35rem]" />
          <p className="font-logo-wordmark text-2xl lowercase sm:text-3xl">
            socutesy
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#c49aa8] sm:text-xs">
            GIFT SHOP
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:items-end">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full max-w-xs items-center justify-center gap-2.5 rounded-2xl border border-[#f5c4dd] bg-white/90 px-6 py-3 text-sm font-semibold text-[#ce6684] shadow-sm shadow-pink-100/80 transition hover:border-[#e8a0c4] hover:bg-white hover:shadow-md sm:w-auto"
          >
            <IconInstagram className="h-5 w-5 text-[#ce6684]" />
            @socutesyyy_
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full max-w-xs items-center justify-center gap-2.5 rounded-2xl border border-[#f5c4dd] bg-white/90 px-6 py-3 text-sm font-semibold text-[#ce6684] shadow-sm shadow-pink-100/80 transition hover:border-[#e8a0c4] hover:bg-white hover:shadow-md sm:w-auto"
          >
            <IconWhatsApp className="h-5 w-5 text-[#ce6684]" />
            WhatsApp · {WHATSAPP_DISPLAY}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex w-full max-w-xs items-center justify-center gap-2.5 rounded-2xl border border-[#f5c4dd] bg-white/90 px-6 py-3 text-sm font-semibold text-[#ce6684] shadow-sm shadow-pink-100/80 transition hover:border-[#e8a0c4] hover:bg-white hover:shadow-md sm:w-auto"
          >
            <IconMail className="h-5 w-5 shrink-0 text-[#ce6684]" />
            {EMAIL}
          </a>
        </div>
      </div>
    </footer>
  )
}
