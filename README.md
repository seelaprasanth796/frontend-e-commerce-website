# ShopSphere React – Flipkart-Inspired E-Commerce

A modern React + Vite + Bootstrap 5 e-commerce application with Flipkart-style UI.

## Features

- Two-tier navbar with live search suggestions and category strip
- Hero carousel, Deals of the Day countdown, featured & bestseller grids
- Guest cart & wishlist (auto-merged on login)
- Toast notifications
- Product filters, sorting, multi-image gallery, variants
- Pincode delivery check, coupons (SHOP10, SAVE200, FREESHIP)
- UPI / Card / COD checkout with address validation
- Order tracking & cancellation
- Demo login: `demo@shopsphere.com` / `Demo@123`

## Quick Start

```bash
cd ShopSphere-React
npm install
npm run dev
```

Open http://localhost:5173

## Deploy on Vercel

1. Push this folder to a GitHub repository
2. Import in Vercel (Framework: Vite, Build: `npm run build`, Output: `dist`)
3. `vercel.json` is included for SPA routing

## Logo

Place your logo at `public/assets/images/shopsphere-logo.png`.  
If missing, the navbar falls back to a styled icon badge.
