# CraftNest — Responsive Design System & Navigation Architecture

Status: **QA-complete** (post Phase 8/9 responsive implementation pass)
Owner: Senior Product Design & UX Engineering
Applies to: `client/src/**` (React + Vite storefront, buyer/seller/admin surfaces)

---

## 1. Responsive Design Strategy

CraftNest uses a **mobile-first, token-driven responsive system** built on the
design tokens in `client/src/index.css` (`--container-*`, `--space-*`,
`--radius-*`, `--color-*`, `--font-*`, `--z-*`) and the typography roles
(`t-display-*`, `t-subhead`, `t-headline`, `t-card-title`, `t-body`,
`t-caption`, etc.).

Approach:

1. **Mobile-first defaults** — base styles target the smallest viewport first;
   enhancements layer on via `min-width` media queries.
2. **Fluid type & spacing** — `clamp()` for display type (e.g. hero
   `clamp(3rem, 1.3rem + 4.86vw, 5.375rem)`), fluid grids via
   `repeat(auto-fit, minmax(min(100%, Xpx), 1fr))` so tracks never force
   overflow below their minimum.
3. **Breakpoints** — adopted breakpoints are listed in §2.
4. **Fixed chrome** — nav bars are sticky/fixed; page content gets a safe-area
   aware bottom offset on phones.

---

## 2. Supported Breakpoints

| Tier           | Range          | Layout                          |
| -------------- | -------------- | ------------------------------- |
| Small Mobile   | 320–374px      | Compact mobile (smallest Android) |
| Standard Mobile| 375–480px      | Mobile                          |
| Large Mobile   | 481–767px      | Mobile (large phones)           |
| Tablet         | 768–1023px     | Tablet (top-nav / drawer)      |
| Small Desktop  | 1024–1279px    | Compact desktop                 |
| Desktop        | 1280–1536px    | Desktop                         |
| Large Desktop  | 1536px+        | Expanded desktop                |

Implementation switches in `client/src/index.css`:

- `max-width: 560px` — top-bar compaction, full-width CTA rows.
- `max-width: 767px` — mobile bottom navigation becomes visible.
- `min-width: 900px` — desktop top-nav (inline links + search + auth CTAs) appears.
- `max-width: 960px` — Seller/Admin dashboard sidebar becomes a slide-in drawer.

---

## 3. Navigation Architecture

### A. Mobile navigation (< 768px)

- **Primary:** fixed bottom navigation bar (`components/common/MobileBottomNav.jsx`,
  `.mobile-bottom-nav` / `.mobile-nav-item`).
  - Destinations: **Home, Shop, Cart, Account** (4 primary destinations).
  - Active state: ink (black) pill + light text; inactive: ink text.
  - Touch targets: ≥ 44px tall items (bar height `calc(60px + env(safe-area-inset-bottom))`).
  - Safe-area aware (`env(safe-area-inset-bottom)`) for iOS notch / Android gesture bar.
  - Page content offset via `.app-main { padding-bottom: ... }` under the same media query.
- **Secondary:** top-bar hamburger overlay (`Navbar.jsx`) for categories,
  search, auth CTAs, seller entry — unchanged information architecture.

### B. Tablet navigation (768–1023px)

- Top-nav pattern with hamburger overlay retained (nav collapses below 900px;
  the compact inline-top-nav experiment at 768–899px was removed after QA
  confirmed horizontal overflow — see §7 known issues).

### C. Desktop navigation (≥ 900px)

- Sticky white top bar: wordmark, search (max 400px), inline category links,
  wishlist/cart icon actions, auth pills or user menu.

### D. Seller / Admin consoles

- Own shells (`SellerLayout`, `AdminLayout` + shared `DashboardLayout`) with
  fixed sidebar (≥ 961px) → slide-in drawer (< 960px). No bottom nav; they are
  workspace surfaces and are excluded from the storefront bottom nav.

### E. Navigation consistency

- Buyer-facing surfaces (MainLayout) share the same IA; role-aware links
  (seller/admin gating) are preserved.
- Navigation state, active routes, permissions, and auth behaviour are shared.

---

## 4. Component Responsiveness

- **Cards/grids:** fluid `minmax(min(100%, Xpx), 1fr)` tracks; hero and category
  grids hardened for 320px+.
- **Forms:** full-width mobile inputs, touch-friendly controls (≥ 44px targets),
  visible focus states.
- **Tables:** horizontally scrollable containers only when necessary; complex
  tables may collapse to stacked cards (per redesign).
- **Modals:** centered on desktop; bottom-sheet semantics where implemented;
  scroll-lock handled by toast/modal layers.
- **Dropdowns/menus:** tap-friendly; overlay menus clamped within viewport.
- **Charts:** responsive container widths; legends/tooltips per chart component.
- **Search/filter:** top-bar search collapses into hamburger overlay on phones.

---

## 5. Accessibility & Interaction

- WCAG 2.2 AA: contrast, semantic HTML, heading order, labels, keyboard nav,
  visible focus (`:focus-visible`), ARIA (`aria-current`, `aria-expanded`,
  `aria-haspopup`, menu roles).
- Touch targets ≥ 44×44 CSS px (bottom nav items, buttons, inputs).
- No info communicated by color alone (active pills + labels).
- `prefers-reduced-motion` respected in transitions.

---

## 6. Testing Results (this pass)

| Viewport  | Overflow | Bottom nav | Top nav | Notes |
| --------- | -------- | ---------- | ------- | ----- |
| 320×640   | ✅ none  | ✅ shown   | hamburger | grids + CTA buttons fixed (`minmax(min(100%,…))`, `min-width:0`) |
| 390×844   | ✅ none  | ✅ shown   | hamburger | logged-out auth cluster moved to overlay |
| 430×932   | —        | —          | —       | covered by 481–767 tier |
| 768×1024  | ✅ none  | hidden     | hamburger | desktop links only ≥ 900px |
| 1024×768  | ✅ none  | hidden     | inline   | desktop nav pattern |
| 1366×768  | ✅ none  | hidden     | inline   | laptop |
| 1440×900  | ✅ none  | hidden     | inline   | desktop |
| 1920×1080 | —        | hidden     | inline   | covered by ≥1280 tier |

- Automated browser checks (Playwright): `scrollWidth === clientWidth` on
  `/`, `/shop`, `/cart`, `/checkout`, `/login`, `/register`, `/about` at
  390px; home at 320/768/1024/1440; overlay menu open state.
- Build: ✅ `vite build` passes (chunk-size warning only).
- Lint: ✅ `npm run lint` (oxlint) passes, exit 0.

---

## 7. Known Limitations / Follow-ups

1. **Tablet (768–899px)** currently uses the hamburger overlay rather than an
   inline link row — an inline-top-nav experiment caused horizontal overflow and
   was reverted. A proper compact tablet nav (rail) remains a candidate.
2. **Charts** — responsive behaviour assumed; visual QA at tablet widths for
   analytics screens pending.
3. **Console warnings** — pre-existing React-hooks lint warnings (setState in
   effect, impure render, unused catch params) remain; non-blocking.
4. **Chunk size** — production bundle ~529 kB JS / 25 kB CSS (warning only).

---

## 8. Change Log (responsive pass)

- Added `MobileBottomNav` (fixed bottom primary nav, safe-area aware, active pill).
- Mounted bottom nav in buyer-facing `MainLayout`; content offset via `.app-main`.
- Bottom nav visible < 767px; desktop top nav ≥ 900px.
- Hardened all `minmax()` grids with `min(100%, …)` floor.
- Added `min-width: 0` guards for grid/flex shrink.
- Moved signed-out Log In/Join CTAs into mobile overlay (overflow fix).
- Marquee ellipsis clipping fix (overflow fix).
