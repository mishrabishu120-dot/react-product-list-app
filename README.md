# ShopFlow 🛍️ — E-Commerce Platform (React+Vite to Next.js 15 Migration)

ShopFlow is a premium, high-performance e-commerce platform. This project represents a complete architectural migration from a simple, single-page React + Vite application to a production-ready **Next.js 15 (App Router)** platform built with **TypeScript**, **Tailwind CSS 4**, and modern React 19 paradigms.

---

## 🔄 The Upgrade Journey: Vite vs. Next.js 15

Here is a breakdown of how the application was upgraded:

| Feature | Old Version (React + Vite) | New Version (Next.js 15 App Router) |
| :--- | :--- | :--- |
| **Framework** | Client-only SPA (Vite) | Next.js 15 App Router (Hybrid SSR/CSR) |
| **Language** | JavaScript (`.jsx`) | Strict **TypeScript** (`.tsx`) |
| **Routing** | Conditional rendering (Simulated) | Next.js App Router (File-system routes `/cart`, `/admin`, etc.) |
| **Styling** | Custom CSS Modules | Modern **Tailwind CSS 4** |
| **Home Page** | Simple product grid | Premium landing page (Hero banner, featured categories, client reviews) |
| **Cart View** | Slide-out Sidebar | Dedicated, interactive `/cart` page + totals calculator |
| **Product Detail** | None (Modal only) | Dynamic `/products/[id]` page with gallery & specs table |
| **Checkout Flow** | Simple alert prompt | Professional multi-step `/checkout` process |
| **User Profiles** | None | `/profile` page with order history and clear-data options |
| **SEO & Meta** | Static `index.html` tags | Next.js Metadata API (Dynamic OpenGraph & Twitter cards) |
| **Monitoring** | None | SSR `/health` check page for server stats |

---

## 🚀 Key Features

### 🛍️ Client Storefront
* **Product Catalog:** Real-time search, category pill filter, price sorting, and dynamic grid/list layout toggles.
* **Product Detail Page (`/products/[id]`):** Displays product specifications, stock statuses, galleries, and related item recommendations.
* **Full-Page Shopping Cart (`/cart`):** Live quantity steppers, item removal, promo code validation (e.g., `SAVE20`), and structured summaries.
* **Checkout Flow (`/checkout`):** Multi-step user interface with progress bars for shipping, payment method, and final order review.
* **Order History (`/orders`):** Track order statuses (Processing, Shipped, Delivered) using interactive horizontal progress steps.

### 🔐 User & Admin Auth (Persisted)
* **Registration:** Sign up instantly. Registered users are automatically logged in.
* **Demo Credentials:** Quick one-click autofill buttons are placed directly on the login card to ease testing.
* **Local Database:** All user registry data and shopping carts are persisted securely inside `localStorage`.

### 🛡️ Admin Management Panel (`/admin`)
* **Live Catalog CRUD:** Create, edit, and delete catalog products with full form validation.
* **Overview Stats:** View catalog value, category counts, average rating metrics, and recent orders.
* **Analytics Tab:** Visual charts representing price distribution and category volume.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Customer** | `user@shopflow.com` | `user123` | Storefront, Cart, Checkout, Order Tracking |
| **Admin** | `admin@shopflow.com` | `admin123` | Stats, Analytics, Inventory Management CRUD |

---

## 💻 Local Installation

1. Navigate to the project directory:
   ```bash
   cd product-list-app
   
2.Install dependencies:

Navigate to the project directory:

bash

npm install

3.Launch the development server:

bash


npm run dev

4.Open http://localhost:3000 in your browser.

📦 Deployment
This project is optimized for deployment on platforms like Netlify or Vercel. The repository includes a netlify.toml file to automatically load the Next.js Runtime plugin and set build parameters.
