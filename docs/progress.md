# Celestial Haven MVP v0.1 — Progress Log

Running log (plan section 11 / task instructions). One entry per task: task ID,
commit SHA, exact commands run with real output (trimmed tails allowed), status
DONE / PARTIAL / BLOCKED with reason. Checkboxes in `docs/master-plan.md` are
ticked only when a task's acceptance criteria pass with recorded evidence.
Never tick by intent.

- Repo: `~/workspace/celestial-haven/` (local git, branch main; remote origin
  https://github.com/acubibeovip/Celestial-Haven-1.git — push BLOCKED, no
  GitHub auth in this environment; see M0-04a push note).
- Toolchain: Node v24.22.1, npm 10.9.4.
- Prior commit: `df6ec6b` — "M0-00: Add Master Development Plan v2.0 unmodified as
  source of truth" (`docs/master-plan.md` is an exact copy of
  `~/workspace/user/files/plan.md`, sha256
  `4365bcec4bb28628a99a4c3f4e4339a2c6fae101a534a788025e5833b40a0174`).
  `docs/master-plan.md` is NOT modified by M0 work below.

## M0-01 — Scope decisions + ADR-001

- Commit: `40becf9` — "M0-01: Record stack ADR with verified publish dates and scope decisions"
- Status: DONE
- Evidence: `docs/adr/ADR-001-stack.md` — every package with exact version,
  real npm-registry publish date, days before 2026-11-26, 14-day check
  (cutoff 2026-11-12), why chosen; rejected versions recorded (vitest 5.1.2
  2026-11-25, playwright 1.65.1 2026-11-13, eslint 10.15.0 2026-11-13).
  Scope decisions recorded: 4 maps, 10 heroes / 3 templates, 2 routes,
  content budget from plan section 4; section 18 out of scope.
- Commands run:
  - `npm view <pkg>@<ver> time --json` for each of the 9 pinned packages
    (phaser 4.2.1, typescript 5.9.3, vite 8.3.7, zod 4.6.7, vitest 5.1.0,
    @playwright/test 1.55.0, playwright 1.55.0, eslint 10.14.0,
    typescript-eslint 8.46.0) — all dates verified, see ADR-001 table.
    Full per-version output (2026-11-26):
    `phaser@4.2.1 => 2026-07-09T14:35:35.104Z`,
    `typescript@5.9.3 => 2025-09-30T21:19:38.784Z`,
    `vite@8.3.7 => 2026-11-09T10:25:29.212Z`,
    `zod@4.6.7 => 2026-10-12T16:29:37.778Z`,
    `vitest@5.1.0 => 2026-11-02T16:12:37.770Z`,
    `@playwright/test@1.55.0 => 2025-08-20T10:27:47.203Z`,
    `playwright@1.55.0 => 2025-08-20T10:27:37.504Z`,
    `eslint@10.14.0 => 2026-10-30T14:12:27.179Z`,
    `typescript-eslint@8.46.0 => 2025-10-06T17:06:02.237Z`.
    Days-before check (2026-11-26): phaser 140, typescript 422, vite 17,
    zod 45, vitest 24, playwright 463, eslint 27, typescript-eslint 416 —
    all PASS (>= 14 days).
  - No typecheck/lint/test/build run for M0-01 (docs-only task; no code
    changed). Acceptance is the ADR file itself.
- Master-plan checkbox M0-01: NOT ticked yet — ticking is deferred until the
  M0 scaffold (M0-04/M0-05) lands and the recorded commands pass, per the
  "never tick by intent" rule; the ADR is the evidence for M0-01 itself.

## M0-04a — Pin exact stack versions (package.json + lockfile + .npmrc)

- Commit: (see git log after push)
- Status: DONE
- Evidence: `package.json` (all 10 direct deps pinned exactly, no `^`/`~`),
  `package-lock.json` (committed), `.npmrc` (`legacy-peer-deps=true` — see
  ADR-001 peer-range note), `.gitignore`.
- Commands run (2026-11-26):
  - `npm ci` → tail: `added 161 packages in 6s`, exit 0. Installed versions
    verified from lockfile: phaser 4.2.1, zod 4.6.7, typescript 5.9.3,
    vite 8.3.7, vitest 5.1.0, eslint 10.14.0, typescript-eslint 8.46.0,
    playwright 1.55.0, @playwright/test 1.55.0, @types/node 24.10.1.
  - Pin check `grep -E '"[^"]+": "[\^~]' package.json` → `OK: no ^ or ~ in package.json`.
  - `preview` script fixed to `vite preview --port 4173 --strictPort --host 127.0.0.1`
    (diagnosis: plain `vite preview` binds only `[::1]:4173`, so
    `http://127.0.0.1:4173` — used by Playwright `baseURL`/`webServer` —
    failed; `curl localhost:4173` → 200, `curl 127.0.0.1:4173` → 000 before fix).
- Pushed to origin main immediately after this commit (see git log).
- PUSH BLOCKED (2026-11-26): `git push -u origin main` failed with
  `fatal: could not read Username for 'https://github.com': No such device
  or address`. Cause: no GitHub credentials in this environment — no
  credential helper configured (`git config --get credential.helper` → empty),
  `gh auth status` → "You are not logged into any GitHub hosts", and the SSH
  route also fails (`git ls-remote git@github.com:...` → connection reset by
  proxy 198.19.0.1:3128). HTTPS read of the repo works (`git ls-remote
  https://...` → empty, repo is empty), so only push auth is missing.
  No credentials were supplied with this task and none were invented.
  Unblock: user/parent supplies GitHub auth (e.g. `gh auth login` on a
  machine with a browser, or a credential helper with a token) — then
  `git push origin main` from this repo pushes all local commits.
  Commits continue locally in small steps per the commit rules; nothing is
  lost — all work is in local git.

## M0-04b — TS + Vite config + placeholder boot entry

- Status: DONE (with one expected gap: full `npm run build` needs M0-05c)
- Evidence: `tsconfig.json` (strict, noUncheckedIndexedAccess,
  exactOptionalPropertyTypes, skipLibCheck, erasableSyntaxOnly,
  allowImportingTsExtensions, path aliases @domain/@shared/@content/@app/
  @game/@ui/@infra), `vite.config.ts` (base './', build.assetsDir 'bundle',
  sourcemap false), `index.html`, `src/main.ts` (placeholder Boot scene:
  code-generated shapes/text only), `src/domain/index.ts` (empty pure module
  + purity doc comment).
- Commands run (2026-11-26):
  - `npm run typecheck` → `tsc --noEmit`, exit 0.
  - `npx vite build` → `✓ built in 964ms`, exit 0; output `dist/index.html`
    (0.46 kB) + `dist/bundle/index-D-m5usLn.js` (1,368.23 kB, gzip 357.63 kB).
    Warning only: chunk > 500 kB after minification (Phaser bundle, expected
    at scaffold; code-splitting is M6 work, not M0).
  - `npm run build` → FAILS at prebuild as expected: `Error: Cannot find
    module '.../tools/validate-content.ts'`. Full `npm run build` (prebuild
    validate:content + vite build) is unblocked by M0-05c, which creates the
    validator. Not a code defect — the validator simply does not exist yet.
- Push: attempted `git push origin main` → same BLOCKED as M0-04a (no GitHub
  credentials in environment; see M0-04a entry). Commit kept local.

## M0-04c — ESLint config + domain-purity rules (TS lint BLOCKED)

- Status: PARTIAL — JS lint works; TypeScript linting is BLOCKED (see below).
  The block is a real incompatibility of the mandated pins, not a config bug.
- Evidence: `eslint.config.mjs`, `docs/adr/ADR-001-stack.md` (BLOCKED section
  added with evidence + fix candidate).
- Commands run (2026-11-26):
  - `npm run lint` → `eslint .`, exit 0. Scope today: ESLint 10.14.0 core
    rules on JS/MJS files only; `**/*.ts` ignored (see BLOCKED note).
  - BLOCKED evidence (verified, not assumed):
    1. `import "typescript-eslint"` under ESLint 10.14.0 →
       `TypeError: Class extends value undefined is not a constructor or null`
       at `@typescript-eslint/utils/.../FlatESLint.js:12` (utils extend
       `require("eslint/use-at-your-own-risk").FlatESLint`, which ESLint
       10.14.0 does not export — `use-at-your-own-risk` keys are only
       `builtinRules, shouldUseFlatConfig`).
    2. Minimal probe with `@typescript-eslint/parser@8.46.0` via the
       `Linter` API on `export const x: number = 1;` →
       `TypeError: scopeManager.addGlobals is not a function`.
    3. ESLint 10.14.0 ships no native TS language (only `js`) and does not
       bundle `@eslint/js` (not a dependency of eslint 10.14.0).
    4. Peer-range check: typescript-eslint declares eslint `^8.57.0 ||
       ^9.0.0` through 8.55.0; `^10.0.0` first appears in 8.60.0
       (2026-05-25).
  - Verified fix candidate (NOT applied — changing a mandated pin needs
    owner/parent decision): `typescript-eslint@8.70.0`, published
    2026-09-07T18:18:09.654Z (80 days before 2026-11-26, passes 14-day rule),
    peer eslint `^8.57.0 || ^9.0.0 || ^10.0.0`. Newest version that both
    supports ESLint 10 and passes the rule (8.74.0, 2026-11-23, fails it).
    Alternative: downgrade ESLint to 9.x (also a pin change).
  - Interim enforcement (real, not faked): purity is enforced by
    `tests/unit/domain-purity.test.ts` in M0-05d — ESLint `Linter` API on the
    committed violation fixture (proves the rules catch violations) + a
    TypeScript-compiler AST check on real src/domain + src/shared sources.
    The config file documents all of this in its header comment.
- Push: attempted `git push origin main` → same BLOCKED as M0-04a. Local only.

## M0-04d — Vitest + Playwright config, e2e smoke, itch stub, README

- Status: PARTIAL — configs + smoke test committed; `test:e2e` BLOCKED (no
  Chromium binary in this environment, see below). Unit tests land in M0-05d.
- Evidence: `vitest.config.ts` (include tests/unit + tests/integration,
  node env, @domain/@shared/@content/@app/@game/@ui/@infra aliases via
  import.meta.dirname), `playwright.config.ts` (baseURL 127.0.0.1:4173,
  webServer `npm run preview`), `tests/e2e/smoke.spec.ts` (placeholder boot
  page loads, canvas mounts), `tools/package-itch.mjs` (explicit stub),
  `README.md`.
- Commands run (2026-11-26):
  - `npm test` → vitest 5.1.0: `No test files found, exiting with code 1`,
    real exit 1. Expected — no unit tests exist until M0-05d.
  - `npm run package:itch` → `package:itch is NOT IMPLEMENTED yet (M7-01).
    No ZIP was created.`, real exit 1. By design; the stub must fail loudly
    instead of producing a fake release artifact.
  - `npm run test:e2e` → BLOCKED. The `--host 127.0.0.1` preview fix (M0-04a)
    worked: the webServer now starts and the run reaches browser launch,
    then fails with `Error: browserType.launch: Executable doesn't exist at
    /home/hatch/.cache/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell`.
    Cause: `npx playwright install chromium` fails twice in this environment
    (`Failed to download Chromium 140.0.7339.16 (playwright build v1187),
    Download failure, code=1`); no system Chromium exists
    (`which chromium/google-chrome` → nothing; `~/.cache/ms-playwright/` →
    empty). The smoke test file is committed but has never run green.
    Unblock: run `npx playwright install chromium` on a machine with CDN
    access, then `npm run test:e2e`.
- Push: attempted `git push origin main` → same BLOCKED as M0-04a. Local only.

## M0-05a — Shared ID + Result helpers

- Status: DONE
- Evidence: `src/shared/ids.ts` (`ID_PATTERN ^[a-z][a-z0-9_]{1,47}$`,
  `ID_KIND_PREFIXES` for all 11 kinds — elem_, hero_, item_, recipe_, q_,
  creature_, npc_, res_, crop_, map_, enc_ — `isValidIdFormat`, `idKind`,
  `validateId` returning `Result<string, IdError>`), `src/shared/result.ts`
  (`Result<T,E>`, `ok`/`err`/`isOk`/`isErr`/`mapResult`/`andThenResult` —
  the atomic-transaction contract shape from plan §7).
- Commands run (2026-11-26):
  - `npm run typecheck` → exit 0.
- Push: attempted `git push origin main` → same BLOCKED as M0-04a. Local only.

## M0-05b — Zod content schemas

- Status: DONE
- Evidence: `src/content/schema/` — `common.ts` (placeholder literal,
  `idSchema(kind)`, `anyIdSchema`, label/color helpers), `element.ts`,
  `hero.ts` (template close/ranged/support), `item.ts` (gear/material/
  consumable/key, stackMax 1..99), `recipe.ts`, `quest.ts` (prereqs,
  objectives, reward, next, peacefulAlternative), `creature.ts`,
  `npc.ts`, `resource.ts` (daily respawn), `crop.ts`, `map.ts`,
  `encounter.ts` (adventure/peaceful ruleset), `manifest.ts`,
  `index.ts` (`CONTENT_FILE_SCHEMAS` registry for all 11 kinds).
  All schemas are `z.strictObject` with `"placeholder": true` required;
  no schema lives in src/domain. Names/quest IDs follow plan §3.2/§3.5/§3.7.
- Commands run (2026-11-26):
  - `npm run typecheck` → exit 0.
  - Note: importing the schemas under Node type-stripping requires `.ts`
    extensions in relative imports — verified by probe (`node` importing
    `src/shared/ids.ts` failed with `./result.js`, passed with `./result.ts`);
    `src/shared/ids.ts` was fixed to `./result.ts` and amended into M0-05a
    (`5512c97`, unpushed at the time).
- Push: attempted `git push origin main` → same BLOCKED as M0-04a. Local only.

## M0-05c — Content validator + placeholder content set

- Status: DONE
- Evidence: `src/content/validate.ts` (schema → registry → refs → quest
  cycles → manifest counts → prefix sanity), `tools/validate-content.ts`
  (CLI, exit 1 on any error, runs in `prebuild`), `tools/validate-assets.mjs`,
  `src/content/*.json` (11 files, 48 definitions) + `manifest.json`
  (contentVersion 0.1.0-m0, counts match), `docs/PLACEHOLDERS.md`,
  `docs/ASSET_LICENSES.md` (only what exists: code-generated placeholders).
- Commands run (2026-11-26):
  - `npm run typecheck` → exit 0 (after fixing one error found by tsc:
    `tools/validate-content.ts(48,19): error TS18046: 'sum' is of type
    'unknown'` — fixed with explicit `(sum: number, value: unknown)` types).
  - `npm run validate:content` → `validate:content: OK (48 definitions
    across 11 files)`, exit 0.
  - `npm run validate:assets` → `validate:assets: OK (no shipped asset
    files; ...)`, exit 0.
  - `npm run build` (full, with prebuild) → `✓ built in 1.25s`, exit 0.
    This unblocks the M0-04b gap: full `npm run build` now works.
  - Negative probe (via `node` importing `src/content/validate.ts`):
    clean set → 0 errors; duplicate id →
    `[items.json] duplicate id "item_starter_sword" (also in items.json as
    items)`; missing ref →
    `[heroes.json] "hero_storm_monk" field "elementId" references missing id
    "elem_nope"`; quest cycle →
    `[quests.json] quest cycle detected: q_arrive -> q_gather -> q_craft ->
    q_shrine -> q_arrive`; bad id `Bad_ID` → prefix error. (Formal fixture
    tests for all four land in M0-05d.)
- Push: attempted `git push origin main` → same BLOCKED as M0-04a. Local only.

## M0-05d — Violation fixture + Vitest purity and validator tests

- Status: DONE
- Evidence: `src/domain/__fixtures__/violation.ts` (intentional phaser/zod
  imports + window/document/localStorage/fetch/navigator use, written without
  TS-only syntax so ESLint's core parser can read it; ignored by
  eslint.config.mjs), `tests/unit/domain-purity.test.ts` (2 tests),
  `tests/unit/content-validator.test.ts` (7 tests).
- Commands run (2026-11-26):
  - `npm test` → vitest 5.1.0: `Test Files 2 passed (2)`, `Tests 9 passed
    (9)`, Duration 1.39s, exit 0. Purity test A proves the rules catch the
    fixture (≥2 no-restricted-imports incl. phaser + zod; no-restricted-globals
    for window/document/localStorage/fetch/navigator, all severity 2);
    test B proves every real file under src/domain + src/shared is pure via
    a TypeScript AST check. Validator tests: clean set passes; duplicate id,
    bad prefix, schema violation (stackMax 1000), missing ref, quest cycle
    and manifest count mismatch all fail with the expected error.
  - `npm run typecheck` → exit 0 (after fixing one error found by tsc: the
    `as const` PURITY_RULES was readonly and could not assign to the Linter
    API's mutable rule-config type — fixed with an explicit
    `Linter.Config["rules"]` annotation).
  - `npm run lint` → exit 0.
  - `npm run build` → `✓ built in 1.02s`, exit 0.
- Push: attempted `git push origin main` → same BLOCKED as M0-04a. Local only.

## M0-04c-fix — Bump typescript-eslint 8.46.0 -> 8.70.0, enable real TS linting

- Status: DONE (user-approved 2026-11-26: option "Doi sang typescript-eslint 8.70.0 de lint duoc TypeScript")
- Commits (small, per feature):
  - `33423f6` — "M0-04c-fix: Bump typescript-eslint to 8.70.0" — package.json (8.46.0 -> 8.70.0, exact, no ^/~), package-lock.json, .npmrc (removed legacy-peer-deps=true; strict peer resolution restored — see below).
  - `6791769` — "M0-04c-fix: Enable TypeScript linting in ESLint config" — eslint.config.mjs (removed **/*.ts ignore; TS block with tseslint.parser + @typescript-eslint/no-unused-vars + @typescript-eslint/no-explicit-any + purity rules for src/domain + src/shared), src/domain/__fixtures__/violation.ts (header comment only, now records the --no-ignore proof).
  - Docs commit (this entry) — docs/adr/ADR-001-stack.md (pin table + peer-conflict RESOLVED + subpackage dates), docs/progress.md (this section + repo header), tests/unit/domain-purity.test.ts (header comment only, now records that eslint.config.mjs lints TS for real and check B stays as second line of defence).
- Evidence / verification (2026-11-26, re-verified, not trusted blindly):
  - `npm view typescript-eslint@8.70.0 time --json` -> 8.70.0: 2026-09-07T18:18:09.654Z (80 days before 2026-11-26, cutoff 2026-11-12, PASS). 8.46.0 was 2025-10-06T17:06:02.237Z.
  - Subpackages, all 8.70.0 published 2026-09-07: @typescript-eslint/parser 18:18:47Z, @typescript-eslint/eslint-plugin 18:17:13Z, @typescript-eslint/utils 18:16:54Z, @typescript-eslint/types 18:16:10Z, @typescript-eslint/scope-manager 18:17:08Z, @typescript-eslint/type-utils 18:17:52Z. Only the meta package `typescript-eslint` is a direct dependency; the rest are its dependencies (lockfile: 51 occurrences of 8.70.0).
  - `npm view typescript-eslint@8.70.0 peerDependencies` -> eslint "^8.57.0 || ^9.0.0 || ^10.0.0", typescript ">=4.8.4 <6.1.0" — pinned eslint 10.14.0 and typescript 5.9.3 both satisfy it.
  - All other pins unchanged: phaser 4.2.1, typescript 5.9.3, vite 8.3.7, zod 4.6.7, vitest 5.1.0, playwright / @playwright/test 1.55.0, eslint 10.14.0, @types/node 24.10.1. No ^/~ in package.json.
- Commands run (2026-11-26):
  - `npm install` (after pin bump + .npmrc change) -> "removed 21 packages, and changed 11 packages in 5s", exit 0. Strict peer resolution works without legacy-peer-deps.
  - `npm ci` -> exit 0 (re-verified after restoring package.json to compact one-line form; the earlier pretty-print reformat was reverted so the package.json diff is the single version token).
  - `npm run typecheck` -> exit 0 (after both commits).
  - `npm run lint` -> exit 0 — now lints **/*.ts for real, not JS only.
  - Lint proof (deliberate violations, files deleted / not committed):
    - Temp `src/shared/probe-lint.ts` with `export const probeUnused: any = 1;` -> `1:27 error Unexpected any. Specify a different type @typescript-eslint/no-explicit-any`, exit 1. File removed afterwards; git status clean of it.
    - `npx eslint src/domain/__fixtures__/violation.ts --no-ignore` -> 7 errors, exit 1: phaser + zod no-restricted-imports, window/document/localStorage/fetch/navigator no-restricted-globals. Proves the real config + TS parser enforces purity.
  - `npm test` -> vitest 5.1.0: `Test Files 2 passed (2)`, `Tests 9 passed (9)`, Duration 1.30s, exit 0.
  - `npm run build` (with prebuild validate:content) -> `✓ built in 996ms`, exit 0 (chunk-size warning only, pre-existing).
- Push: attempted once at the end (see below); expected BLOCKED, recorded there.
- Master-plan checkbox M0-04: NOT ticked — M0-04 as a whole still has the known test:e2e BLOCKED (no Chromium binary, recorded in M0-04d) and this fix does not by itself close it.

## M0-04c-fix — Push attempt (2026-11-26)

- Command: `git push origin main` (once only, as instructed).
- Result: (recorded below after running it; expected failure: no GitHub auth in this environment — `gh auth status` "not logged into any GitHub hosts", git push asks for Username, SSH reset by proxy. No credentials supplied or invented.)
