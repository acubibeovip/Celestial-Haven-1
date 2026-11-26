// src/shared/ids.ts — content ID convention (plan §6/§7, M0-05).
//
// Pure: no imports outside @shared. IDs match ^[a-z][a-z0-9_]{1,47}$ and
// carry a kind prefix. The full registry of kinds is the single source of
// truth for the prefix rule; the content validator (tools/validate-content.ts)
// and the Zod schemas (src/content/schema/) both use it.

import { err, ok, type Result } from "./result.ts";

export const ID_PATTERN = /^[a-z][a-z0-9_]{1,47}$/;

/** Content kinds and their mandatory ID prefixes. */
export const ID_KIND_PREFIXES = {
  element: "elem_",
  hero: "hero_",
  item: "item_",
  recipe: "recipe_",
  quest: "q_",
  creature: "creature_",
  npc: "npc_",
  resource: "res_",
  crop: "crop_",
  map: "map_",
  encounter: "enc_",
} as const;

export type IdKind = keyof typeof ID_KIND_PREFIXES;

export type IdError =
  | { code: "ID_FORMAT"; id: string }
  | { code: "ID_PREFIX"; id: string; kind: IdKind; expectedPrefix: string };

/** True when the id matches ^[a-z][a-z0-9_]{1,47}$ (format only, any kind). */
export function isValidIdFormat(id: string): boolean {
  return ID_PATTERN.test(id);
}

/** The kind whose prefix the id starts with, or null when it has no known prefix. */
export function idKind(id: string): IdKind | null {
  const entries = Object.entries(ID_KIND_PREFIXES) as Array<
    [IdKind, string]
  >;
  for (const [kind, prefix] of entries) {
    if (id.startsWith(prefix)) {
      return kind;
    }
  }
  return null;
}

/**
 * Validate an id for a given kind: format first, then the kind prefix.
 * Returns the id unchanged on success so it composes in validation pipelines.
 */
export function validateId(id: string, kind: IdKind): Result<string, IdError> {
  if (!isValidIdFormat(id)) {
    return err({ code: "ID_FORMAT", id });
  }
  const expectedPrefix = ID_KIND_PREFIXES[kind];
  if (!id.startsWith(expectedPrefix)) {
    return err({ code: "ID_PREFIX", id, kind, expectedPrefix });
  }
  return ok(id);
}
