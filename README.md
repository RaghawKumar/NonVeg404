# 🍗 NON VEG 404
> **// GOOD FOOD. NO BUGS. //**
> *Where hunger is never "404 Not Found"*

---

## 📁 Repository Architecture

This workspace contains two dedicated projects within the `NonVeg404` directory:

```
NonVeg404/
├── app/                  # Customer Mobile App in Flutter (iOS & Android)
│   ├── lib/
│   │   ├── main.dart     # MultiProvider root with dark developer theme
│   │   ├── theme/        # AppColors, AppTheme, JetBrains Mono & Inter typography
│   │   ├── models/       # FoodItem, CartItem, Order, Reservation, Coupon, UserProfile
│   │   ├── providers/    # CartProvider, AuthProvider, OrderProvider
│   │   ├── widgets/      # FoodCard, FoodDetailSheet, SpiceMeter, TechBadge, TerminalBanner
│   │   └── screens/      # Splash, Home, Menu, Cart, Checkout, Track, Reservations, Offers, Account, Login
│   └── pubspec.yaml      # Dependencies (provider, google_fonts, cached_network_image, intl)
│
├── backend/              # Node.js + Express REST API (Port 4000)
│   ├── src/database/     # SQLite database (better-sqlite3) with WAL mode & seeders
│   └── src/routes/       # Menu, categories, addons, orders, reservations, coupons, auth
│
├── website/              # Public customer-facing restaurant website (Port 3000)
│   ├── src/app/          # Next.js App Router (Menu, Cart, Checkout, Order Tracker, Reservations, etc.)
│   └── src/components/   # UI components (Navbar, Footer, FoodCard, FoodModal, SpiceMeter, etc.)
│
├── admin/                # Dedicated restaurant operations & admin dashboard (Port 3001)
│   ├── src/app/          # Next.js App Router (Dashboard, Orders, Menu, Categories, Add-ons, etc.)
│   └── src/components/   # AdminSidebar, AdminHeader, modals, file upload
│
└── package.json          # Root scripts to run website, admin, and backend
```

---

## 🚀 Quick Start

### 1. Run Both Apps Concurrently
From the root `NonVeg404` folder:

```bash
# Terminal 1: Customer Website
npm run dev:website

# Terminal 2: Admin Portal
npm run dev:admin
```

- **Customer Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Portal**: [http://localhost:3001](http://localhost:3001)

---

## 🖥️ Portals & Features

### 1. `website/` (Customer Experience)
- **Design Concept**: Dark obsidian (`#070709`), Amber Gold (`#F59E0B`), and Crimson (`#EF4444`) with subtle developer/terminal elements.
- **Official Brand Logo**: Official rooster/coding logo used across header, footer, loading states, and favicon.
- **Full Responsiveness**: Mobile-first design with touch-friendly drawer navigation, responsive bottom sheets for dish configuration, and fluid layouts for tablets/desktops.
- **Pages Included**:
  - `/` (Home page with Hero terminal, featured specials, developer combos, testimonials, telemetry)
  - `/menu` (Filter by 10 categories, heat level slider, search, quick add)
  - `/cart` (Dynamic checkout preview, add-on upsells, coupon code validator)
  - `/checkout` (Delivery / Pickup options, address validator, payment simulator)
  - `/track-order` (Live 6-stage deployment pipeline with telemetry logs)
  - `/reservations` (Zone booth selector: Core #01, Thread #04, Cluster #08, Kernel #12)
  - `/gallery` (High-res food photography grid with modal view)
  - `/offers` (Developer promo vouchers: `SUDO_50`, `DEV_NIGHT_40`, etc.)
  - `/about` & `/contact` (Developer origin story, system health check)
  - `/privacy-policy`, `/terms-and-conditions`, `/refund-policy`, `/cancellation-policy`, `/delivery-policy`

### 2. `admin/` (Kitchen & Restaurant Management UI)
- **Dashboard Overview (`/`)**: Real-time sales telemetry, active order queue, kitchen load gauge, quick actions.
- **Order Pipeline (`/orders`)**: Kanban/table view with real-time status transitions (`Pending` ➔ `Confirmed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`), order manifest details.
- **Menu Inventory (`/menu`)**: Live stock toggles, price updates, spice calibrator, add new dish modal.
- **Category Control (`/categories`)**: Manage menu sections and icon mappings.
- **Add-on Modifiers (`/addons`)**: Manage sides, dips, extra gravy, and custom pairings.
- **Table Reservations (`/reservations`)**: Manage dining zone booths, guest party sizes, reservation status.
- **Developer Loyalty (`/customers`)**: Track customer order frequencies, VIP developer tiers (`Kernel VIP`, `Sudo Dev`, `Script Kiddie`).
- **Promo Codes (`/offers`)**: Issue and inspect promo vouchers with discount caps and expiry dates.
- **Reviews Moderation (`/reviews`)**: Monitor customer feedback, star ratings, and git-commit hashes.
- **Kitchen Settings (`/settings`)**: Operating hours, Late Night Dev Shift toggles, surge pricing calibrator, delivery radius.

---

## 🛠️ Build & Verification

```bash
# Build website bundle
npm run build:website

# Build admin bundle
npm run build:admin
```
Both applications compile statically with **0 lint or type errors**.
