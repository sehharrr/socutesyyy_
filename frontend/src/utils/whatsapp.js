const DEFAULT_PHONE = '923227784397'

export function getWhatsAppNumber() {
  const n = import.meta.env.VITE_WHATSAPP_NUMBER
  return n ? String(n).replace(/\D/g, '') : DEFAULT_PHONE
}

export function whatsappCheckoutUrl(items) {
  const phone = getWhatsAppNumber()
  const lines = items.map((i) => {
    const lineTotal = i.unitPrice * i.qty
    return `• ${i.name} (${i.summary}) × ${i.qty} — RS. ${lineTotal.toLocaleString()}`
  })
  const text = `Hi SoCutesy! I'd like to order:\n\n${lines.join('\n')}\n\nPlease confirm availability & delivery.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

export function whatsappLink(text) {
  const phone = getWhatsAppNumber()
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}
