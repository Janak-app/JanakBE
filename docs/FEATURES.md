# Janak Positioning — Feature Documentation

---

## 1. Auth Module

### Screens
- **Login** — Work email + password fields, show/hide toggle, Demo Mode banner, Continue as Guest, trusted brands strip (Leica, Trimble, Topcon, DJI)

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Authenticate with email + password, returns JWT |
| POST | `/auth/logout` | Invalidate current session/token |
| GET | `/auth/me` | Return currently authenticated user's profile |

---

## 2. Home Module

### Screens
- **Home 1** — Time-based greeting, notification bell, promotional banner carousel, Shop by Category grid (GNSS/GPS, Total Stations, UAV/Drones, Data Controllers, Software, Accessories), Featured Products horizontal list
- **Home 2** — New Arrivals section, Trusted Brands strip (Leica, Trimble, Topcon, DJI), Book Service banner (Service & Calibration CTA), Live chat bubble

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Returns all categories with icon and slug |
| GET | `/products?featured=true` | Returns featured products for home screen |
| GET | `/products?new=true` | Returns new arrival products |
| GET | `/brands` | Returns trusted brands list |
| GET | `/banners` | Returns promotional banner slides for carousel |

---

## 3. Product Detail Module

### Screens
- **Product Detail** — Image gallery, brand, product name, price (with GST note), stock status badge, assigned sales rep (name + contact), key highlights, full technical specs, downloadable documents, customer reviews, related products
- **Actions available**: Add to Cart, Request a Quote, Add to Compare, Save to Wishlist, Share product link

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products/:id` | Get full product detail (images, specs, highlights, docs, sales rep) |
| GET | `/products/:id/reviews` | Get reviews for a product |
| POST | `/products/:id/reviews` | Submit a review for a product |
| GET | `/products/:id/related` | Get related products |
| GET | `/products/:id/documents` | Get downloadable documents for a product |

---

## 4. Wishlist Module

### Screens
- **My Wishlist** — Listed in profile menu ("No items saved" when empty), saved product cards

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wishlist` | Get all wishlist items for current user |
| POST | `/wishlist/items` | Add product to wishlist |
| DELETE | `/wishlist/items/:productId` | Remove product from wishlist |

---

## 5. Explore Module

### Screens
- **Explore** — Product count ("8 of 8 products"), search bar, filter icon, category filter chips (horizontal scroll), 2-column product grid, live chat bubble
- **Filter Sheet** — Bottom sheet with: Price Range, Brand, Stock Availability, Accuracy Rating, Warranty filters; Apply Filters + Clear All actions

### Product Card Structure
Each product card displays:
- Product image
- Brand label (e.g., LEICA, TRIMBLE, TOPCON)
- Product name
- Price (in ₹)
- Stock status badge — one of:
  - `In Stock` (green)
  - `Limited Stock` (yellow)
  - `Get Quote` (outline — no fixed price, contact for pricing)
  - `On Order` (grey — available on pre-order)

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Returns all products (supports query params below) |
| GET | `/products?search=keyword` | Search products by name or brand |
| GET | `/products?category=slug` | Filter by category |
| GET | `/products?brand=name` | Filter by brand |
| GET | `/products?inStock=true` | Filter by stock availability |
| GET | `/products?minPrice=X&maxPrice=Y` | Filter by price range |
| GET | `/products?accuracyRating=X` | Filter by accuracy rating |
| GET | `/products?warranty=X` | Filter by warranty period |

---

## 4. Cart Module

### Screens
- **Cart** — Item count, cart item list (image, brand, name, model, qty stepper, price, Save for later, Remove), coupon code input, Order Summary (subtotal, GST 18%, shipping), Total, Proceed to Checkout CTA

### Order Summary Breakdown
| Field | Details |
|-------|---------|
| Subtotal | Sum of all item prices |
| GST | 18% of subtotal |
| Shipping | FREE (at least for shown case) |
| Total | Subtotal + GST |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | Get current user's cart with items and summary |
| POST | `/cart/items` | Add product to cart |
| PATCH | `/cart/items/:id` | Update item quantity |
| DELETE | `/cart/items/:id` | Remove item from cart |
| DELETE | `/cart` | Clear entire cart |
| POST | `/cart/coupon` | Apply coupon code |
| DELETE | `/cart/coupon` | Remove applied coupon |
| POST | `/cart/save-for-later/:id` | Move item to saved list |

---

## 5. Orders Module

### Screens
- **My Orders** — Total order count, status filter tabs (All, Pending, Confirmed, Shipped, Delivered), order cards (order ID, date, status badge, product image, name, qty, price)
- **Order Detail** — Order ID (e.g. JP-2025-00211), status banner with date and message, items list, tracking section (courier name, AWB number, Track Shipment link), order timeline, delivery address

### Order Status Flow
`Pending` → `Confirmed` → `Shipped` → `Out for Delivery` → `Delivered`

### Order ID Format
`JP-YYYY-NNNNN` (e.g. JP-2025-00211)

### Tracking
- Courier name (e.g. Blue Dart)
- AWB number (e.g. IN2026051800123)
- External tracking link
- Timeline with timestamps for each status step

### Order Detail — Extended Fields
- Payment info: Method (UPI/Net Banking/Card), Transaction ID, Total Paid
- Sales Rep: name + phone number + call button
- Download GST Invoice button

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | List all orders for current user |
| GET | `/orders?status=shipped` | Filter orders by status |
| GET | `/orders/:id` | Get order detail with items, tracking, address, payment, sales rep |
| POST | `/orders` | Place order (checkout) |
| GET | `/orders/:id/invoice` | Download GST invoice for an order |

---

## 6. Checkout Module

### Flow — 3 Steps
**Step 1 — Address**
- Select saved delivery address (tagged HOME/WORK etc.)
- Add New Address option
- Estimated delivery info: 5–8 business days, free shipping above ₹50,000

**Step 2 — Payment**
- Payment methods: UPI (Recommended — GPay, PhonePe, BHIM), Net Banking, Credit/Debit Card (Visa, Mastercard, Rupay)
- UPI ID input with verification status
- PCI-DSS compliant security note

**Step 3 — Review & Place Order**
- Items list with qty and price
- Delivery address summary with Edit
- Payment method summary with Edit
- Order summary: Subtotal, GST (18%), Shipping, Grand Total
- T&C + Privacy Policy checkbox
- Place Order CTA

**Order Placed Screen**
- Success confirmation with Order ID (e.g. JP-2026-00312)
- Estimated delivery date range
- Payment method used
- Email + GST invoice confirmation note
- Download Invoice + Track Order CTAs

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/addresses` | Get saved delivery addresses for user |
| POST | `/addresses` | Add new delivery address |
| PATCH | `/addresses/:id` | Update address |
| DELETE | `/addresses/:id` | Delete address |
| POST | `/checkout/initiate` | Initiate checkout — validate cart, return summary |
| POST | `/checkout/place-order` | Place order with address + payment details |
| POST | `/payments/verify` | Verify UPI/payment transaction |

---

## 7. Profile Module

### Menu Items
| Item | Detail |
|------|--------|
| Product Comparison | Compare specs side-by-side |
| My Orders | 3 orders |
| My Quotes | 1 active (with unread badge) |
| My Service Requests | 1 confirmed |
| My Wishlist | No items saved |
| My Equipment | 1 registered |
| Download Invoices | Download all GST invoices |
| Notification Preferences | Manage notification settings |
| Contact Support | Mon–Sat · 9AM–6PM |
| Logout | Red — ends session |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get user profile |
| PATCH | `/profile` | Update profile details |
| POST | `/auth/logout` | Logout (invalidate token) |

---

## 8. Product Comparison Module

### Screens
- **Compare Products** — "2 of 4" header (max 4 products), delete icon to remove a product, side-by-side spec table, Quick Take AI summary at bottom

### Compared Specs
| Spec | Example Values |
|------|---------------|
| Horizontal Accuracy (RTK) | 6 mm + 0.5 ppm |
| Vertical Accuracy (RTK) | 10 mm + 0.5 ppm |
| Channels | 555 (all constellations) |
| Weight | 1.18 kg (incl. battery) |
| IP Rating | IP68 |
| Battery Life | Up to 8 hours |
| Connectivity | 4G LTE, Wi-Fi, Bluetooth, UHF |
| Warranty | 2 years |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/compare?ids=1,2,3` | Get comparison data for up to 4 product IDs |

---

## 9. Quotes Module

### Screens
- **My Quotes** — Active quote count, quote cards (Quote ID, status, submitted date, product image, name, quoted price, validity date)

### Quote ID Format
`Q-YYYY-NNNNN` (e.g. Q-2026-00045)

### Quote Status
`Pending` → `Quote Sent` → `Accepted` / `Expired`

### Quote Request Form Fields
| Field | Description |
|-------|-------------|
| Product | Pre-filled from product detail page |
| Quantity | Number of units required |
| Intended Use | Purpose/application of the product |
| Budget Range | Approximate budget (min–max in ₹) |
| Timeline | When the purchase is expected |
| Notes | Any additional requirements for the sales team |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quotes` | List all quotes for current user |
| GET | `/quotes/:id` | Get quote detail |
| POST | `/quotes` | Submit a new quote request (with form fields above) |

---

## 10. Service Requests Module

### Screens
- **Service Requests** — Active request count, + button to create new, request cards (SRV ID, device name + serial number, service type, slot date/time, fulfillment method)

### Service Request ID Format
`SRV-YYYY-NNNNN` (e.g. SRV-2026-00018)

### Service Types
- Annual Calibration
- Repair
- AMC (Annual Maintenance Contract)

### Fulfillment Methods
- Bring to Centre
- (likely: Field Visit / Pickup)

### Slot Format
Date + Time slot (e.g. 22 May 2026 · Morning 9AM–12PM)

### Status
`Pending` → `Confirmed` → `In Progress` → `Completed`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/service-requests` | List service requests for current user |
| GET | `/service-requests/:id` | Get service request detail |
| POST | `/service-requests` | Create new service request |
| PATCH | `/service-requests/:id` | Update service request |

---

## 13. Admin Module

> Backend web admin panel APIs to support MVP operations.

### 13.1 Admin Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/auth/login` | Admin login with credentials, returns JWT |
| POST | `/admin/auth/logout` | Invalidate admin session |

### 13.2 Product Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/products` | List all products (with search, filter, sort support) |
| GET | `/admin/products/:id` | Get single product detail |
| POST | `/admin/products` | Add new product (name, description, category, images, specs, documents, pricing) |
| PATCH | `/admin/products/:id` | Edit existing product |
| DELETE | `/admin/products/:id` | Delete a product |

### Product Fields (Admin)
| Field | Description |
|-------|-------------|
| Name | Product title |
| Description | Full description |
| Category | Category slug |
| Brand | Brand name |
| Images | Multiple image URLs |
| Price | Price in ₹ |
| Stock Status | `in_stock`, `limited_stock`, `get_quote`, `on_order` |
| Specifications | Key-value technical specs |
| Documents | Downloadable files (manuals, datasheets) |
| Featured | Boolean — show on home featured section |
| New Arrival | Boolean — show on new arrivals section |

### 13.3 Order Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/orders` | List all customer orders (with filter by status, date, user) |
| GET | `/admin/orders/:id` | Get full order detail (items, payment status, user profile, tracking) |
| PATCH | `/admin/orders/:id/status` | Update order status |
| PATCH | `/admin/orders/:id/tracking` | Update courier + AWB tracking details |

### 13.4 Coupon / Discount Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/coupons` | List all coupon codes |
| POST | `/admin/coupons` | Create new coupon code |
| PATCH | `/admin/coupons/:id` | Edit coupon |
| DELETE | `/admin/coupons/:id` | Delete coupon |

### Coupon Fields
| Field | Description |
|-------|-------------|
| Code | Unique coupon string (e.g. SAVE10) |
| Discount | Percentage-based discount (e.g. 10%) |
| Usage Type | `single_use` — once per user, `multi_use` — unlimited uses |
| Expiry Date | Optional expiry date |
| Active | Boolean to enable/disable |
