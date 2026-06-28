# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Appli-facture is a French-language invoicing/billing single-page app targeting Senegalese businesses (Dakar and region). It manages clients, products, invoices (factures), quotes (devis), and payments (paiements). UI strings are in French — keep all new user-facing labels and messages in French.

### Business rules (non-negotiable conventions)

- **Currency: FCFA (XOF) only, no conversion.** Single currency throughout.
- **All money amounts are stored as integers** — FCFA has no decimals. Round at storage time, not just on display.
- **Standard VAT (TVA): 18%.**
- **Date format: `jj/MM/AAAA`** (day/month/year, `fr-FR`).
- **Invoice numbering: `FAC-AAAA-NNNN`** — prefix `FAC`, 4-digit zero-padded sequence per year.

Current state: front-end-only MVP. Data is seeded from mock data and **persisted to `localStorage`** (no backend/database yet). Implemented modules: **Dashboard, Clients, Factures (invoices)** — full CRUD + detail/print view. Still stubbed placeholders ("en construction"): **Produits, Devis, Paiements, Paramètres**.

## Commands

```bash
npm install        # install deps
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # type-check (tsc -b) + production build to dist/
npm run preview    # serve the production build
npm run lint       # ESLint over the whole project
```

There is no test runner configured — no `test` script, no test framework in devDependencies. Do not invent test commands; if tests are needed, set up the tooling first.

## Architecture

Stack: React 18 + TypeScript + Vite, React Router v6, Tailwind CSS, lucide-react icons.

**Single global store via Context.** `src/context/AppContext.tsx` is the heart of the app. It holds *all* domain state (clients, products, invoices, quotes, payments, users, settings, currentUser) in `useState` and exposes every mutation as a CRUD function (`addClient`, `updateInvoice`, `convertQuoteToInvoice`, etc.). Components read and write through the `useApp()` hook — there is no Redux, no server calls, no React Query. When adding a feature, extend the `AppContextType` interface and the provider value together. State is seeded from `src/data/mockData.ts`, then **loaded from / saved to `localStorage`** (key `appli-facture:data:v1`) via two `useEffect`s — clients/products/invoices/quotes/payments/settings persist across reloads; `users` and `currentUser` are not persisted (auto-login remains a demo). Note: persisted dates come back as ISO **strings**, so date helpers accept `Date | string`.

**Domain model lives in one file.** `src/types/index.ts` defines every entity (`Client`, `Product`, `Invoice`, `Quote`, `Payment`, `User`, `AppSettings`) and the status string-literal unions (e.g. invoice `'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'`). Treat this as the source of truth; changing a shape here ripples through context and components.

**Business logic is centralized in `src/utils/format.ts`**, not in components: `calculateInvoiceTotals` (subtotal → discount per line → tax → shipping, all rounded to integers), `generateInvoiceNumber`/`generateQuoteNumber` (`FAC`/`DEV` prefix + 4-digit per-year sequence), `quoteToInvoice` (typed `Quote → Invoice`), and the `formatCurrency`/`formatDate` helpers. Reuse these rather than recomputing totals or formatting inline. IDs are generated with `Math.random().toString(36).substring(2, 10)`.

**Routing & auth.** `src/App.tsx` wires routes: `AppProvider` → `Router` → an `AuthGuard`-protected branch rendering `MainLayout` (which holds the `<Outlet/>` + `Navbar`). `src/components/auth/AuthGuard.tsx` gates on `currentUser`, but the MVP **auto-logs-in as `users[0]`** in the provider's `useEffect`, so the guard rarely blocks. `login()` only checks that an email exists (password param is `_password`, ignored). The Factures routes (`/invoices`, `/invoices/new`, `/invoices/:id`, `/invoices/:id/edit`) are wired to real pages; remaining stubbed routes (products, quotes, payments, settings) render inline placeholder divs in `App.tsx` — replace these with real pages as features are built.

**Folder conventions** under `src/`: `pages/` = route-level screens (feature-subfoldered, e.g. `pages/clients/`), `components/` = reusable UI grouped by domain (`clients/`, `dashboard/`, `auth/`) plus `components/common/` for shared primitives (`Button`, `Navbar`, `PageHeader`, `StatusBadge`). `layouts/` holds `MainLayout`. Follow the existing **invoices feature** (`pages/invoices/*` + `components/invoices/InvoiceForm`/`InvoiceList`) as the closest template when building out Devis (quasi-identical) and Paiements; the clients feature is the template for simpler entities (Produits).

## Conventions

- Currency: always format money through `formatCurrency` (FCFA, no decimals, space separators). The currency symbol is configurable via `AppSettings.currencySymbol`.
- Default tax/payment terms come from `AppSettings` (`defaultTaxRate`, `defaultPaymentTerms`) — read settings rather than hardcoding.
- Styling is Tailwind utility classes inline; no CSS modules. `src/index.css` carries the Tailwind directives.
- `lucide-react` is excluded from Vite's dep optimization (see `vite.config.ts`) — expect it imported per-icon.
