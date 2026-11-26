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
