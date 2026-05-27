# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at localhost:3000
npm run build     # production build
npm run lint      # run ESLint
```

No test suite is configured.

## Environment

Create a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Architecture

**Stack**: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Supabase (auth + database), Framer Motion, Three.js, Lenis (smooth scroll), Vercel Analytics.

**Supabase client** is a singleton at [src/lib/supabase.ts](src/lib/supabase.ts) — import from `@/lib/supabase`.

**Database tables**:
- `profiles` — `id`, `email`, `first_name`, `last_name`, `phone`, `created_at`, `role` (`"member"` | `"barber"`)
- `visits` — `id`, `user_id`, `barber_id`, `notes`, `scanned_at`, `customer_email`, `customer_name`

**Role-based access**:
- `member`: sees a personal QR code on `/profile` encoded as `dardan-barbershop:user:<uuid>`
- `barber`: sees a scanner button on `/profile` and has access to `/barber`, where they scan member QR codes, look up the member from `profiles`, and log visits to `visits`

**Pages** (`src/app/`):
- `/` — Marketing landing page (Hero → Catalogue → Craftsmen → Footer) with a `LoadingScreen` gate on first render
- `/auth` — Single-page login / register / forgot-password flow via Supabase email auth; phone stored with `+389` prefix (North Macedonia)
- `/profile` — Auth-guarded; role-conditional left panel (QR code or scanner shortcut) + editable right panel; QR generated via callback ref on `<canvas>`
- `/barber` — Auth-guarded; uses `html5-qrcode` loaded dynamically (`import()`) to avoid SSR; saves visits to Supabase
- `/terms`, `/privacy` — Static legal pages

**Components** (`src/components/`):
- `Navbar` — fixed, reads auth state directly from Supabase (`onAuthStateChange`); accepts `lang` (`"en" | "al" | "mk"`), a `t` translation map, and callback props; multilingual UI wired up but pages currently pass stub translations
- `SmoothScroll` — wraps the entire app body with Lenis; lives in the root layout
- Others (`Hero`, `Catalogue`, `Craftsmen`, `Footer`, `LoadingScreen`, `ScrollToTop`) are landing-page sections

**Styling conventions**: inline styles via `React.CSSProperties` objects (named `styles` or `s`) are the dominant pattern on all pages. Tailwind utility classes are used sparingly in the root layout only. Brand colors: `#0f0f0f` background, `#c9a961` gold accent, `#ffffff` text. Gold radial blobs (`background: "radial-gradient(circle, #c9a961 0%, transparent 70%)"`) appear as decorative backgrounds on most pages.
