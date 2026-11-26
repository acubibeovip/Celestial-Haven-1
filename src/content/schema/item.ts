// src/content/schema/item.ts — item definitions (plan §3.3, §7).
import { z } from "zod";
import { idSchema, labelSchema, placeholderField } from "./common.ts";

export const itemKindSchema = z.enum(["gear", "material", "consumable", "key"]);
export type ItemKind = z.infer<typeof itemKindSchema>;

export const itemSchema = z.strictObject({
  id: idSchema("item"),
  name: labelSchema,
  kind: itemKindSchema,
  /** Max stack size; plan §3.3: stack 99. */
  stackMax: z.number().int().min(1).max(99),
  /** Placeholder icon label (code-generated art; no asset file yet). */
  icon: z.string().min(1).max(120),
  /** Fixed in-game price; 0 = not sold. No real-money prices here. */
  price: z.number().int().min(0),
  /** Flat placeholder stat bonuses; balance numbers are placeholders. */
  stats: z
    .strictObject({
      attack: z.number().int().optional(),
      defense: z.number().int().optional(),
      spirit: z.number().int().optional(),
    })
    .optional(),
  placeholder: placeholderField,
});

export type ItemDef = z.infer<typeof itemSchema>;
