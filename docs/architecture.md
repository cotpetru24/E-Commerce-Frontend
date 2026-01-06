# Architecture Notes

## 1) Feature based routing + lazy loading
We use domain based route groupings (e.g., auth/products/cart/admin) with lazy loading to keep the bundle size manageable and ensure features remain isolated and scalable.

## 2) CMS theming via CSS variables
The CMS profile drives theme colors using CSS variables so the UI can switch branding at runtime without rebuilding or hard coding themes.

## 3) Inventory modeled at size/variant level
Products track stock at size/variant level to support realistic retail flows (SKU/barcode per variant, low stock signals, and precise order fulfillment).
