import { IconCamera } from './icons'
import { whatsappLink } from '../utils/whatsapp'

/**
 * Keepsake Frame: pick design template, size, fill required text, upload photos,
 * or jump to WhatsApp for a fully custom template.
 */
export function KeepsakeCustomize({
  product,
  selection,
  onSelectionChange,
  fieldValues,
  onFieldChange,
  files,
  onAddFiles,
  onRemoveFile,
  onClearFiles,
}) {
  const designs = product.designs ?? []
  const sizes = product.sizes ?? []
  const design = designs[selection.designIndex] ?? designs[0]
  const isCustom = Boolean(design?.whatsappCustom)

  const photosNeeded = design?.photosRequired ?? 0
  const remaining =
    photosNeeded > 0 ? Math.max(0, photosNeeded - files.length) : null
  const atLimit = photosNeeded > 0 && files.length >= photosNeeded

  const onPick = (e) => {
    const list = e.target.files
    if (!list?.length) return
    const incoming = Array.from(list)
    const toAdd =
      remaining != null ? incoming.slice(0, remaining) : incoming
    if (toAdd.length) onAddFiles(toAdd)
    e.target.value = ''
  }

  const customWhatsAppHref = whatsappLink(
    `Hi SoCutesy! I want a *custom ${product.name}* template.\n\nSize: ${sizes[selection.sizeIndex]?.size ?? 'standard'}\n\nI will send my reference layout / photos here.`,
  )

  const showSizePicker = sizes.length > 1
  const singleSize = sizes.length === 1 ? sizes[0] : null

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-[#9d174d]">Choose template</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {designs.map((d, i) => {
            const active = selection.designIndex === i
            return (
              <button
                key={d.id}
                type="button"
                onClick={() =>
                  onSelectionChange({ ...selection, designIndex: i })
                }
                className={`overflow-hidden rounded-2xl border text-left transition ${
                  active
                    ? 'border-[#be3d6a] ring-2 ring-[#be3d6a]/30'
                    : 'border-[#fce7f3] hover:border-[#f9a8d4]'
                }`}
              >
                <div className="aspect-square bg-[#fff5f7]">
                  {d.image ? (
                    <img
                      src={d.image}
                      alt=""
                      className={`h-full w-full ${
                        product.slug === 'photobooth-strips'
                          ? 'object-contain p-1'
                          : 'object-cover'
                      }`}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#9ca3af]">
                      Custom
                    </div>
                  )}
                </div>
                <p
                  className={`px-2 py-2 text-[11px] font-semibold leading-snug ${
                    active ? 'text-[#be3d6a]' : 'text-[#831843]'
                  }`}
                >
                  {d.label}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {showSizePicker ? (
        <div>
          <p className="text-sm font-semibold text-[#9d174d]">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((s, i) => {
              const active = selection.sizeIndex === i
              return (
                <button
                  key={s.size}
                  type="button"
                  onClick={() =>
                    onSelectionChange({ ...selection, sizeIndex: i })
                  }
                  className={`rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? 'border-[#be3d6a] bg-[#be3d6a] text-white'
                      : 'border-[#fbcfe8] bg-white text-[#831843] hover:bg-[#fdf2f8]'
                  }`}
                >
                  {s.size}
                  <span className="ml-2 font-medium opacity-80">
                    RS. {s.price.toLocaleString()}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ) : singleSize ? (
        <p className="text-xs text-[#6b7280]">
          Size:{' '}
          <span className="font-semibold text-[#831843]">{singleSize.size}</span>
          {' · '}
          <span className="font-semibold text-[#831843]">
            RS. {singleSize.price.toLocaleString()}
          </span>
        </p>
      ) : null}

      {isCustom ? (
        <div className="rounded-2xl border border-dashed border-[#f9a8d4] bg-white px-4 py-5 text-center">
          <p className="text-sm font-semibold text-[#831843]">
            Custom template
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[#6b7280]">
            {design.description ??
              'Send your own layout or reference on WhatsApp and we will make it for you.'}
          </p>
          <a
            href={customWhatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#d1567f] to-[#be3d6a] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-300/40 transition hover:brightness-105"
          >
            Send template on WhatsApp
          </a>
        </div>
      ) : (
        <>
          {(design.fields?.length > 0 || design.fieldHint) && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#9d174d]">
                Required text
              </p>
              {design.fieldHint && (
                <p className="text-xs text-[#6b7280]">{design.fieldHint}</p>
              )}
              {design.fields?.map((field) => (
                <label
                  key={field.key}
                  className="block text-xs font-medium text-[#831843]"
                >
                  {field.label}
                  {field.required ? (
                    <span className="text-[#be3d6a]"> *</span>
                  ) : (
                    <span className="font-normal text-[#9ca3af]"> (optional)</span>
                  )}
                  {field.multiline ? (
                    <textarea
                      rows={3}
                      value={fieldValues[field.key] ?? ''}
                      onChange={(e) => onFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="mt-1 w-full rounded-2xl border border-[#fbcfe8] bg-white px-4 py-3 text-sm font-medium text-[#831843] shadow-sm outline-none placeholder:text-[#9ca3af] focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#fbcfe8]"
                    />
                  ) : (
                    <input
                      type="text"
                      value={fieldValues[field.key] ?? ''}
                      onChange={(e) => onFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="mt-1 w-full rounded-2xl border border-[#fbcfe8] bg-white px-4 py-3 text-sm font-medium text-[#831843] shadow-sm outline-none placeholder:text-[#9ca3af] focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#fbcfe8]"
                    />
                  )}
                </label>
              ))}
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-[#9d174d]">
              Photos
              {photosNeeded > 0 && (
                <span className="ml-2 font-medium text-[#6b7280]">
                  ({files.length}/{photosNeeded})
                </span>
              )}
            </p>
            <p className="mt-1 text-xs text-[#6b7280]">
              Upload exactly {photosNeeded} picture
              {photosNeeded === 1 ? '' : 's'} for this template.
            </p>

            <div className="mt-3">
              {atLimit ? (
                <div className="rounded-2xl border-2 border-dashed border-[#fbcfe8] bg-[#fdf2f8] px-4 py-6 text-center text-xs text-[#9ca3af]">
                  All {photosNeeded} photos added. Remove one to swap.
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#fbcfe8] bg-white px-4 py-8 transition hover:border-[#f9a8d4] hover:bg-[#fdf2f8]">
                  <IconCamera className="h-8 w-8 text-[#f9a8d4]" />
                  <span className="mt-2 text-sm font-semibold text-[#831843]">
                    Tap to upload
                  </span>
                  <span className="mt-1 text-xs text-[#9ca3af]">
                    PNG, JPG — {remaining} more needed
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={onPick}
                  />
                </label>
              )}
            </div>

            {files.length > 0 && (
              <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {files.map((item, i) => (
                  <li
                    key={item.previewUrl}
                    className="relative overflow-hidden rounded-xl border border-[#fce7f3]"
                  >
                    <img
                      src={item.previewUrl}
                      alt=""
                      className="aspect-square w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveFile(i)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-xs font-bold text-white"
                      aria-label={`Remove photo ${i + 1}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {files.length > 0 && (
              <button
                type="button"
                onClick={onClearFiles}
                className="mt-2 text-xs font-medium text-[#db2777] underline"
              >
                Clear all photos
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * Validate keepsake form before checkout.
 * @returns {string | null} error message
 */
export function validateKeepsakeOrder(design, fieldValues, files) {
  if (!design || design.whatsappCustom) {
    return 'Choose a ready template, or use WhatsApp for a custom design.'
  }
  for (const field of design.fields ?? []) {
    if (field.required && !String(fieldValues[field.key] ?? '').trim()) {
      return `Please fill in: ${field.label}`
    }
  }
  const need = design.photosRequired ?? 0
  if (files.length < need) {
    return `Please upload ${need} photos for this template (${files.length}/${need}).`
  }
  if (files.length > need) {
    return `Please upload exactly ${need} photos for this template.`
  }
  return null
}

export function buildKeepsakeNotes(design, fieldValues, sizeLabel) {
  const lines = [
    `Template: ${design.label}`,
    `Size: ${sizeLabel}`,
  ]
  for (const field of design.fields ?? []) {
    const val = String(fieldValues[field.key] ?? '').trim()
    if (val) lines.push(`${field.label}: ${val}`)
  }
  lines.push(`Photos: ${design.photosRequired}`)
  return lines.join('\n')
}
