/**
 * Shop catalog with structured pricing (fixed / variants / paper options).
 */
export const categories = [
  { id: 'polaroids', title: 'Polaroids & prints', showBow: true },
  { id: 'stationery', title: 'Printables', showBow: true },
  { id: 'albums', title: 'Albums & books', showBow: true },
  { id: 'gifts', title: 'Gifts & decor', showBow: true },
]

export const products = [
  {
    id: 'magazine',
    slug: 'custom-magazine',
    name: 'Custom Magazine',
    category: 'albums',
    image: '/images/magazine-1.png',
    images: [
      '/images/magazine-1.png',
      '/images/magazine-2.png',
      '/images/magazine-3.png',
      '/images/magazine-4.png',
      '/images/magazine-5.png',
      '/images/magazine-6.png',
    ],
    imageAlt:
      'Custom magazine spreads and covers — editorial layouts, collages, and portrait features.',
    description:
      'Your story in magazine form — editorial layouts and collages. Size A4; soft or hard paper.',
    options: [
      {
        type: 'Soft Paper',
        variants: [
          { sides: 6, price: 1500 },
          { sides: 8, price: 1800 },
          { sides: 10, price: 2200 },
        ],
      },
      {
        type: 'Hard Paper',
        variants: [
          { sides: 6, price: 1800 },
          { sides: 8, price: 2200 },
          { sides: 10, price: 2500 },
        ],
      },
    ],
  },
  {
    id: 'newspaper',
    slug: 'newspaper',
    name: 'Newspaper',
    category: 'stationery',
    image: '/images/newspaper-1.png',
    images: [
      '/images/newspaper-1.png',
      '/images/newspaper-2.png',
      '/images/newspaper-3.png',
    ],
    imageAlt:
      'Custom newspaper prints — Bestie Times zine style, Forever Times wedding spreads, puzzles, and columns.',
    description:
      'Newspaper-style prints for birthdays, weddings, and bestie shout-outs — choose A3 or A4.',
    variants: [
      { size: 'A3', price: 1000 },
      { size: 'A4', price: 500 },
    ],
  },
  {
    id: 'mini-frame',
    slug: 'mini-frame',
    name: 'Mini Frame',
    category: 'gifts',
    image: '/images/mini-frame-1.png',
    images: [
      '/images/mini-frame-1.png',
      '/images/mini-frame-2.png',
      '/images/mini-frame-3.png',
    ],
    imageAlt:
      'Personalized mini frame collage with photos and decorative details, held against green leaves.',
    description:
      'A sweet mini frame for your favourite photos — perfect for desks, shelves, and gifts.',
    detailBullets: ['Size 6×6 inches'],
    price: 1500,
  },
  {
    id: 'coloring-book',
    slug: 'coloring-book',
    name: 'Coloring Book',
    category: 'albums',
    image: '/images/coloring-book-1.png',
    images: [
      '/images/coloring-book-1.png',
      '/images/coloring-book-2.png',
      '/images/coloring-book-3.png',
      '/images/coloring-book-4.png',
    ],
    imageAlt:
      'Personalized coloring book pages — custom line art from photos with pencils on dark surfaces.',
    description:
      'Custom line-art pages made from your photos — relax, colour, and keep it cute.',
    detailBullets: [
      '10 coloring pages',
      'Pencil colors',
      '1 sticker sheet',
    ],
    price: 2400,
  },
  {
    id: 'mini-photobook',
    slug: 'mini-photobook',
    name: 'Mini Photobook',
    category: 'polaroids',
    image: '/images/mini-photobook-1.png',
    images: [
      '/images/mini-photobook-1.png',
      '/images/mini-photobook-2.png',
      '/images/mini-photobook-3.png',
      '/images/mini-photobook-4.png',
    ],
    imageAlt:
      'Spiral-bound mini photobook with Polaroid-style pages, handwritten captions, and comb binding.',
    description:
      'Tiny spiral photobook — Polaroid-style pages and captions in one pocket-sized keepsake.',
    detailBullets: [
      'Size 3.5×3.5 inches',
      'Includes 10 pictures',
    ],
    price: 1500,
  },
  {
    id: 'mini-bouquet',
    slug: 'mini-bouquet',
    name: 'Mini Bouquet',
    category: 'gifts',
    image: '/images/mini-bouquet.png',
    imageAlt:
      'Personalized SoCutesy mini bouquet wrapped in pink paper with Polaroid photos, jewelry, and beauty gifts.',
    description:
      'A gift bundle bouquet — photos, jewellery, and beauty bits wrapped up in pink.',
    detailBullets: [
      'Includes 5 polaroids',
      'Hair clip',
      'Pendant',
      'Bracelet',
      'Earrings',
      'Lip gloss',
      'Jelly tint',
    ],
    price: 4000,
  },
  {
    id: 'mini-album',
    slug: 'mini-album',
    name: 'Mini Album',
    category: 'albums',
    image: '/images/mini-album-1.png',
    images: [
      '/images/mini-album-1.png',
      '/images/mini-album-2.png',
      '/images/mini-album-3.png',
      '/images/mini-album-4.png',
      '/images/mini-album-5.png',
      '/images/mini-album-6.png',
    ],
    imageAlt:
      'Spiral-bound mini album pages — scrapbook layouts, Polaroid grids, Spotify-style cover, and story spreads.',
    description:
      'Scrapbook-style mini album — size A5. Spiral-bound pages for photos, grids, and story spreads.',
    variants: [
      { sides: 6, price: 1800 },
      { sides: 8, price: 2200 },
      { sides: 10, price: 2500 },
    ],
  },
  {
    id: 'polaroids',
    slug: 'polaroids',
    name: 'Polaroids',
    category: 'polaroids',
    image: '/images/polaroids-1.png',
    images: ['/images/polaroids-1.png', '/images/polaroids-2.png'],
    imageAlt:
      'Polaroid-style photo prints with white borders — memories and portraits in classic instant-film format.',
    description:
      'Classic instant-film look — white borders and your memories in every print.',
    detailBullets: ['Size 3×3 inches'],
    price: 60,
  },
  {
    id: 'photobooth-strips',
    slug: 'photobooth-strips',
    name: 'Photobooth Strips',
    category: 'polaroids',
    image: '/images/photobooth-strips-1.png',
    images: [
      '/images/photobooth-strips-1.png',
      '/images/photobooth-strips-2.png',
      '/images/photobooth-strips-3.png',
    ],
    imageAlt:
      'Vertical photobooth strips with themed frames — cinema style, bright layouts, and classic strip prints.',
    description:
      'Vertical strips with themed frames — cinema nights, date ideas, and bestie energy.',
    price: 250,
  },
  {
    id: 'stickers',
    slug: 'stickers',
    name: 'Stickers',
    category: 'stationery',
    image: '/images/stickers-1.png',
    images: [
      '/images/stickers-1.png',
      '/images/stickers-2.png',
      '/images/stickers-3.png',
      '/images/stickers-4.png',
      '/images/stickers-5.png',
      '/images/stickers-6.png',
    ],
    imageAlt:
      'Die-cut sticker sheets — Y2K girly sets, love themes, retro media, red aesthetic, Starry Night, and cinema icons.',
    description:
      'Die-cut sticker sheets — Y2K, love, retro, and cinema vibes. Pick your favourite design.',
    variantSelectLabel: 'Sticker sheet',
    variants: [
      { label: 'Sticker sheet 1', price: 250, image: '/images/stickers-1.png' },
      { label: 'Sticker sheet 2', price: 250, image: '/images/stickers-2.png' },
      { label: 'Sticker sheet 3', price: 250, image: '/images/stickers-3.png' },
      { label: 'Sticker sheet 4', price: 250, image: '/images/stickers-4.png' },
      { label: 'Sticker sheet 5', price: 250, image: '/images/stickers-5.png' },
      { label: 'Sticker sheet 6', price: 250, image: '/images/stickers-6.png' },
    ],
  },
  {
    id: 'bookmarks',
    slug: 'bookmarks',
    name: 'Bookmarks',
    category: 'stationery',
    image: '/images/bookmarks-1.png',
    imageAlt:
      'Cutesy reader bookmarks — pink bows, patterned sets, playful quotes, and striped designs.',
    description:
      'Cutesy bookmarks for readers — bows, patterns, quotes, and stripes. Sets of 2, 3, or 4.',
    variantSelectLabel: 'Choose set',
    /** Three photos only (no 4th). Order: 1st, then 3rd & 2nd swapped. Thumbnails match sets 2 / 3 / 4. */
    sharedVariantGallery: [
      '/images/bookmarks-1.png',
      '/images/bookmarks-3.png',
      '/images/bookmarks-2.png',
    ],
    variants: [
      {
        label: 'Set of 2 bookmarks',
        price: 450,
        image: '/images/bookmarks-1.png',
      },
      {
        label: 'Set of 3 bookmarks',
        price: 600,
        image: '/images/bookmarks-3.png',
      },
      {
        label: 'Set of 4 bookmarks',
        price: 750,
        image: '/images/bookmarks-2.png',
      },
    ],
  },
  {
    id: 'cards',
    slug: 'cards',
    name: 'Cards',
    category: 'stationery',
    image: '/images/cards-1.png',
    images: ['/images/cards-1.png', '/images/cards-2.png', '/images/cards-3.png'],
    imageAlt:
      'Custom handmade kraft cards on grass — Galentine scrapbook style with photos, stickers, and envelopes.',
    description:
      'Handmade-style cards with photos and scrapbook details — birthdays, love notes, Galentine’s.',
    price: 600,
  },
  {
    id: 'songbook',
    slug: 'songbook',
    name: 'Songbook',
    category: 'albums',
    image: '/images/songbook-1.png',
    images: [
      '/images/songbook-1.png',
      '/images/songbook-2.png',
      '/images/songbook-3.png',
      '/images/songbook-4.png',
      '/images/songbook-5.png',
      '/images/songbook-6.png',
      '/images/songbook-7.png',
      '/images/songbook-8.png',
    ],
    imageAlt:
      'Personalized songbook spreads — romantic scrapbook layouts, lyrics, polaroids, calendars, and music-player pages.',
    description:
      'A romantic songbook scrapbook — lyrics, photos, calendars, and music-player style pages.',
    price: 1200,
  },
]

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(categoryId) {
  return products.filter((p) => p.category === categoryId)
}
