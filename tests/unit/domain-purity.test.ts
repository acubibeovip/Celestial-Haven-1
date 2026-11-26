// tests/unit/domain-purity.test.ts — proves src/domain + src/shared stay pure (plan §6).
//
// Two independent checks, because the pinned pair (ESLint 10.14.0 +
// typescript-eslint 8.46.0) cannot lint TypeScript files — see
// docs/adr/ADR-001-stack.md (BLOCKED) and eslint.config.mjs:
//
//  A. ESLint RULES proof: the purity rules (no-restricted-imports +
//     no-restricted-globals, same rule text as the intended eslint.config.mjs
//     block) are run through ESLint's Linter API on the committed violation
//     fixture. This proves the RULES catch violations.
//  B. REAL SOURCES proof: a TypeScript-compiler AST check walks every real
//     file under src/domain + src/shared (excluding the fixture) and asserts
//     no forbidden import and no forbidden global is referenced. This proves
//     the real code is pure, without needing the broken TS parser.
//
// When the typescript-eslint pin decision lands, (B) stays as a second line
// of defence and (A) moves to the real eslint.config.mjs block.

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import ts from "typescript";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const fixturePath = path.join(repoRoot, "src", "domain", "__fixtures__", "violation.ts");

// Same rule text as the intended eslint.config.mjs purity block.
// Typed as Linter.Config["rules"] (not `as const`) so it assigns to the
// Linter API's mutable rule-config type.
const PURITY_RULES: Linter.Config["rules"] = {
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

const FORBIDDEN_GLOBALS = new Set([
  "window",
  "document",
  "navigator",
  "location",
  "localStorage",
  "sessionStorage",
  "fetch",
  "XMLHttpRequest",
  "WebSocket",
  "globalThis",
  "alert",
  "setTimeout",
  "setInterval",
  "console",
  "process",
]);

const FORBIDDEN_IMPORT_PREFIXES = ["phaser", "zod", "node:"];

function walkTsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkTsFiles(full));
    else if (entry.isFile() && full.endsWith(".ts")) out.push(full);
  }
  return out;
}

function checkFileWithAst(file: string): string[] {
  const violations: string[] = [];
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node)) {
      const spec = node.moduleSpecifier;
      if (ts.isStringLiteral(spec)) {
        const target = spec.text;
        if (
          FORBIDDEN_IMPORT_PREFIXES.some(
            (prefix) => target === prefix || target.startsWith(`${prefix}/`) || target.startsWith(prefix),
          ) ||
          ["@content", "@app", "@game", "@ui", "@infra"].some(
            (alias) => target === alias || target.startsWith(`${alias}/`),
          )
        ) {
          violations.push(`${file}: forbidden import "${target}"`);
        }
        if (target.startsWith("..")) {
          const resolved = path.resolve(path.dirname(file), target);
          const allowed =
            resolved.startsWith(path.join(repoRoot, "src", "domain")) ||
            resolved.startsWith(path.join(repoRoot, "src", "shared"));
          if (!allowed) {
            violations.push(`${file}: relative import "${target}" escapes src/domain + src/shared`);
          }
        }
      }
    }
    if (ts.isIdentifier(node)) {
      const parent = node.parent;
      const isPropertyName =
        (ts.isPropertyAccessExpression(parent) && parent.name === node) ||
        (ts.isPropertyAssignment(parent) && parent.name === node) ||
        (ts.isPropertySignature(parent) && parent.name === node) ||
        (ts.isPropertyDeclaration(parent) && parent.name === node) ||
        (ts.isMethodDeclaration(parent) && parent.name === node) ||
        (ts.isQualifiedName(parent) && parent.right === node);
      const isDeclarationName =
        (ts.isVariableDeclaration(parent) && parent.name === node) ||
        (ts.isFunctionDeclaration(parent) && parent.name === node) ||
        (ts.isClassDeclaration(parent) && parent.name === node) ||
        (ts.isInterfaceDeclaration(parent) && parent.name === node) ||
        (ts.isTypeAliasDeclaration(parent) && parent.name === node) ||
        (ts.isEnumDeclaration(parent) && parent.name === node) ||
        (ts.isImportSpecifier(parent) && parent.propertyName === node);
      if (!isPropertyName && !isDeclarationName && FORBIDDEN_GLOBALS.has(node.text)) {
        violations.push(`${file}: forbidden global "${node.text}"`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return violations;
}

describe("domain purity (plan §6)", () => {
  it("A. the purity rules catch every violation in the committed fixture", () => {
    const linter = new Linter();
    const code = readFileSync(fixturePath, "utf8");
    const messages = linter.verify(
      code,
      {
        files: ["**/*.ts"],
        languageOptions: { ecmaVersion: 2022, sourceType: "module" },
        rules: PURITY_RULES,
      },
      "violation.ts",
    );
    const ruleIds = messages.map((m) => `${m.ruleId}:${m.message}`);
    const importErrors = messages.filter((m) => m.ruleId === "no-restricted-imports");
    const globalErrors = messages.filter((m) => m.ruleId === "no-restricted-globals");
    expect(importErrors.length).toBeGreaterThanOrEqual(2);
    expect(importErrors.some((m) => m.message.includes("phaser"))).toBe(true);
    expect(importErrors.some((m) => m.message.includes("zod"))).toBe(true);
    for (const name of ["window", "document", "localStorage", "fetch", "navigator"]) {
      expect(
        globalErrors.some((m) => m.message.includes(name)),
        `expected a no-restricted-globals error mentioning ${name}; got: ${ruleIds.join(" | ")}`,
      ).toBe(true);
    }
    expect(messages.every((m) => m.severity === 2)).toBe(true);
  });

  it("B. every real file under src/domain and src/shared is pure", () => {
    const files = [
      ...walkTsFiles(path.join(repoRoot, "src", "domain")),
      ...walkTsFiles(path.join(repoRoot, "src", "shared")),
    ].filter((f) => !f.includes("__fixtures__"));
    expect(files.length).toBeGreaterThan(0);
    const violations = files.flatMap(checkFileWithAst);
    expect(violations).toEqual([]);
  });
});
