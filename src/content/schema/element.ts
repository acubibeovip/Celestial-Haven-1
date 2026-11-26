// src/content/schema/element.ts — element definitions (plan §7).
import { z } from "zod";
import { colorSchema, idSchema, labelSchema, placeholderField } from "./common.ts";

export const elementSchema = z.strictObject({
  id: idSchema("element"),
  label: labelSchema,
  /** Only 3 elements are active in v0.1; the rest are neutral (plan §4). */
  active: z.boolean(),
  color: colorSchema,
  placeholder: placeholderField,
});

export type ElementDef = z.infer<typeof elementSchema>;
