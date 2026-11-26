// src/content/schema/hero.ts — hero definitions (plan §3.2, §7).
// Names follow the plan. Template is one of the 3 v0.1 gameplay templates.
// Element IDs, stats and balance numbers are placeholders.
import { z } from "zod";
import { anyIdSchema, idSchema, labelSchema, placeholderField } from "./common.ts";

export const heroTemplateSchema = z.enum(["close", "ranged", "support"]);
export type HeroTemplate = z.infer<typeof heroTemplateSchema>;

export const heroSchema = z.strictObject({
  id: idSchema("hero"),
  name: labelSchema,
  template: heroTemplateSchema,
  elementId: anyIdSchema,
  /** Placeholder portrait label (code-generated art; no asset file yet). */
  portrait: z.string().min(1).max(120),
  placeholder: placeholderField,
});

export type HeroDef = z.infer<typeof heroSchema>;
