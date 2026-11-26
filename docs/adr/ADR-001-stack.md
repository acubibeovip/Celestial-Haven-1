# ADR-001 — MVP v0.1 Stack (pinned)

- Status: Accepted (M0-01, 2026-11-26)
- Source of truth: `docs/master-plan.md` (Master Development Plan v2.0, plan sections 4, 6, 8)
- Decision date: 2026-11-26. Verified against the npm registry on 2026-11-26 with
  `npm view <pkg>@<ver> time --json` (exact per-version publish date, not the
  latest-version date).

## Rule applied

Every direct dependency must have been published at least 14 days before it was
installed (cutoff: 2026-11-12). All versions are pinned exactly (no `^` or `~`)
in `package.json` and the lockfile (`package-lock.json`) is committed.

Rejected by the 14-day rule (NOT used, recorded so nobody "upgrades" into them):

| Package | Rejected version | Published | Reason |
|---|---|---|---|
| vitest | 5.1.2 | 2026-11-25 | 1 day before install |
| playwright / @playwright/test | 1.65.1 | 2026-11-13 | 13 days before install (cutoff is 2026-11-12) |
| eslint | 10.15.0 | 2026-11-13 | 13 days before install |

## Pinned stack

| Package | Version | Published (npm registry) | Days before 2026-11-26 | 14-day check | Why chosen |
|---|---|---|---|---|---|
| phaser | 4.2.1 | 2026-07-09T14:35:35.104Z | 140 | PASS | Plan section 6 engine. Phaser 4 is the current major; 2D top-down, WebGL/Canvas, no backend needed. Runtime dependency. |
| typescript | 5.9.3 | 2025-09-30T21:19:38.784Z | 422 | PASS | Plan section 6: strict TypeScript. Latest stable 5.x line at decision time that satisfies the 14-day rule. |
| vite | 8.3.7 | 2026-11-09T10:25:29.212Z | 17 | PASS | Plan section 6 bundler/dev server. Tightest margin in the stack (17 days) — recorded explicitly. `base: './'` and `build.assetsDir: 'bundle'` for itch.io subpath/iframe hosting. |
| zod | 4.6.7 | 2026-10-12T16:29:37.778Z | 45 | PASS | Plan section 6/7 content validation. Zod 4 schemas live in `src/content/schema/` only, never in `src/domain`. Runtime dependency (schemas run in the validator and at content load). |
| vitest | 5.1.0 | 2026-11-02T16:12:37.770Z | 24 | PASS | Plan section 9 unit/integration tests (T01–T16, T18, T19). Shares Vite's pipeline, so domain/content tests run against the same module graph as the build. |
| @playwright/test | 1.55.0 | 2025-08-20T10:27:47.203Z | 463 | PASS | Plan section 9 e2e tests (T09/T10 full chapter runs, T17 viewport/touch emulation, T18 subpath/iframe). |
| playwright | 1.55.0 | 2025-08-20T10:27:37.504Z | 463 | PASS | Browser binaries / CLI companion to @playwright/test 1.55.0 (same version, same publish day). |
| eslint | 10.14.0 | 2026-10-30T14:12:27.179Z | 27 | PASS | Flat config. Enforces the domain-purity architecture rule (plan section 6) with `no-restricted-imports` + `no-restricted-globals`. |
| typescript-eslint | 8.70.0 | 2026-09-07T18:18:09.654Z | 80 | PASS | Type-aware linting for the strict TypeScript config. Peer range requires eslint `^8.57.0 \|\| ^9.0.0 \|\| ^10.0.0` (so pinned ESLint 10.14.0 satisfies it) and TypeScript `>=4.8.4 <6.1.0`; 5.9.3 satisfies it. Bumped from 8.46.0 on 2026-11-26 by user decision — see "RESOLVED" note below. Its subpackages (parser, eslint-plugin, utils, types, scope-manager, type-utils, typescript-estree) are all 8.70.0, published the same day 2026-09-07 (e.g. parser 18:18:47Z, eslint-plugin 18:17:13Z, utils 18:16:54Z). |

### Peer-range conflict — RESOLVED 2026-11-26 (was: typescript-eslint 8.46.0 vs ESLint 10)

`typescript-eslint@8.46.0` declared peer `eslint: ^8.57.0 || ^9.0.0`, while
the pinned ESLint is `10.14.0`. That was resolved by bumping
typescript-eslint to `8.70.0` (user-approved 2026-11-26, see below), whose
peer range is `^8.57.0 || ^9.0.0 || ^10.0.0`. The committed `.npmrc` no
longer sets `legacy-peer-deps=true` — peer resolution is strict (default)
again, and `npm install` / `npm ci` both pass with it removed (verified
2026-11-26: `npm install` exit 0, "removed 21 packages, and changed 11
packages"). All direct versions stay exactly pinned in `package.json` +
`package-lock.json`.

### RESOLVED (2026-11-26): typescript-eslint 8.46.0 was runtime-incompatible with ESLint 10.14.0 — fixed by user-approved bump to 8.70.0

The 8.46.0 incompatibility, verified 2026-11-26 (see `docs/progress.md`,
M0-04):

1. Importing the `typescript-eslint` package under ESLint 10.14.0 crashes:
   `TypeError: Class extends value undefined is not a constructor or null`
   at `@typescript-eslint/utils/dist/ts-eslint/eslint/FlatESLint.js` — its
   utils do `class FlatESLint extends require("eslint/use-at-your-own-risk").FlatESLint`,
   but ESLint 10.14.0's `use-at-your-own-risk` exports only
   `builtinRules, shouldUseFlatConfig` (no `FlatESLint` class).
2. `@typescript-eslint/parser@8.46.0` also crashes on verify under ESLint
   10.14.0: `TypeError: scopeManager.addGlobals is not a function` — verified
   with a minimal probe (`export const x: number = 1;` via the `Linter` API).
3. ESLint 10.14.0 ships no native TypeScript language (only `js`), and it
   does not bundle `@eslint/js` (a separate package, not in the pinned stack).

Decision (user-approved 2026-11-26, option "Đổi sang typescript-eslint
8.70.0 để lint được TypeScript"): bump typescript-eslint to `8.70.0`,
published `2026-09-07T18:18:09.654Z` (80 days before 2026-11-26, passes
the 14-day rule), peer `eslint: ^8.57.0 || ^9.0.0 || ^10.0.0`. Re-verified
2026-11-26 with `npm view typescript-eslint@8.70.0 time --json` and per
subpackage (`@typescript-eslint/parser/eslint-plugin/utils/types/
scope-manager/type-utils` all 8.70.0, published 2026-09-07). It is the
newest typescript-eslint version that both supports ESLint 10 (support
first appears in 8.60.0, 2026-05-25; 8.55.0 and earlier do not declare
`^10.0.0`) and passes the 14-day rule — 8.74.0 (2026-11-23) fails the
rule. The rejected alternative (downgrade ESLint to 9.x) was not used.

Applied in commits `33423f6` ("M0-04c-fix: Bump typescript-eslint to
8.70.0", package.json + package-lock.json + .npmrc) and `6791769`
("M0-04c-fix: Enable TypeScript linting in ESLint config",
eslint.config.mjs + violation-fixture header). Consequence now:
`npm run lint` lints `**/*.ts` for real (parser +
`@typescript-eslint/no-unused-vars` + `@typescript-eslint/no-explicit-any`
+ purity rules for src/domain + src/shared) and passes, exit 0. Proof
recorded in `docs/progress.md` (M0-04c-fix): a probe TS file with `: any`
was flagged (`@typescript-eslint/no-explicit-any`, exit 1), and the
committed violation fixture flags 7 errors via the real config
(`npx eslint src/domain/__fixtures__/violation.ts --no-ignore`).
Purity of `src/domain` + `src/shared` is now enforced by BOTH the ESLint
config and `tests/unit/domain-purity.test.ts` (Linter-API proof + TS AST
check on real sources).

Transitive-only additions (not direct dependencies, resolved by npm from the
pinned direct set; recorded here because they appear in the lockfile). Note:
`@types/node` is a direct devDependency (see table above), not transitive.

| Package | Resolved version | Published | Note |
|---|---|---|---|
| @types/node | 24.10.1 | 2025-11-11T23:33:15.303Z | 15 days before 2026-11-26 — PASS. Direct devDependency (Node types for tools/tests). |
| jiti | 2.6.1 | 2025-10-01T07:34:07.746Z | Transitive-only (Vite). Not a direct dependency. |

Toolchain used to install/verify (not a project dependency): Node v24.22.1,
npm 10.9.4.

## TypeScript settings (plan section 6 + task constraints)

- `"strict": true`, `"noUncheckedIndexedAccess": true`,
  `"exactOptionalPropertyTypes": true`.
- `skipLibCheck` is `true` — allowed only so dependency declaration files
  (Phaser, Zod) do not fail the build; our own code is still fully checked
  (`strict` + the two flags above apply to all project sources).
- Path aliases: `@domain/*`, `@shared/*`, `@content/*`, `@app/*`,
  `@game/*`, `@ui/*`, `@infra/*` → `src/...`.

## Vite settings

- `base: './'` (relative base — required for itch.io subpath/iframe hosting,
  plan section 10, REL-03).
- `build.assetsDir: 'bundle'`.
- `sourcemap: false` (no source maps in the shipped build; plan section 10,
  REL-02).
- `npm run build` runs `validate:content` first via the `prebuild` hook; a
  content validation failure fails the build (plan section 6).

## Architecture decisions (plan section 6)

- `src/domain/` and `src/shared/` are pure: they must not import `phaser`,
  `zod`, DOM, storage, network, or anything outside `@domain`/`@shared`.
  Enforced by ESLint (`no-restricted-imports` + `no-restricted-globals`) and
  proven by a committed violation fixture plus a Vitest test that lints it
  (see `tests/fixtures/domain-violation.ts`, `tests/unit/domain-purity.test.ts`).
- Rendering is never the source of truth.
- A `GameSession` port with a `LocalSession` implementation (M1+). No
  `NetworkSession` code exists in v0.1.
- Zod schemas live in `src/content/schema/`, never in `src/domain`.

## Scope decisions (M0-01, from plan section 4)

- Maps (4): Starbrook Village (40x32), Farm (32x24), Whisperwood (40x32),
  Crystal Hollow (40x32). Boss room is a small scene inside Crystal Hollow,
  not a fifth map.
- Heroes: 10 selectable (plan section 3.2 names), 3 gameplay templates
  (`close` / `ranged` / `support`). No promise of 10 distinct movesets in v0.1.
- Routes: Peaceful and Adventure both complete the chapter via a shared
  `completeShrine()`; Peaceful never forces combat.
- Content budget (plan section 4, all `[T]` targets): level 1–10; 20 gear
  (+0..+3 deterministic upgrades); 20 materials; 15 recipes; 5 NPCs;
  10 quests (incl. side quests); 8 creature species, max 16 variants,
  3 pet choices; 3 active elements (others neutral); 1 boss; 6 crops,
  12 farm plots; 3 weather states.
- Cut order if late (plan section 4): cut variants, then non-essential
  recipes, then side quests and decorative animation — keep 10 heroes (if
  assets pass audit), 2 routes, gathering/mining/upgrade, 1 boss, functional
  NPCs, and save.

## Out of scope for v0.1 (plan section 18)

Online/co-op is entirely out of scope. No server, no `server/` directory, no
`NetworkSession`, no network calls, no accounts, no analytics, no CDN. The
game must run offline once loaded. Section 18 work starts only after v0.1 is
stable (roadmap v0.2+).

## Art / data honesty

- No owner art catalog is available to this agent. All art in v0.1 is
  placeholder art generated in code (shapes/colors, 32px tiles, top-down).
  Every placeholder asset and content file is marked `"placeholder": true`
  and listed in `docs/PLACEHOLDERS.md`.
- No audio in v0.1 (none generated yet; no licenses invented).
  `docs/ASSET_LICENSES.md` lists only what actually exists.
- Element IDs, stats and balance numbers in content files are placeholders;
  stated in the content manifest (`src/content/manifest.json`).
- Nothing is downloaded, copied or imitated from Rune Factory, Stardew Valley,
  Fields of Mistria, Sun Haven, Vua Phap Thuat or any other game. Hero/NPC
  names and quest IDs follow the plan (sections 3.2, 3.5, 3.7).
