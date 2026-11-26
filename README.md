# Celestial Haven — MVP v0.1

Single-player HTML5 fantasy adventure RPG. Source of truth:
`docs/master-plan.md` (Master Development Plan v2.0). No backend, no network
calls, no CDN, no analytics, no accounts. The game runs offline once loaded.
Online/co-op (plan section 18) is out of scope for v0.1.

## Status

M0 scaffold (M0-01, M0-04, M0-05). See `docs/progress.md` for the running
log with commits and command evidence. No game logic yet — the current build
is a placeholder boot screen.

## Stack (pinned exactly — see `docs/adr/ADR-001-stack.md`)

Phaser 4.2.1 · TypeScript 5.9.3 (strict, `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`) · Vite 8.3.7 · Zod 4.6.7 · Vitest 5.1.0 ·
Playwright 1.55.0 · ESLint 10.14.0 · typescript-eslint 8.46.0.
Every direct dependency was published at least 14 days before install
(cutoff 2026-11-12); publish dates are recorded in ADR-001.

## How to run

Requires Node >= 22.12 (developed with Node v24.22.1, npm 10.9.4).

```bash
npm ci                 # install exact pinned versions from package-lock.json
npm run dev            # Vite dev server
npm run typecheck      # tsc --noEmit
npm run lint           # eslint .
npm test               # vitest run (unit + integration)
npm run test:e2e       # playwright (needs: npx playwright install chromium)
npm run validate:content  # content validator (schema, IDs, refs, quest cycles)
npm run validate:assets   # placeholder-asset check
npm run build          # validate:content (prebuild) + vite build -> dist/
npm run preview        # serve dist/ on http://127.0.0.1:4173
npm run package:itch   # NOT IMPLEMENTED until M7-01 (fails loudly on purpose)
```

## Architecture (plan §6)

- `src/domain/` and `src/shared/` are pure: no Phaser, Zod, DOM, storage,
  network, or imports outside `@domain`/`@shared`. Enforced by ESLint
  (`no-restricted-imports` + `no-restricted-globals`) and proven by
  `tests/unit/domain-purity.test.ts` (committed violation fixture included).
- Zod schemas live in `src/content/schema/` only, never in `src/domain`.
- Content IDs match `^[a-z][a-z0-9_]{1,47}$` with kind prefixes (`elem_`,
  `hero_`, `item_`, `recipe_`, `q_`, `creature_`, `npc_`, `res_`, `crop_`,
  `map_`, `enc_`); validated by `npm run validate:content`, which runs
  before every build and exits 1 on any error.
- Rendering is never the source of truth. `GameSession` port + `LocalSession`
  implementation land in M1+; no `NetworkSession` code in v0.1.

## Placeholders and licenses

All art is placeholder art generated in code (shapes/colors, 32px tiles,
top-down) — no owner art catalog was available, nothing was downloaded or
copied from other games. Every placeholder is marked `"placeholder": true`
and listed in `docs/PLACEHOLDERS.md`. `docs/ASSET_LICENSES.md` lists only
what actually exists. No audio.
