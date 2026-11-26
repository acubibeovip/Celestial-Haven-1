// Celestial Haven — ESLint flat config (plan §6).
//
// TypeScript linting is ON: typescript-eslint 8.70.0 (ADR-001, user-approved
// 2026-11-26) declares peer eslint ^8.57.0 || ^9.0.0 || ^10.0.0, so it works
// with the pinned ESLint 10.14.0. Previously (typescript-eslint 8.46.0,
// peer only ^8/^9) the parser crashed under ESLint 10 and **/*.ts had to be
// ignored — that workaround is removed here.
//
// Purity rules (no-restricted-imports + no-restricted-globals) for
// src/domain + src/shared are defined below AND in
// tests/unit/domain-purity.test.ts, which proves the same rules catch
// violations on the committed fixture via ESLint's Linter API plus a
// TypeScript-AST check on the real sources. Keep the two copies in sync.

import tseslint from "typescript-eslint";

// Same rule text as tests/unit/domain-purity.test.ts — keep in sync.
const PURITY_RULES = {
  "no-restricted-imports": [
    "error",
    {
      paths: [
        { name: "phaser", message: "Pure domain/shared code must not import Phaser." },
        { name: "zod", message: "Pure domain/shared code must not import Zod." },
        { name: "fs", message: "Pure domain/shared code must not use the filesystem." },
        { name: "path", message: "Pure domain/shared code must not use the filesystem." },
        { name: "node:fs", message: "Pure domain/shared code must not use the filesystem." },
        { name: "node:path", message: "Pure domain/shared code must not use the filesystem." },
      ],
      patterns: [
        { group: ["phaser/*"], message: "Pure domain/shared code must not import Phaser." },
        { group: ["zod/*"], message: "Pure domain/shared code must not import Zod." },
        { group: ["node:*"], message: "Pure domain/shared code must not use Node APIs." },
        {
          group: ["@content/*", "@app/*", "@game/*", "@ui/*", "@infra/*"],
          message: "Pure domain/shared code may only import @domain/@shared.",
        },
      ],
    },
  ],
  "no-restricted-globals": [
    "error",
    { name: "window", message: "Pure domain/shared code must not touch the DOM." },
    { name: "document", message: "Pure domain/shared code must not touch the DOM." },
    { name: "navigator", message: "Pure domain/shared code must not touch browser APIs." },
    { name: "location", message: "Pure domain/shared code must not touch browser APIs." },
    { name: "localStorage", message: "Pure domain/shared code must not touch storage." },
    { name: "sessionStorage", message: "Pure domain/shared code must not touch storage." },
    { name: "fetch", message: "Pure domain/shared code must not use the network." },
    { name: "XMLHttpRequest", message: "Pure domain/shared code must not use the network." },
    { name: "WebSocket", message: "Pure domain/shared code must not use the network." },
    { name: "globalThis", message: "Pure domain/shared code must not reach host globals." },
    { name: "alert", message: "Pure domain/shared code must not touch the DOM." },
    { name: "setTimeout", message: "Pure domain/shared code must not use timers." },
    { name: "setInterval", message: "Pure domain/shared code must not use timers." },
    { name: "console", message: "Pure domain/shared code must not log." },
  ],
};

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "playwright-report/**",
      "test-results/**",
      "coverage/**",
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
  {
    // Real TypeScript linting: @typescript-eslint/parser parses TS syntax;
    // the plugin provides TS-aware rules. No type-aware (projectService)
    // rules — type errors are tsc's job (npm run typecheck).
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      // Core rule off for TS (it cannot see TS syntax); TS-aware version on.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    // Domain purity (plan §6): src/domain + src/shared are pure.
    files: ["src/domain/**/*.ts", "src/shared/**/*.ts"],
    rules: PURITY_RULES,
  },
];
