// src/content/schema/npc.ts — NPC definitions (plan §3.5, §7).
// NPC names follow the plan: Mira, Rowan, Orin, Luma, Neris.
import { z } from "zod";
import { anyIdSchema, idSchema, labelSchema, placeholderField } from "./common.ts";

export const npcSchema = z.strictObject({
  id: idSchema("npc"),
  name: labelSchema,
  role: z.string().min(1).max(120),
  /** Home map id. */
  mapId: anyIdSchema,
  /** Quest ids this NPC gives or advances (may be empty). */
  questRefs: z.array(anyIdSchema),
  /** Dialogue ids (strings, resolved by the string registry in M6). */
  dialogueIds: z.array(z.string().min(1).max(120)).min(1),
  placeholder: placeholderField,
});

export type NpcDef = z.infer<typeof npcSchema>;
