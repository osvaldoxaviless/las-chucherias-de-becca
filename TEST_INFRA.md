# E2E Test Infra: Las chucherías de Becca

## Test Philosophy
- Opaque-box and requirement-driven derived from `ORIGINAL_REQUEST.md`.
- Methodology: Category-Partition, Boundary Value Analysis (BVA), Pairwise Combinatorial Testing, and Workload Journey Testing.
- Framework: Vitest 2.1.8 + Happy-DOM + @testing-library/react + @testing-library/jest-dom.

## Feature Inventory Coverage (Tiers 1–4)
| Feature | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Cross-Feature) | Tier 4 (Workload) | Total Tests |
|---------|:----------------:|:-----------------:|:----------------------:|:-----------------:|:-----------:|
| Admin PIN 2026 Unlock (F1, F2) | 8 | 18 | 15 | 10 | 51 |
| Settings Sync & Persistence (F3) | 6 | 8 | 10 | 6 | 30 |
| "Arma tu pastel" Silhouettes (F4, F5) | 12 | 16 | 14 | 8 | 50 |
| Dual Mode & Cake Mechanics (F6, F7) | 8 | 14 | 12 | 6 | 40 |
| Mobile 2-Column Catalog Grid (F8) | 5 | 5 | 4 | 4 | 18 |
| Accessible Touch Targets >=44px (F9) | 8 | 6 | 6 | 4 | 24 |
| Toast Non-Collision (F10) | 4 | 4 | 4 | 2 | 14 |
| iOS WebKit Auto-Zoom Prevention (F11) | 4 | 6 | 4 | 2 | 16 |
| Category Filter 'cajas-regalo' (F12) | 4 | 4 | 4 | 2 | 14 |
| Copywriting Depuration (F13) | 8 | 6 | 6 | 4 | 24 |

## Test Architecture
- Test Runner: Vitest (`npm run test`)
- Environment: Happy-DOM
- Test directory: `src/test/`
  - `adminPin.test.tsx`
  - `adminPin.challenge.test.tsx`
  - `m1Adversarial.test.tsx`
  - `cakeCustomizer.test.tsx`
  - `cakeCustomizer.challenge.test.tsx`
  - `m2Adversarial.test.tsx`
  - `m2Adversarial.challenge.test.tsx`
  - `mobileUxAndCopy.test.tsx`
  - `m3Adversarial.challenge.test.tsx`
