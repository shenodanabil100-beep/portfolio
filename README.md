# SoDak Sweet Tooth — Full Project (Frontend + Backend)

This is the **complete project**: the SoDak Sweet Tooth storefront
(`index.html`, `shop.html`, `product.html`, `cart.html`, `about-contact.html`
and their CSS/JS) served together with a Node.js + Express backend API, as a
single app on a single port. Run one command and the whole site — pages,
styling, and live API — is up.

- `public/` — the storefront, served as static files by Express
- `src/` + `server.js` — the backend API (products, cart pricing, orders,
  contact form, newsletter)

The backend reimplements, on the server, the same logic that used to live
only in the front-end's `products.js` / `cart.js`: the product catalog,
filtering/sorting/pagination, cart pricing math (subtotal, promo discount,
shipping, tax), order checkout, the contact form, and newsletter signup. The
**contact form, newsletter signup, and checkout submission in the actual
pages now call these real endpoints** (see "What's wired up" below) instead
of only faking success in the browser. Product browsing and the cart itself
still run client-side (same as before, via `localStorage`) for instant
offline-feeling browsing — the identical pricing/catalog logic also exists
server-side in `src/`, ready to swap in if you want the client to fetch from
the API instead.

## Requirements

- Node.js 18+ (tested on Node 22)

## Setup

```bash
npm install
cp .env.example .env      # optional — sensible defaults are built in
npm start                 # runs the whole site + API on one port
npm run dev                # auto-restarts on file changes (node --watch)
```

Open **http://localhost:4000/** — that's the whole site (override the port
with `PORT` in `.env`). The API lives alongside it under `/api/...`.

## Running the tests

```bash
npm test
```

67 tests across 6 suites (Jest + Supertest) cover every API route and its
validation branches, error handling, and the static/SPA-fallback serving of
the frontend. All tests run against the Express app directly (no network
calls, no shared state between test files).

## Project layout

```
server.js                 Entry point — starts the HTTP server
public/                   The full storefront (served as static files)
  index.html, shop.html, product.html, cart.html, about-contact.html
  css/style.css, css/responsive.css
  js/products.js, js/cart.js, js/main.js
src/
  app.js                  Express app assembly (used directly by tests too)
  data/
    products.js           Product catalog (mirrors public/js/products.js)
    reviews.js             Sample reviews per product + fallback set
    store.js               In-memory "database": orders, contact messages,
                            newsletter subscribers, promo codes
  controllers/            Route handlers + validation logic
  routes/                 Express routers, one file per resource
  middleware/errorHandler.js  404 + centralized error JSON responses
  utils/pricing.js        Shared subtotal/shipping/tax/total math
tests/                    Jest + Supertest test suites (one per resource)
```

`src/data/store.js` is an in-memory store — it resets whenever the process
restarts. Swap it for a real database layer (Postgres, MongoDB, etc.) without
touching any controller, since controllers only call its exported functions.

## API Reference

All responses are JSON. Successful responses use `{ data, ... }`; errors use
`{ error: "<code>", message: "...", fields?: {...} }`.

### Health

- `GET /api/health` → `{ status: "ok", timestamp }`

### Products

- `GET /api/categories` → list of valid category slugs
- `GET /api/products` — query params:
  - `category` — comma-separated slugs (`chocolate,gummies`)
  - `maxPrice` — number, inclusive upper bound
  - `search` — case-insensitive match on name/short description
  - `sort` — `featured` (default) | `price-low` | `price-high` | `newest`
  - `page` (default 1), `limit` (default 12, max 48)
  - Returns `{ data: [...products], pagination: { page, limit, total, totalPages } }`
- `GET /api/products/:id` → single product, 404 if not found
- `GET /api/products/:id/related?limit=4` → same-category products, excluding itself
- `GET /api/products/:id/reviews` → curated reviews (falls back to generic ones)

### Cart (stateless — the client owns the cart array)

- `POST /api/cart/totals`
  Body: `{ items: [{ id, qty }], promoCode?: string }`
  Returns resolved/priced lines, any unknown ids that were dropped, and the
  full totals breakdown (subtotal, discount, shipping, tax, total).
- `POST /api/cart/promo/validate`
  Body: `{ code: string }` → `{ valid, discountRate }` (never errors on an
  invalid code — that's a normal "no" response, matching the UI's promo box)

Promo codes (demo): `SWEET10` (10%), `SODAK15` (15%).
Free shipping over **$35**; otherwise a flat **$5.99**. Sales tax **6.5%**
(South Dakota), applied after the discount.

### Orders / Checkout

- `POST /api/orders`
  Body:
  ```json
  {
    "customer": { "fullName", "email", "phone", "address", "city", "state", "zip" },
    "payment": { "method": "card|paypal|cod", "cardNumber", "cardExpiry", "cardCvc" },
    "items": [{ "id": 1, "qty": 2 }],
    "promoCode": "SWEET10"
  }
  ```
  Card fields are only required when `payment.method` is `"card"`. Raw card
  numbers are **never stored** — only the last 4 digits are kept.
  Returns `201` with the order number, customer first name/email, priced
  items, and totals — matching the confirmation screen `cart.html` shows.
- `GET /api/orders/:orderNumber` → full order record, 404 if unknown

### Contact form

- `POST /api/contact`
  Body: `{ name, email, subject, message }` (all required)

### Newsletter

- `POST /api/newsletter`
  Body: `{ email }` — `201` for a new subscriber, `200` if already subscribed
  (idempotent, not an error)

## What's wired up to the real backend right now

- **Checkout** (`public/js/cart.js`, `#checkout-form` on `cart.html`): submits
  to `POST /api/orders`. The confirmation screen (name, order number, email,
  total) is populated from the API's response, not made up client-side. The
  cart only clears after the server confirms the order.
- **Contact form** (`public/js/main.js`, `#contact-form` on
  `about-contact.html`): submits to `POST /api/contact`. Server-side
  validation errors are surfaced on the matching fields.
- **Newsletter signup** (`public/js/main.js`, `#newsletter-form`): submits to
  `POST /api/newsletter`.

## What still runs client-side (by design)

- **Product browsing & cart contents** (`public/js/products.js`,
  `public/js/cart.js`'s `getCart`/`addToCart`/etc.) still use the in-page
  `PRODUCTS` array and `localStorage`, exactly as before — this keeps
  browsing and adding to cart instant with zero network round-trips.
- The identical catalog and pricing logic also exists server-side
  (`src/data/products.js`, `src/utils/pricing.js`) and is fully exposed via
  `GET /api/products*` and `POST /api/cart/totals`, in case you want to move
  product data to a real database later — no numbers will change when you do,
  since both sides use the same thresholds/rates:
  - Promo codes (demo): `SWEET10` (10%), `SODAK15` (15%)
  - Free shipping over **$35**; otherwise a flat **$5.99**
  - Sales tax **6.5%** (South Dakota), applied after the discount
