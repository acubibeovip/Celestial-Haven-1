// Celestial Haven — ESLint flat config (plan §6).
//
// BLOCKED (2026-11-26): TypeScript linting cannot run with the pinned pair.
// typescript-eslint 8.46.0 (pinned, ADR-001) predates ESLint 10 support: it
// declares peer eslint ^8.57.0 || ^9.0.0, its utils crash on import under
// ESLint 10.14.0 ("Class extends value undefined", FlatESLint missing from
// eslint/use-at-your-own-risk), and its parser 8.46.0 crashes on verify
// ("scopeManager.addGlobals is not a function" — verified with a minimal
// probe on `export const x: number = 1;`). ESLint 10.14.0 ships no native TS
// language. Evidence and the fix candidate are in docs/progress.md (M0-04)
// and docs/adr/ADR-001-stack.md: typescript-eslint 8.70.0 (published
// 2026-09-07, peer eslint ^8.57.0 || ^9.0.0 || ^10.0.0) passes the 14-day
// rule and is the verified candidate — but changing the pin is an owner /
// parent-agent decision, so the pins stay as mandated and TS linting stays
// BLOCKED instead of being faked.
//
// What runs TODAY (`npm run lint` green):
//   - ESLint 10.14.0 core rules on JS/MJS files.
//   - The purity RULES themselves (no-restricted-imports +
//     no-restricted-globals, defined in tests/unit/domain-purity.test.ts)
//     are proven by that Vitest test, which runs them through ESLint's
//     Linter API on the committed violation fixture
//     (src/domain/__fixtures__/violation.ts — written without TS-only syntax
//     so the core parser can read it).
//   - Purity of the real src/domain + src/shared sources is enforced by the
//     same test via a TypeScript-compiler AST check (no ESLint parser needed).
//
// The intended TS config (parser + purity rules for src/domain and
// src/shared) is preserved in tests/unit/domain-purity.test.ts, which carries
// the same rules. Restore it here once the typescript-eslint pin decision
// lands: add a block with languageOptions.parser = @typescript-eslint/parser
// for TS files plus the purity rules for src/domain + src/shared, and
// remove the "**/*.ts" ignore below.

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "playwright-report/**",
      "test-results/**",
      "coverage/**",
      // TS files: not lintable with the pinned pair (see BLOCKED note above).
      // tsc --noEmit (npm run typecheck) still checks them.
      "**/*.ts",
      // Intentional violation fixture: linted only by tests/unit/domain-purity.test.ts.
      "src/domain/__fixtures__/**",
    ],
  },
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
