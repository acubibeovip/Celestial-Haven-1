// src/content/schema/crop.ts — crop definitions (plan §3.4, §7).
import { z } from "zod";
import { anyIdSchema, idSchema, labelSchema, placeholderField } from "./common.ts";

export const cropSchema = z.strictObject({
  id: idSchema("crop"),
  name: labelSchema,
  /** In-game days from planting to harvest. */
  growthDays: z.number().int().min(1),
  /** Item id yielded on harvest. */
  yieldItemId: anyIdSchema,
  placeholder: placeholderField,
});

export type CropDef = z.infer<typeof cropSchema>;
