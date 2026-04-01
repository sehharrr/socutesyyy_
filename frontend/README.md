# SoCutesy — Frontend

React (Vite) + Tailwind CSS v4 + Framer Motion + React Router. Shop-style UI (carousel product rows, cart, WhatsApp checkout).

## Setup

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env` and set your WhatsApp number (digits only, country code included):

```
VITE_WHATSAPP_NUMBER=923001234567
```

## Development

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

## Project layout

| Path | Purpose |
|------|---------|
| `src/components/` | `ShopHeader`, `AnnouncementBar`, `HeroBanner`, `ShopProductCard`, `ProductCarouselSection`, `SiteFooter`, `BowIcon` |
| `src/context/` | `CartContext`, `ShopContext` |
| `src/pages/` | Route-level pages |
| `src/utils/` | Products, WhatsApp helpers |

## Routes

- `/` — Shop home (hero banner + category carousels + footer)
- `/customize/:productId` — Customization placeholder (Fabric editor can be added later)
