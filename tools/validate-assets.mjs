// tools/validate-assets.mjs — placeholder asset check (plan §5/§6, M6-03 stub).
//
// M0 scope: there are no shipped asset files yet — all art is placeholder art
// generated in code (see docs/PLACEHOLDERS.md). This validator therefore
// checks the honest invariant that holds today:
//   1. docs/PLACEHOLDERS.md exists and lists the placeholder surface.
//   2. public/assets/ (if present) contains no files that are NOT listed
//      in docs/PLACEHOLDERS.md.
// The full M6-03 validator (atlas checks, frame-bounds checks, license
// audit) is not faked here; it is out of scope for M0.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

const placeholdersDoc = path.join(root, "docs", "PLACEHOLDERS.md");
if (!existsSync(placeholdersDoc)) {
  errors.push("docs/PLACEHOLDERS.md is missing");
}
const doc = existsSync(placeholdersDoc)
  ? readFileSync(placeholdersDoc, "utf8")
  : "";

const assetsDir = path.join(root, "public", "assets");
if (existsSync(assetsDir)) {
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (!doc.includes(entry.name)) {
        errors.push(
          `public asset not listed in docs/PLACEHOLDERS.md: ${path.relative(root, full)}`,
        );
      }
    }
  };
  walk(assetsDir);
}

if (errors.length > 0) {
  for (const e of errors) console.error(`validate:assets: ${e}`);
  process.exit(1);
}
console.log("validate:assets: OK (no shipped asset files; all art is code-generated placeholders, see docs/PLACEHOLDERS.md)");
