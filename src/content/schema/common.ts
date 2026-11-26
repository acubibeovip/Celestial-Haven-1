// src/content/schema/common.ts — shared pieces for content schemas (M0-05).
//
// Zod schemas live in src/content/schema/ only, never in src/domain (plan §6).
// Every content definition carries "placeholder": true until real audited
// assets/data replace it (see docs/PLACEHOLDERS.md).

import { z } from "zod";
import { ID_PATTERN, isValidIdFormat, validateId, type IdKind } from "../../shared/ids.ts";

/** Every placeholder definition must carry "placeholder": true. */
export const placeholderField = z.literal(true);

/** Own-id schema for a kind: format + mandatory kind prefix. */
export function idSchema(kind: IdKind) {
  return z.string().refine((id) => validateId(id, kind).ok, {
    message: `id must match ${String(ID_PATTERN)} with prefix for kind "${kind}"`,
  });
}

/** Reference-id schema: format only (existence + kind are checked by the validator). */
export const anyIdSchema = z.string().refine(isValidIdFormat, {
  message: `referenced id must match ${String(ID_PATTERN)}`,
});

/** A non-empty display string. */
export const labelSchema = z.string().min(1).max(120);

/** Hex colour like #FFD166. */
export const colorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
  message: "color must be a #RRGGBB hex string",
});
