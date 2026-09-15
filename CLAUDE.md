# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**EstilosIA** — a personal wardrobe manager (Spanish UI, `lang="es"`): closet CRUD ("prendas"), outfits ("looks"), a calendar of assignments, statistics, an archive, a wishlist, and AI outfit suggestions via Gemini. Scaffolded in Firebase Studio (`.idx/dev.nix`), but the backend is **Supabase**, not Firebase — `firebase`, `@tanstack/react-query` and `@tanstack-query-firebase/react` are installed but unused. `README.md` has a per-page feature/component description.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`).

```bash
pnpm dev                    # Next.js 15 + Turbopack on http://localhost:9002
pnpm build / pnpm start
pnpm typecheck              # tsc --noEmit
pnpm lint                   # next lint (no ESLint config committed; may prompt to create one)
pnpm genkit:dev             # Genkit developer UI for AI flows (entry: src/ai/dev.ts)
pnpm genkit:watch           # same, with tsx --watch
pnpm optimize:ropa-images   # recompress images in public/ropa in place with sharp
```

There is no test suite.

`next.config.ts` sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`, so **`pnpm build` succeeds even with type errors** — run `pnpm typecheck` to actually verify changes.

## Environment

`.env*` is gitignored. Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — if missing, `supabase` (from `src/lib/supabaseClient.ts`) is `null` instead of throwing; every action guards on this and returns a Spanish error message.
- `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) — read by the Genkit `googleAI()` plugin.

## Architecture

**Data flow:** every page under `src/app/*/page.tsx` is a `'use client'` component that renders `Navbar` + `Footer` itself (the root `layout.tsx` only adds fonts and the `Toaster`). Pages load and mutate data by calling Server Actions from the single file **`src/app/actions.ts`** (`'use server'`), usually inside `useEffect`/handlers, then update local state. There are no API routes and no client-side Supabase queries.

**`src/app/actions.ts` conventions** (follow them when adding actions):
- Return `{ data?, error?, validationErrors? }` (or `{ success?, error? }`) — never throw to the client. User-facing error strings are in Spanish.
- Guard `if (!supabase)` first.
- Map every DB `prendas` row through `mapDbPrendaToClient` (`src/lib/dataMappers.ts`), which normalizes `fechacompra` to `YYYY-MM-DD` and defaults nullable fields.
- Call `revalidatePath` for every route that displays the changed entity (`/`, `/closet`, `/archivo`, `/looks`, `/calendario`, `/statistics`).
- Prenda create/update take `FormData` validated by the Zod `PrendaFormSchema`; looks and calendar assignments take typed objects.

**Supabase schema** (not versioned in the repo; inferred from queries):
- `prendas` — clothing items; `is_archived` drives the `/archivo` page (archiving is just `updatePrendaAction` with the flag). Statistics and suggestions only consider non-archived items.
- `looks` + join table `look_prendas(look_id, prenda_id)` — looks are fetched with nested `look_prendas(prendas(*))` and flattened to `Look.prendas`. Updating a look deletes and re-inserts all its `look_prendas` rows; deleting a prenda/look deletes join rows manually first.
- `calendario_asignaciones` — `tipo_asignacion: 'prenda' | 'look'` with either `prenda_id` or `look_id`; mapped to the discriminated union `CalendarAssignment` in `src/types/index.ts`.

**Domain constants** live in `src/types/index.ts` and are shared by Zod schemas, forms and outfit logic: `PRENDA_COLORS`, `TIPO_PRENDA_ENUM_VALUES` (`Cuerpo`, `Piernas`, `Zapatos`, `Abrigos`, `Accesorios`), `SEASONS`, `NEUTRAL_COLORS`, `DIFFICULT_COLOR_PAIRS`. `estilo` is a free string (compared case-insensitively in some places, exactly in others).

**AI / outfit suggestions:** item selection is deterministic code in `actions.ts`; the LLM only writes the explanation.
- `getAISuggestionAction` (`/sugerenciaia`, `/`): filters active prendas by style + overlapping temperature range, shuffles, picks up to 3.
- `generateOptimizedOutfitSuggestionAction` (`OptimizedOutfitSuggester` component): requires one Cuerpo/Piernas/Zapatos, adds an Abrigo at ≤22°C, and retries up to 20 times rejecting >3 non-neutral colors or difficult color pairs.
- Both then call the Genkit flow `generateOutfitExplanation` (`src/ai/flows/generate-outfit-explanation.ts`), whose Spanish prompt can call the `getUserClosetInformation` tool (queries Supabase directly). New flows must also be imported in `src/ai/dev.ts` to appear in the Genkit UI.
- The active Genkit instance is `src/ai/genkit.ts` (default model `gemini-2.0-flash`; the prompt overrides it with `gemini-1.5-flash-latest`). `src/ai/ai-instance.ts` is an unused alternative.
- Suggestion history and notes on `/sugerenciaia` are stored in browser `localStorage`, not Supabase.
- The wishlist (`/deseos`) is in-memory React state seeded from `mockWishlistItems` — nothing persists (the README's mention of `localStorage` is outdated).

**UI:** shadcn/ui (Radix, "default" style, lucide icons) in `src/components/ui` — add components via the shadcn CLI per `components.json`. Theme tokens are HSL CSS variables in `src/app/globals.css` (primary coral `#FF7043`, accent light blue; design intent in `docs/blueprint.md`). Charts use Recharts via `components/ui/chart.tsx`. Remote images are only allowed from `placehold.co` (used as the fallback `imagen_url`); local clothing photos are served from `public/ropa/` (`public/ropa/antes/` holds the un-optimized originals).

**Duplicate/legacy routes:** `/dashboard` is an older alternate dashboard; `/` is the one linked in the Navbar. `/settings` is a static "en construcción" page; `/configuracion` is the linked one (a placeholder form that saves nothing).

## Non-source files at the root

`estructura_*.json`, `estructura_directorios.txt`, `src_structure.txt`, `configuracion_proyecto.txt` are generated project snapshots from the Python helpers (`nuevo.py`, `verproyecto.py`, `cambiarnombre.py` lists `public/ropa`). They are not used by the app and go stale — read the actual source instead. `src/data/prendas_ejemplos.csv` is sample seed data with an older schema (its `tipo`/`color` values don't match the current enums).
