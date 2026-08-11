<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ShopHub Frontend

Next.js 16.3.0 (App Router) + React 19 + TypeScript strict + Tailwind CSS v4 + TanStack Query v5. Frontend only — the API is a sibling repo (`shophub-server`, Express + Prisma + PostgreSQL); start it first.

## Commands
- `npm run dev` — dev server on port 3000
- `npm run lint` — ESLint only (no typecheck)
- `npm run build` — production build (runs typecheck)
- No test framework. To typecheck quickly: `npx tsc --noEmit`
- Path alias `@/*` → `src/*`

## Backend API
- Base URL comes from `NEXT_PUBLIC_API_URL` in `.env.local` (gitignored, not committed) → `http://localhost:5000/api`. Gotcha: the fallback hardcoded in `src/lib/axios.ts:4` is `http://localhost:4000/api` — on a fresh clone without `.env.local` you'll hit the wrong port.
- Every response is wrapped as `{ success, message, data }`. Unwrap with `extractData()` from `src/lib/axios.ts` (never read `res.data` directly).

## Auth & route guards
- JWT stored in localStorage key `shophub_token` and mirrored to a non-HttpOnly cookie `auth-token` so the edge layer can read it (`src/lib/auth.ts`). Tokens are decoded client-side without verification — trust the backend for that.
- `src/proxy.ts` is Next 16's renamed middleware (formerly `middleware.ts`). It redirects unauthenticated users off `/profile`, `/cart`, `/checkout`, `/orders`, `/admin`, and redirects logged-in users away from `/login`/`/register`.
- ADMIN role gating is **client-side only** in `src/app/admin/layout.tsx` — the proxy only checks for a token, not the role.
- The axios response interceptor clears the token and hard-redirects to `/login` on any 401.

## Data layer
- React Query v5: hooks in `src/hooks/` call services in `src/services/`, which use the shared `apiClient`. Mutations toast via `sonner` on success/error. Query-key prefixes are exported constants from the hook file (e.g. `PRODUCTS_KEY`).
- Shared providers (`QueryClientProvider`, auth, cart, `Toaster`) live in `src/app/providers.tsx`.

## Styling
- Tailwind v4, CSS-first config: there is **no `tailwind.config.js`**. Design tokens are defined in the `@theme` block of `src/app/globals.css` (e.g. `--color-primary`, `--color-secondary`).
- Components use the design-system tokens and raw hexes (e.g. `#0f172a`, `#fcf8fa`), not Tailwind default palette. Reuse the existing kit in `src/components/ui/` (Button, Input, Modal, …) before adding new primitives.

## Images
- `next.config.ts` allows remote images only from `*.supabase.co` (product images hosted on Supabase Storage).
