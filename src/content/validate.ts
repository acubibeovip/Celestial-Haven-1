// src/content/validate.ts — content validation logic (M0-05).
//
// Checks: Zod schema, ID format + kind prefix (via the schemas), global ID
// uniqueness, missing references, quest-graph cycles, manifest counts.
// Returns a list of human-readable error strings; empty means valid.
// Pure over parsed data (no fs): the CLI wrapper (tools/validate-content.ts)
// does the file reading. Imported by tests as well.

import { CONTENT_FILE_SCHEMAS, MANIFEST_SCHEMA, type ContentKind } from "./schema/index.ts";
import { idKind } from "../shared/ids.ts";

export const CONTENT_FILES: Record<ContentKind, string> = {
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

type RefRule = {
  fromKind: ContentKind;
  field: string;
  /** Expected kind of the referenced id, or null when any kind is allowed. */
  refKind: ContentKind | "element" | null;
  getRefs: (def: Record<string, unknown>) => string[];
};

const strArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];

const stackItemIds = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.flatMap((entry) =>
        typeof entry === "object" && entry !== null && typeof (entry as Record<string, unknown>).itemId === "string"
          ? [(entry as Record<string, unknown>).itemId as string]
          : [],
      )
    : [];

/** Which fields of each kind reference ids of which other kind. */
const REF_RULES: RefRule[] = [
  { fromKind: "heroes", field: "elementId", refKind: "elements", getRefs: (d) => (typeof d.elementId === "string" ? [d.elementId] : []) },
  { fromKind: "recipes", field: "inputs[].itemId", refKind: "items", getRefs: (d) => stackItemIds(d.inputs) },
  { fromKind: "recipes", field: "outputs[].itemId", refKind: "items", getRefs: (d) => stackItemIds(d.outputs) },
  { fromKind: "quests", field: "prereqs[]", refKind: "quests", getRefs: (d) => strArray(d.prereqs) },
  { fromKind: "quests", field: "next[]", refKind: "quests", getRefs: (d) => strArray(d.next) },
  { fromKind: "quests", field: "reward.items[].itemId", refKind: "items", getRefs: (d) => stackItemIds((d.reward as Record<string, unknown> | undefined)?.items) },
  { fromKind: "creatures", field: "elementId", refKind: "elements", getRefs: (d) => (typeof d.elementId === "string" ? [d.elementId] : []) },
  { fromKind: "creatures", field: "habitat", refKind: "maps", getRefs: (d) => (typeof d.habitat === "string" ? [d.habitat] : []) },
  { fromKind: "npcs", field: "mapId", refKind: "maps", getRefs: (d) => (typeof d.mapId === "string" ? [d.mapId] : []) },
  { fromKind: "npcs", field: "questRefs[]", refKind: "quests", getRefs: (d) => strArray(d.questRefs) },
  { fromKind: "resources", field: "mapId", refKind: "maps", getRefs: (d) => (typeof d.mapId === "string" ? [d.mapId] : []) },
  { fromKind: "resources", field: "itemId", refKind: "items", getRefs: (d) => (typeof d.itemId === "string" ? [d.itemId] : []) },
  { fromKind: "crops", field: "yieldItemId", refKind: "items", getRefs: (d) => (typeof d.yieldItemId === "string" ? [d.yieldItemId] : []) },
  // Map exits are checked separately below (toMapId lives inside exit objects).
  { fromKind: "encounters", field: "mapId", refKind: "maps", getRefs: (d) => (typeof d.mapId === "string" ? [d.mapId] : []) },
  { fromKind: "encounters", field: "rewardItemId", refKind: "items", getRefs: (d) => (typeof d.rewardItemId === "string" ? [d.rewardItemId] : []) },
];

export function validateContentFiles(
  files: Partial<Record<ContentKind, unknown>>,
  manifestRaw: unknown,
): string[] {
  const errors: string[] = [];
  const registry = new Map<string, { kind: ContentKind; file: string }>();
  const parsed: Partial<Record<ContentKind, Record<string, unknown>[]>> = {};

  // 1. Schema validation per file + ID registry.
  for (const kind of Object.keys(CONTENT_FILE_SCHEMAS) as ContentKind[]) {
    const file = CONTENT_FILES[kind];
    const raw = files[kind];
    if (raw === undefined) {
      errors.push(`[${file}] missing content file`);
      continue;
    }
    const result = CONTENT_FILE_SCHEMAS[kind].safeParse(raw);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(`[${file}] ${issue.path.join(".") || "(root)"}: ${issue.message}`);
      }
    }
    const defs = Array.isArray(raw) ? raw : [];
    const good: Record<string, unknown>[] = [];
    for (const def of defs) {
      if (typeof def !== "object" || def === null) continue;
      const record = def as Record<string, unknown>;
      good.push(record);
      if (typeof record.id === "string") {
        const existing = registry.get(record.id);
        if (existing) {
          errors.push(
            `[${file}] duplicate id "${record.id}" (also in ${existing.file} as ${existing.kind})`,
          );
        } else {
          registry.set(record.id, { kind, file });
        }
      }
    }
    parsed[kind] = good;
  }

  // 2. Missing references + wrong-kind references.
  for (const rule of REF_RULES) {
    for (const def of parsed[rule.fromKind] ?? []) {
      const id = typeof def.id === "string" ? def.id : "(no id)";
      for (const ref of rule.getRefs(def)) {
        const target = registry.get(ref);
        if (target === undefined) {
          errors.push(
            `[${CONTENT_FILES[rule.fromKind]}] "${id}" field "${rule.field}" references missing id "${ref}"`,
          );
        } else if (rule.refKind !== null && target.kind !== rule.refKind) {
          errors.push(
            `[${CONTENT_FILES[rule.fromKind]}] "${id}" field "${rule.field}" references "${ref}" which is a ${target.kind}, expected ${rule.refKind}`,
          );
        }
      }
    }
  }

  // Map exits need a dedicated extractor (toMapId lives inside exit objects).
  for (const def of parsed.maps ?? []) {
    const id = typeof def.id === "string" ? def.id : "(no id)";
    const exits = Array.isArray(def.exits) ? def.exits : [];
    for (const exit of exits) {
      const toMapId =
        typeof exit === "object" && exit !== null
          ? (exit as Record<string, unknown>).toMapId
          : undefined;
      if (typeof toMapId !== "string") continue;
      const target = registry.get(toMapId);
      if (target === undefined) {
        errors.push(`[maps.json] "${id}" exit references missing map "${toMapId}"`);
      } else if (target.kind !== "maps") {
        errors.push(`[maps.json] "${id}" exit references "${toMapId}" which is a ${target.kind}, expected maps`);
      }
    }
  }

  // 3. Quest-graph cycles (follow `next` edges).
  const questNext = new Map<string, string[]>();
  for (const def of parsed.quests ?? []) {
    if (typeof def.id === "string") {
      questNext.set(def.id, strArray(def.next));
    }
  }
  const visitState = new Map<string, "visiting" | "done">();
  const visit = (id: string, path: string[]): void => {
    const state = visitState.get(id);
    if (state === "done") return;
    if (state === "visiting") {
      errors.push(`[quests.json] quest cycle detected: ${[...path, id].join(" -> ")}`);
      return;
    }
    visitState.set(id, "visiting");
    for (const next of questNext.get(id) ?? []) {
      if (questNext.has(next)) visit(next, [...path, id]);
    }
    visitState.set(id, "done");
  };
  for (const id of questNext.keys()) visit(id, []);

  // 4. Manifest schema + counts.
  const manifestResult = MANIFEST_SCHEMA.safeParse(manifestRaw);
  if (!manifestResult.success) {
    for (const issue of manifestResult.error.issues) {
      errors.push(`[manifest.json] ${issue.path.join(".") || "(root)"}: ${issue.message}`);
    }
  } else {
    for (const [kind, declared] of Object.entries(manifestResult.data.counts)) {
      const known = kind as ContentKind;
      if (!(kind in CONTENT_FILE_SCHEMAS)) {
        errors.push(`[manifest.json] counts has unknown kind "${kind}"`);
        continue;
      }
      const actual = parsed[known]?.length ?? 0;
      if (actual !== declared) {
        errors.push(
          `[manifest.json] counts.${kind} is ${declared} but ${CONTENT_FILES[known]} has ${actual} entries`,
        );
      }
    }
    // Also flag kinds present in files but missing from counts.
    for (const kind of Object.keys(CONTENT_FILE_SCHEMAS) as ContentKind[]) {
      if (!(kind in manifestResult.data.counts)) {
        errors.push(`[manifest.json] counts is missing kind "${kind}"`);
      }
    }
  }

  // 5. Cross-kind prefix sanity: every registered id's prefix must match its file's kind.
  const kindPrefix: Record<ContentKind, string> = {
    elements: "elem_",
    heroes: "hero_",
    items: "item_",
    recipes: "recipe_",
    quests: "q_",
    creatures: "creature_",
    npcs: "npc_",
    resources: "res_",
    crops: "crop_",
    maps: "map_",
    encounters: "enc_",
  };
  for (const [id, info] of registry) {
    const kind = idKind(id);
    if (kind === null || !id.startsWith(kindPrefix[info.kind])) {
      errors.push(`[${info.file}] id "${id}" does not carry the ${info.kind} prefix "${kindPrefix[info.kind]}"`);
    }
  }

  return errors;
}
