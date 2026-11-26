// tests/unit/content-validator.test.ts — validator failure modes (M0-05).
//
// The shipped placeholder content set must pass; each failure mode below
// must produce at least one error mentioning the offending id/field.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { validateContentFiles } from "../../src/content/validate.ts";
import type { ContentKind } from "../../src/content/schema/index.ts";

const contentDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "src",
  "content",
);

const KINDS: ContentKind[] = [
  "elements",
  "heroes",
  "items",
  "recipes",
  "quests",
  "creatures",
  "npcs",
  "resources",
  "crops",
  "maps",
  "encounters",
];

const FILE_NAMES: Record<ContentKind, string> = {
  elements: "elements.json",
  heroes: "heroes.json",
  items: "items.json",
  recipes: "recipes.json",
  quests: "quests.json",
  creatures: "creatures.json",
  npcs: "npcs.json",
  resources: "resources.json",
  crops: "crops.json",
  maps: "maps.json",
  encounters: "encounters.json",
};

function loadClean(): { files: Record<ContentKind, unknown>; manifest: unknown } {
  const files = {} as Record<ContentKind, unknown>;
  for (const kind of KINDS) {
    files[kind] = JSON.parse(readFileSync(path.join(contentDir, FILE_NAMES[kind]), "utf8")) as unknown;
  }
  const manifest = JSON.parse(readFileSync(path.join(contentDir, "manifest.json"), "utf8")) as unknown;
  return { files, manifest };
}

describe("content validator", () => {
  it("passes the shipped placeholder content set", () => {
    const { files, manifest } = loadClean();
    expect(validateContentFiles(files, manifest)).toEqual([]);
  });

  it("rejects a duplicate id", () => {
    const { files, manifest } = loadClean();
    const items = structuredClone(files.items) as Array<Record<string, unknown>>;
    items.push({ ...items[0] });
    const errors = validateContentFiles({ ...files, items }, manifest);
    expect(errors.some((e) => e.includes("duplicate") && e.includes("item_starter_sword"))).toBe(true);
  });

  it("rejects a bad id prefix", () => {
    const { files, manifest } = loadClean();
    const items = structuredClone(files.items) as Array<Record<string, unknown>>;
    items[0]!.id = "sword";
    const errors = validateContentFiles({ ...files, items }, manifest);
    expect(errors.some((e) => e.includes("sword"))).toBe(true);
  });

  it("rejects a schema violation (stackMax above 99)", () => {
    const { files, manifest } = loadClean();
    const items = structuredClone(files.items) as Array<Record<string, unknown>>;
    items[0]!.stackMax = 1000;
    const errors = validateContentFiles({ ...files, items }, manifest);
    expect(errors.some((e) => e.includes("items.json") && e.includes("stackMax"))).toBe(true);
  });

  it("rejects a missing reference", () => {
    const { files, manifest } = loadClean();
    const heroes = structuredClone(files.heroes) as Array<Record<string, unknown>>;
    heroes[0]!.elementId = "elem_nope";
    const errors = validateContentFiles({ ...files, heroes }, manifest);
    expect(errors.some((e) => e.includes("elem_nope") && e.includes("missing"))).toBe(true);
  });

  it("rejects a quest-graph cycle", () => {
    const { files, manifest } = loadClean();
    const quests = structuredClone(files.quests) as Array<Record<string, unknown>>;
    const shrine = quests.find((q) => q.id === "q_shrine");
    shrine!.next = ["q_arrive"];
    const errors = validateContentFiles({ ...files, quests }, manifest);
    expect(errors.some((e) => e.includes("cycle") && e.includes("q_shrine"))).toBe(true);
  });

  it("rejects a manifest count mismatch", () => {
    const { files, manifest } = loadClean();
    const badManifest = structuredClone(manifest) as { counts: Record<string, number> };
    badManifest.counts.items = 999;
    const errors = validateContentFiles(files, badManifest);
    expect(errors.some((e) => e.includes("counts.items"))).toBe(true);
  });
});
