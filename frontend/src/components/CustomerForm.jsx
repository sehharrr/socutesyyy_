import { useState } from 'react'

const initial = {
  fullName: '',
  phone: '',
  city: '',
  address: '',
  notes: '',
  includeDelivery: true,
}

/**
 * @param {{
 *   defaultValues?: typeof initial
 *   onSubmit: (data: typeof initial) => void | Promise<void>
 *   submitLabel?: string
 *   isSubmitting?: boolean
 * }} props
 */
export function CustomerForm({
  defaultValues = initial,
  onSubmit,
  submitLabel = 'Proceed to payment',
  isSubmitting = false,
}) {
  const [values, setValues] = useState(() => ({ ...initial, ...defaultValues }))
  const [errors, setErrors] = useState({})

  const set =
    (field) =>
    (e) => {
      setValues((v) => ({ ...v, [field]: e.target.value }))
      setErrors((er) => ({ ...er, [field]: undefined }))
    }

  const validate = () => {
    const next = {}
    if (!values.fullName.trim()) next.fullName = 'Please enter your full name'
    if (!values.phone.trim()) next.phone = 'Please enter your phone number'
    if (!values.city.trim()) next.city = 'Please enter your city'
    if (!values.address.trim()) next.address = 'Please enter your address'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    await Promise.resolve(
      onSubmit({
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        city: values.city.trim(),
        address: values.address.trim(),
        notes: values.notes.trim(),
        includeDelivery: values.includeDelivery,
      }),
    )
  }

  const inputClass =
    'mt-1 w-full rounded-2xl border border-[#fbcfe8] bg-white px-4 py-3 text-sm font-medium text-[#831843] shadow-sm outline-none transition placeholder:text-[#9ca3af] focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#fbcfe8]'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-[#9d174d]">
          Full name <span className="text-[#e11d48]">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          autoComplete="name"
          value={values.fullName}
          onChange={set('fullName')}
          className={inputClass}
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-[#e11d48]">{errors.fullName}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#9d174d]">
          Phone number <span className="text-[#e11d48]">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          value={values.phone}
          onChange={set('phone')}
          className={inputClass}
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-[#e11d48]">{errors.phone}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#9d174d]">
          City <span className="text-[#e11d48]">*</span>
        </label>
        <input
          type="text"
          name="city"
          autoComplete="address-level2"
          value={values.city}
          onChange={set('city')}
          className={inputClass}
        />
        {errors.city && (
          <p className="mt-1 text-xs text-[#e11d48]">{errors.city}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#9d174d]">
          Address <span className="text-[#e11d48]">*</span>
        </label>
        <textarea
          name="address"
          rows={3}
          autoComplete="street-address"
          value={values.address}
          onChange={set('address')}
          className={inputClass}
        />
        {errors.address && (
          <p className="mt-1 text-xs text-[#e11d48]">{errors.address}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#9d174d]">
          Notes <span className="text-[#9ca3af]">(optional)</span>
        </label>
        <textarea
          name="notes"
          rows={3}
          value={values.notes}
          onChange={set('notes')}
          placeholder="Any special requests, delivery instructions…"
          className={inputClass}
        />
      </div>
      <div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#fbcfe8] bg-white px-4 py-3.5 shadow-sm transition hover:bg-[#fdf2f8]">
          <input
            type="checkbox"
            checked={values.includeDelivery}
            onChange={(e) => {
              setValues((v) => ({ ...v, includeDelivery: e.target.checked }))
            }}
            className="mt-1 h-4 w-4 shrink-0 rounded border-[#fbcfe8] text-[#db2777] accent-[#f472b6] focus:ring-2 focus:ring-[#fbcfe8]"
          />
          <span className="text-left text-sm text-[#831843]">
            <span className="font-semibold">Include delivery</span>
            <span className="mt-0.5 block text-xs font-medium text-[#9d174d]/90">
              Fixed delivery charge: RS. 400 (added to your total)
            </span>
          </span>
        </label>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-gradient-to-r from-[#f472b6] to-[#ec4899] py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-300/40 transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Saving order…' : submitLabel}
      </button>
    </form>
  )
}
