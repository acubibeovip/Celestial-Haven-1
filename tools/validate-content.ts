// tools/validate-content.ts — content validator CLI (M0-05, plan §6).
//
// Run: `npm run validate:content`. Runs before every build via the `prebuild`
// hook. Checks Zod schema, ID format + kind prefix, global ID uniqueness,
// missing references, quest-graph cycles, and manifest counts. Exits 1 on
// any error. Run by Node 24 type-stripping (erasable syntax only); all
// relative imports use explicit `.ts` extensions.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CONTENT_FILES, validateContentFiles } from "../src/content/validate.ts";
import type { ContentKind } from "../src/content/schema/index.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "src", "content");

const errors: string[] = [];
const files: Partial<Record<ContentKind, unknown>> = {};
let manifestRaw: unknown;

for (const kind of Object.keys(CONTENT_FILES) as ContentKind[]) {
  const file = path.join(contentDir, CONTENT_FILES[kind]);
  try {
    files[kind] = JSON.parse(readFileSync(file, "utf8")) as unknown;
  } catch (error) {
    errors.push(
      `[${CONTENT_FILES[kind]}] cannot read/parse: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
try {
  manifestRaw = JSON.parse(readFileSync(path.join(contentDir, "manifest.json"), "utf8")) as unknown;
} catch (error) {
  errors.push(
    `[manifest.json] cannot read/parse: ${error instanceof Error ? error.message : String(error)}`,
  );
}

errors.push(...validateContentFiles(files, manifestRaw));

if (errors.length > 0) {
  for (const error of errors) console.error(`validate:content: ${error}`);
  console.error(`validate:content: FAILED with ${errors.length} error(s)`);
  process.exit(1);
}

const total = Object.values(files).reduce(
  (sum: number, value: unknown): number =>
    sum + (Array.isArray(value) ? value.length : 0),
  0,
);
console.log(`validate:content: OK (${total} definitions across ${Object.keys(files).length} files)`);
