// src/content/schema/manifest.ts — content manifest (plan §7).
// The manifest is the honesty note for the placeholder content set: it says
// what is placeholder and what is not yet real. Element IDs, stats and
// balance numbers are placeholders until the M0-02 asset audit lands.
import { z } from "zod";
import { placeholderField } from "./common.ts";

export const manifestSchema = z.strictObject({
  contentVersion: z.string().min(1).max(60),
  placeholder: placeholderField,
  note: z.string().min(1).max(1000),
  /** Declared item counts per kind; the validator checks them against the files. */
  counts: z.record(z.string(), z.number().int().nonnegative()),
});

export type ContentManifest = z.infer<typeof manifestSchema>;
