# Celestial Haven MVP v0.1 — Progress Log

Running log (plan section 11 / task instructions). One entry per task: task ID,
commit SHA, exact commands run with real output (trimmed tails allowed), status
DONE / PARTIAL / BLOCKED with reason. Checkboxes in `docs/master-plan.md` are
ticked only when a task's acceptance criteria pass with recorded evidence.
Never tick by intent.

- Repo: `~/workspace/celestial-haven/` (local git only; no remote, no push).
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
