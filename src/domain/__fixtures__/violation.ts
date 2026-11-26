// INTENTIONAL VIOLATION FIXTURE — DO NOT "FIX" THIS FILE.
//
// This file deliberately breaks every domain-purity rule (plan §6) so that
// tests/unit/domain-purity.test.ts can prove the rules catch violations:
// it imports phaser and zod, and touches window/document/localStorage/
// fetch/navigator. It is ignored by eslint.config.mjs (whole-repo `npm run
// lint` must stay green) and is never imported by game code.
//
// It is written WITHOUT TypeScript-only syntax on purpose: the Vitest test
// runs the purity rules through ESLint's core Linter API (espree). The
// whole-repo `npm run lint` now also flags it (verified with
// `npx eslint src/domain/__fixtures__/violation.ts --no-ignore`: 7 errors)
// since typescript-eslint 8.70.0 enabled real TS linting (ADR-001).
import Phaser from "phaser";
import { z } from "zod";

export const schema = z.string();
export const game = Phaser.Game;

export function leak() {
  window.alert("leak");
  document.title = "leak";
  localStorage.setItem("leak", "yes");
  fetch("/leak");
  return navigator.userAgent;
}
