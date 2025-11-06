# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mayand is a PWA (Progressive Web App) for quoting large-format printing services. Built with Next.js 15 (App Router), TypeScript, and Tailwind CSS 4.0. The app is a single-page application with a fixed layout (100vh/100vw) optimized for both desktop (2-column grid) and mobile devices.

## Common Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint

# Note: There is no test suite configured currently
```

## Architecture & Business Logic

### Pricing Model (src/lib/calculations.ts)

All materials are priced by **linear meters** (height in meters):

**Normal Prices:**
- **Vinil**: 150 MXN/linear meter (max width: 150cm)
- **Vinil Transparente**: 180 MXN/linear meter (max width: 150cm)
- **Lona**: 75 MXN/linear meter (max width: 180cm)

**Promotional Prices** (activated via toggle):
- **Vinil**: 120 MXN/linear meter
- **Vinil Transparente**: 160 MXN/linear meter
- **Lona**: 70 MXN/linear meter

- **IVA**: 16% tax applied to all quotes
- **Height range**: 1-3600 cm (0.01m - 36m)

The `calculateQuote()` function accepts an `isPromotion` boolean parameter to switch between normal and promotional pricing.

### State Management Pattern

The app uses **unidirectional data flow**:
1. `DimensionCalculator` component captures user input (width, height, material, isPromotion)
2. Calls `onChange` callback with validated dimensions and promotion status
3. `page.tsx` receives all parameters and calls `calculateQuote(width, height, material, isPromotion)`
4. `QuoteDisplay` receives the computed `QuoteData` object and displays results with promotion badge if active

This pattern is critical - do NOT add local state to `QuoteDisplay` or duplicate calculations.

### Material-Specific Validation (src/components/DimensionCalculator.tsx)

Width validation is **material-dependent**:
- Vinil/Vinil Transparente: max 150cm
- Lona: max 180cm

When switching materials, the component automatically re-validates and clamps width if it exceeds the new material's limit (see `handleMaterialChange`).

### WhatsApp Integration (src/app/page.tsx:26-61)

The app detects mobile/desktop and uses appropriate WhatsApp URLs:
- Mobile: `whatsapp://send?text=...` (opens WhatsApp app)
- Desktop: `https://wa.me/?text=...` (opens WhatsApp Web)

The quote message is pre-formatted with dimensions, material, pricing breakdown, and total.

## Key Technical Details

### PWA Configuration
- Manifest: `public/manifest.json` with brand color #110363
- Service Worker: `public/sw.js` for offline support
- Theme: Dark mode only (forced in page.tsx useEffect)

### Import Alias
All imports use `@/*` path alias mapping to `./src/*` (configured in tsconfig.json)

### Styling Conventions
- Uses shadcn/ui components from `src/components/ui/`
- Custom CSS classes in `src/app/globals.css` (e.g., `glassmorphism`, `fade-in`, `hover-lift`)
- Tailwind with custom theme based on #110363 brand color

### Layout Structure
- Desktop (lg+): Fixed 2-column grid (calculator | quote display)
- Mobile: Single column with vertical scroll
- Header contains logo and WhatsApp share button
- Footer shows attribution and social links (Facebook, Instagram)

## Important Notes

1. **No Tests**: The project has a jest.config.ts but no test files. When adding features, tests are not required unless specifically requested.

2. **Dimension Units**: The app displays "metros lineales" (linear meters) calculated from height only. Do not confuse this with square meters (m²).

3. **Logo Files**: Both light and dark logos exist (`LOGO_LIGHT.svg`, `LOGO_DARK.svg`). Currently only dark logo is used.

4. **Unused Material State**: In page.tsx:15, there's an unused `material` state variable with eslint-disable comment. This can be removed if refactoring.

5. **Social Media Links**: The footer contains placeholder links to facebook.com/mayand and instagram.com/mayand - these are not verified URLs.
