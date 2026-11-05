# CraftNest UI Refactor Brief — DESIGN.md compliance

This brief governs ALL page-level UI refactors. The design system lives in
`client/src/index.css`. Read that file first. `DESIGN.md` (monochrome core +
pastel color-block rhythm) is the authoritative visual source of truth.

## What the system is

- **Monochrome chrome**: black `#0d0d0d` (primary) + white canvas carry every
  heading, body line, form field, table, footer link, and PRIMARY CTA.
- **Pastel color-block sections** are the depth device. NO gradients, NO glass,
  NO glowing, NO heavy shadows. Use these classes:

| Purpose | Classes |
|---|---|
| Color block section (24px radius, 48px padding) | `.color-block` + `.block-lime` / `.block-lilac` / `.block-cream` / `.block-mint` / `.block-pink` / `.block-coral` / `.block-navy` |
| Sticky-note accent (slightly rotated) | `.sticky-note .sticky-note--lilac/--pink/--mint` |
| Hero panel (32px radius) | add `.color-block-hero` |
| Navy block inverts text automatically | (use `.t-*` inside as usual) |

- **Only ONE color block visible per viewport.** Pages must relax to white
  canvas between blocks (use `.section-padding` sections).
- **Pill is the only button shape.** Circle is the only icon-button shape.

## Buttons (pill ONLY)

| Variant | Class | Usage |
|---|---|---|
| Primary CTA (black pill) | `.btn .btn-primary` | "Get started", "Place order", "Checkout", Add to cart (full text) |
| Secondary (white pill, hairline) | `.btn .btn-secondary` (alias `.btn-outline`) | "Contact sales"-type secondary actions |
| Tertiary text pill | `.btn .btn-ghost` | quiet nav/link-ish actions |
| Destructive (error text, hairline) | `.btn .btn-danger` | cancel / delete / refund actions |
| Promo pink (ONE per page max) | `.btn .btn-magenta` | rare promo CTA on a lilac banner |
| Icon circle (40px) | `.btn-icon` (+ `.btn-icon-primary` black, `.btn-icon-ghost`, `.btn-icon-inverse` on navy) | add-to-cart small, steppers, close, carousel |
| Sizes | `.btn-sm` (36px), `.btn-lg` (52px) | dense vs hero |
| Row | wrap buttons in `.btn-row` | collapses to full-width pills under 560px |

States are prebuilt: hover, active (scale .98), `:disabled` (opacity .4),
`:focus-visible` (global 2px black outline). Loading: `<div className="spinner-sm" />`
inside the `.btn`.

## Typography roles (USE THESE CLASSES, not ad-hoc font styles)

`.t-display-xl` (86→48px, w340) · `.t-display-lg` (64→40px, w340) ·
`.t-headline` (26px, w540, story-block titles) · `.t-subhead` (26px, w340) ·
`.t-card-title` (24px, w700) · `.t-body-lg` (20px, w330) · `.t-body` (18px,
w320 — DEFAULT body) · `.t-body-sm` (16px, w330) · `.t-link` (20px, w480) ·
`.t-eyebrow` (mono 18px) · `.t-caption` (mono 12px — eyebrows/labels/chips).

Rules:
- Weights allowed: **320, 330, 340, 450, 480, 540, 700** (`w320…w700` utils).
- **NO mid-gray text anywhere.** Secondary text = same ink color at weight 330.
- `figmaMono` (`.t-eyebrow`, `.t-caption`) is taxonomy ONLY — eyebrows, column
  heads, chips, price/value labels. Never set paragraphs in mono, always UPPERCASE.
- Migrated font constants: `var(--font-sans)` = Inter, `var(--font-mono)` = JetBrains Mono.

## Colors

Variables of record: `--color-primary`, `--color-on-primary`, `--color-canvas`,
`--color-inverse-canvas`, `--color-surface-soft`, `--color-hairline`,
`--color-hairline-soft`, `--color-accent-magenta`, `--color-ink`,
`--color-inverse-ink`, `--color-semantic-success`, `--color-error`,
`--color-block-*`.
- Old warm tokens are aliased (`--color-forest-green`→primary,
  `--color-terracotta`→primary, `--color-warm-cream`→block-cream,
  `--color-border`→hairline). Do NOT use them; use system variables.
- Ratings/stars are mono too: `var(--color-star)`.
- Success checkmarks: `var(--color-semantic-success)`. Errors:
  `var(--color-error)` text + `.badge-error`/`.error-surface` surfaces.

## Layout & spacing

- Spacing tokens: `--space-hair/xxs/xs/sm/md/lg/xl/xxl/section` (1/4/8/12/16/24/32/48/96).
- NEVER write raw odd values (`13px`, `17px`); snap to usable tokens for paddings/margins/gaps/typography gaps. (For in-component nips like icon nudges, 10px/14px type values are tolerated only when a token would distort the geometry — keep them rare.)
- Radius tokens: `--radius-sm` 6 (chips/sticky notes), `--radius-md` 8 (inputs,
  image frames, tiles), `--radius-lg` 24 (cards, blocks), `--radius-xl` 32
  (hero panels), `--radius-pill` / `--radius-full`.
- Grid: `.container` (max 1280 + gutters), `.section-padding` (96px rhythm),
  `.grid-2/3/4`, `.page-stack`, `.toolbar`, `.toolbar-spacer`.
- Images always in `.img-frame` (8px radius) or `.thumb-ring`.

## Components (prebuilt classes — do not re-invent)

| Component | Classes |
|---|---|
| Card (hairline stroke, no shadow) | `.card` (+`.is-clickable` hover) |
| Soft tile (surface-soft, 8px) | `.card-tile` / `.tile` |
| Floating dropdown | `.card-floating` / `.menu-popover` / `.menu-item` |
| Table | `.table-wrap > .table-scroll > .table` |
| Stat (dashboard) | `.stat-card` + `.stat-label/.stat-value/.stat-sub` |
| Badges/chips | `.badge` + `.badge-forest .badge-terracotta .badge-cream .badge-navy .badge-pink .badge-coral .badge-mint .badge-success .badge-warning .badge-error .badge-neutral .badge-outline` |
| Forms | `.form-group .form-label .form-input/.form-select/.form-textarea .form-hint .form-hint-error .form-check .form-checkbox` (error: `.is-error`) |
| States | `.empty-state`, `.page-loading`+`.spinner`, `.error-surface` |
| Progress/stepper | `.progress-track/.progress-fill`, `.step-dot/.step-line` |
| Inputs in bars | `.nav-search` (pill input) |

## Mandatory screens states

Every async page must show: `.page-loading` block while fetching; `.error-surface`
(or toast) on failure; `.empty-state` for no data with a `.btn` retry/CTA.
Buttons must show disabled/loading during submit.

## Responsive breakpoints (approx)

- 960px: dashboards collapse to drawer nav (already handled in DashboardLayout);
  pricing/comparison → simplified stacking; nav → hamburger (handled).
- 768px: `.color-block` bleeds edge-to-edge and loses corners (handled by CSS).
- 560px: display type reduces (handled), `.btn-row .btn` goes full-width, grids
  become 1 column; horizontal scrolling tables use `.table-scroll`.

## Hard rules for every file you touch

1. Preserve ALL business logic: imports, api calls, handlers, state, router
   links, context usage, conditionals, toasts. Change presentation only.
2. Replace inline decorative style objects with system classes; small inline
   styles are fine for layout (grid/flex/gap/width) but must reference design
   tokens for colors/radii/spacing (e.g. `borderRadius: 'var(--radius-lg)'`).
3. Blocks: one per viewport, return to white canvas between sections, generous
   internal margins in blocks (type sits in a poster-like single column).
4. Every CTA pill. Every icon button circle. No square buttons. No gradients.
   No glassmorphism. No decorative blobs. Black stays scarce (one primary CTA
   per viewport when possible).
5. Labels required on all form fields (never placeholder-only). Valid icon
   usage: lucide-react, consistent 15–18px.
6. `aria-label` on icon-only buttons; `aria-hidden` on decorative icons.
7. Keep font sizes on a 12/14/15/16/17/18/20/22/26/30/64/86 rhythm; use the
   `.t-*` classes when they fit.
