import { useEffect } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProductBySlug } from '../utils/products'
import { getOrderFlowType, getUploadPhotoRequirements, UPLOAD_PRODUCT_SLUGS } from '../utils/orderFlow'
import { IconCamera } from '../components/icons'
import {
  defaultSelection,
  getPrice,
  getSelectionSummary,
} from '../utils/pricing'
import { useOrderFlow } from '../context/OrderFlowContext'

export default function UploadPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const product = getProductBySlug(slug)
  const { setOrderMeta, addFiles, removeFileAt, files, clearFiles, orderQty } =
    useOrderFlow()

  const priceFromNav = location.state?.price
  const summaryFromNav = location.state?.summary
  const quantityFromNav = location.state?.quantity

  useEffect(() => {
    if (!product || !UPLOAD_PRODUCT_SLUGS.has(slug)) {
      navigate('/', { replace: true })
      return
    }
    if (priceFromNav != null && summaryFromNav != null) {
      setOrderMeta({
        slug: product.slug,
        name: product.name,
        price: priceFromNav,
        summary: summaryFromNav,
        quantity: quantityFromNav ?? 1,
      })
      return
    }
    const sel = defaultSelection(product)
    const price = getPrice(product, sel)
    const summary = getSelectionSummary(product, sel)
    setOrderMeta({
      slug: product.slug,
      name: product.name,
      price,
      summary,
      quantity: 1,
    })
  }, [
    product,
    slug,
    navigate,
    setOrderMeta,
    priceFromNav,
    summaryFromNav,
    quantityFromNav,
  ])

  if (!product || getOrderFlowType(slug) !== 'upload') {
    return null
  }

  const qty = Math.max(1, orderQty || quantityFromNav || 1)
  const { min: photoMin, max: photoMax } = getUploadPhotoRequirements(slug, qty)
  const atPhotoLimit = photoMax != null && files.length >= photoMax
  const remainingSlots =
    photoMax != null ? Math.max(0, photoMax - files.length) : null
  const meetsMinimum = photoMin == null || files.length >= photoMin
  const photosNeeded =
    photoMin != null ? Math.max(0, photoMin - files.length) : 0

  const requirementHint =
    photoMin != null && photoMax != null
      ? `Upload between ${photoMin} and ${photoMax} pictures.`
      : photoMin != null
        ? `Upload at least ${photoMin} pictures.`
        : photoMax != null
          ? `Maximum ${photoMax} pictures.`
          : null

  const onPick = (e) => {
    const list = e.target.files
    if (!list?.length) return
    const incoming = Array.from(list)
    const toAdd =
      remainingSlots != null
        ? incoming.slice(0, remainingSlots)
        : incoming
    if (toAdd.length) addFiles(toAdd)
    e.target.value = ''
  }

  const onContinue = () => {
    if (files.length === 0 || !meetsMinimum) return
    navigate(`/order/${slug}/customer`)
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:py-14">
      <Link
        to={`/product/${slug}`}
        className="mb-6 inline-flex text-sm font-medium text-[#9d174d] hover:text-[#831843]"
      >
        ← Back to product
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-[#fce7f3] bg-[#fffafc] p-6 shadow-inner shadow-pink-100/40 sm:p-8"
      >
        <h1 className="font-semibold text-2xl text-[#831843] sm:text-3xl">
          Upload your photos
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
          Add the images you want us to use for{' '}
          <span className="font-medium text-[#9d174d]">{product.name}</span>.
          You can preview them below before continuing.
          {requirementHint && (
            <>
              {' '}
              <span className="font-medium text-[#9d174d]">{requirementHint}</span>
            </>
          )}
        </p>

        <div className="mt-6">
          {atPhotoLimit ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#fbcfe8] bg-[#fdf2f8] px-6 py-10 text-center">
              <p className="text-sm font-semibold text-[#831843]">
                {photoMax} pictures uploaded
              </p>
              <p className="mt-1 text-xs text-[#9ca3af]">
                Remove a photo below to add a different one.
              </p>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#fbcfe8] bg-white px-6 py-10 transition hover:border-[#f9a8d4] hover:bg-[#fdf2f8]">
              <IconCamera className="h-10 w-10 text-[#f9a8d4]" />
              <span className="mt-2 text-sm font-semibold text-[#831843]">
                Tap to upload images
              </span>
              <span className="mt-1 text-xs text-[#9ca3af]">
                PNG, JPG
                {photoMax != null
                  ? ` — up to ${remainingSlots} more (${files.length}/${photoMax})`
                  : photoMin != null
                    ? ` — ${files.length} uploaded (${photosNeeded} more needed)`
                    : ' — multiple files supported'}
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
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#be185d]">
              Preview ({files.length}
              {photoMax != null ? ` / ${photoMax}` : photoMin != null ? ` / min ${photoMin}` : ''})
            </p>
            {!meetsMinimum && photoMin != null && (
              <p className="mt-2 text-xs font-medium text-[#be185d]">
                Add {photosNeeded} more picture{photosNeeded === 1 ? '' : 's'} to continue.
              </p>
            )}
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {files.map((item, i) => (
                <li
                  key={item.previewUrl}
                  className="relative overflow-hidden rounded-2xl border border-[#fce7f3] bg-white shadow-sm"
                >
                  <img
                    src={item.previewUrl}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFileAt(i)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-sm font-bold text-white transition hover:bg-black/70"
                    aria-label={`Remove image ${i + 1}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => clearFiles()}
              className="mt-3 text-xs font-medium text-[#db2777] underline hover:text-[#be185d]"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            to={`/product/${slug}`}
            className="rounded-2xl border border-[#fbcfe8] bg-white px-6 py-3 text-center text-sm font-semibold text-[#db2777] transition hover:bg-[#fdf2f8]"
          >
            Cancel
          </Link>
          <button
            type="button"
            disabled={files.length === 0 || !meetsMinimum}
            onClick={onContinue}
            className="rounded-2xl bg-gradient-to-r from-[#d1567f] to-[#be3d6a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-300/40 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </main>
  )
}
