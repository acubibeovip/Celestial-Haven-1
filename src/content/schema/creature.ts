// src/content/schema/creature.ts — creature definitions (plan §3.6, §7).
import { z } from "zod";
import { anyIdSchema, idSchema, labelSchema, placeholderField } from "./common.ts";

export const creatureSchema = z.strictObject({
  id: idSchema("creature"),
  name: labelSchema,
  elementId: anyIdSchema,
  /** Map id where the creature lives (habitat). */
  habitat: anyIdSchema,
  /** v0.1 behaviour state; Peaceful keeps creatures neutral (plan §3.6). */
  behavior: z.enum(["neutral", "wander", "rest", "follow"]),
  /** Whether this species can become a pet companion. */
  pettable: z.boolean(),
  placeholder: placeholderField,
});

export type CreatureDef = z.infer<typeof creatureSchema>;
