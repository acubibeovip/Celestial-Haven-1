// src/content/schema/recipe.ts — crafting recipe definitions (plan §7).
import { z } from "zod";
import { anyIdSchema, idSchema, labelSchema, placeholderField } from "./common.ts";

const stackSchema = z.strictObject({
  itemId: anyIdSchema,
  quantity: z.number().int().min(1),
});

export const recipeSchema = z.strictObject({
  id: idSchema("recipe"),
  name: labelSchema,
  /** Crafting station, e.g. "forge" or "workbench" (NPC Orin / village forge). */
  station: z.string().min(1).max(60),
  inputs: z.array(stackSchema).min(1),
  outputs: z.array(stackSchema).min(1),
  /** Human-readable requirement, e.g. a quest or level gate. Optional. */
  requirement: z.string().min(1).max(200).optional(),
  placeholder: placeholderField,
});

export type RecipeDef = z.infer<typeof recipeSchema>;
