# Project: Las chucherías de Becca — Auditoría y Optimización Integral

## Architecture
- **Framework**: React 18 + TypeScript + Vite + Tailwind CSS.
- **State Management**: React `useState` / `useEffect` with browser `localStorage` persistence.
- **Key Modules**:
  - `AdminPanel.tsx` & `App.tsx`: Authentication (PIN), configuration state (`StoreConfig`), catalog admin.
  - `CakeCustomizer.tsx` & `index.css`: Interactive cake builder, SVG visualizer, tier geometries, color/flavor mapping, price calculator, WhatsApp quote creator.
  - `ProductCard.tsx`, `CategoryFilter.tsx`, `CartDrawer.tsx`, `ProductDetailModal.tsx`: Product catalog, filtering, cart management, checkout summary, WhatsApp order generation.
  - `Toast.tsx`, `Navbar.tsx`, `Hero.tsx`: Site navigation, responsive layout, notifications, brand messaging.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Resilient Config Hydration & Default Merge | Merge `localStorage` cached data with `DEFAULT_STORE_CONFIG` in `App.tsx` so `config.adminPin` is never `undefined`. | M1 | survey (Explorer 1) |
| F2 | Normalized Admin PIN Validation & Master Fallback | Validate PIN with `.trim()`, string coercion, and fallback acceptance of master default `'2026'`. | M1 | survey (Explorer 1) |
| F3 | Sanitized Settings Persistence & Modern Feedback | Sanitize PIN inputs, add missing business fields (`storeName`, `address`, etc.), replace dummy `alert()` with inline UI feedback. | M1 | survey (Explorer 1) |
| F4 | Elimination of Duolingo/Tacky Animations | Remove `@keyframes duolingoSquash`, `dropTier`, `flameFlicker`, `sparklePop`, and `.animate-cake-bounce` from `src/index.css` and `CakeCustomizer.tsx`. | M2 | survey (Explorer 2) |
| F5 | Modern Editorial SVG Cake Visualizer | Replace cartoon clipart with modern, elegant pastry silhouette, ceramic pedestal, distinct proportions for Bento, 1 Piso Clásico, 1 Piso Alto y 2 Pisos. | M2 | survey (Explorer 2) |
| F6 | Layer Cutaway & Realistic Textures | Add dual visual mode ("Vista Exterior" vs "Corte en Capas"), realistic piping, refined botanical toppings and dedication plaque. | M2 | survey (Explorer 2) |
| F7 | Mobile-First Sticky Action Bar for Cake Builder | Add mobile floating action bar with live price and immediate add-to-order button so users don't lose context while scrolling options. | M2 | survey (Explorer 2) |
| F8 | 2-Column Responsive Mobile Catalog Grid | Update catalog from `grid-cols-1` to `grid-cols-2` on mobile (`<640px`) to eliminate excessive 3,500px vertical scroll. | M3 | survey (Explorer 3) |
| F9 | Mobile Touch Target Accessibility (>=44x44px) | Enlarge hit-areas of quantity `+`/`-` buttons, delete button, modal close, and mobile navigation to meet Apple/Google 44px ergonomics. | M3 | survey (Explorer 3) |
| F10 | Non-Colliding Toast & Sticky Layouts | Relocate Toast notifications to top of screen so they don't cover the mobile sticky cart/order bar. | M3 | survey (Explorer 3) |
| F11 | iOS Auto-Zoom Form Prevention | Ensure form inputs on mobile use `text-base sm:text-xs` to prevent WebKit viewport zoom on Instagram browser. | M3 | survey (Explorer 3) |
| F12 | Complete Category Filter | Add missing `'cajas-regalo'` category tab to `CategoryFilter.tsx`. | M3 | survey (Explorer 3) |
| F13 | Copywriting Depuration & Redundancy Removal | Eliminate 6x defensive shipping warnings, remove meta-technical jargon ("animación interactiva"), adopt appetizing boutique bakery copy. | M3 | survey (Explorer 3) |
| F14 | Comprehensive Automated Test Suite | Install Vitest + Testing Library + Happy-DOM, build Tier 1-4 tests verifying PIN unlock, customizer, and responsive UI. | E2E Track / M4 | survey (Explorer 3) |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Admin PIN Authentication & Settings Sync | F1, F2, F3 (`App.tsx` config hydration, `AdminPanel.tsx` validation & settings) | none | DONE |
| M2 | "Arma tu pastel" Visual & Mechanics Redesign | F4, F5, F6, F7 (`CakeCustomizer.tsx`, `index.css`) | none | DONE |
| M3 | Mobile-First UX & Copywriting Synthesis | F8, F9, F10, F11, F12, F13 (`ProductCard`, `CartDrawer`, `Hero`, `CategoryFilter`, `Toast`, `whatsapp.ts`, `App.tsx` catalog grid) | M1, M2 | DONE |
| M4 | Final Milestone: 100% E2E Pass & Hardening | F14 (Pass all E2E tests Tiers 1-4, then Tier 5 adversarial coverage hardening) | M1, M2, M3, TEST_READY.md | DONE |

## Interface Contracts
### StoreConfig ↔ AdminPanel & App
- `StoreConfig` interface in `src/types.ts`:
  ```typescript
  export interface StoreConfig {
    storeName: string;
    instagramHandle: string;
    whatsappNumber: string;
    address: string;
    city: string;
    announcementText: string;
    bannerVisible: boolean;
    isStoreOpen: boolean;
    adminPin: string;
    currency: string;
  }
  ```
- Contract Rule: `config.adminPin` is guaranteed to be a non-empty string in state. PIN verification accepts `enteredPin === config.adminPin || enteredPin === '2026'`.

### CustomCakeQuote ↔ Cart & WhatsApp
- `CustomCakeQuote` payload format defined in `src/types.ts`:
  ```typescript
  export interface CustomCakeQuote {
    tier: string;
    flavor: string;
    filling: string;
    frosting: string;
    toppings: string[];
    hasCandle: boolean;
    dedicationText: string;
    estimatedPrice: number;
  }
  ```
- Contract Rule: `handleAddCustomCakeToCart` adds a `CartItem` with `id: custom-cake-${Date.now()}`. `createWhatsAppCakeQuoteUrl` accepts `quote: CustomCakeQuote` and `config: StoreConfig` and returns an encoded WhatsApp URL.

## Code Layout
- **M1 Write Boundaries**:
  - `src/components/AdminPanel.tsx`
  - `src/App.tsx` (Lines 20–40: `config` state initialization)
  - `src/data/config.ts`
  - Optional cleanup: `src/components/AdminModal.tsx`
- **M2 Write Boundaries**:
  - `src/components/CakeCustomizer.tsx`
  - `src/index.css`
- **M3 Write Boundaries**:
  - `src/components/ProductCard.tsx`
  - `src/components/CartDrawer.tsx`
  - `src/components/Hero.tsx`
  - `src/components/CategoryFilter.tsx`
  - `src/components/Toast.tsx`
  - `src/components/Navbar.tsx`
  - `src/components/ProductDetailModal.tsx`
  - `src/utils/whatsapp.ts`
  - `src/App.tsx` (Catalog grid layout)
- **E2E Testing Track Boundaries**:
  - `package.json` (testing dependencies & scripts)
  - `vite.config.ts` (test configuration if needed)
  - `src/test/**` or `tests/**` (all test files and mocks)
  - `TEST_INFRA.md`, `TEST_READY.md`
