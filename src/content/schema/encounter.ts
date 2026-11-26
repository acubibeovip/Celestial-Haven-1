// src/content/schema/encounter.ts — encounter definitions (plan §3.7, §7).
// Both routes share the shrine: Adventure fights, Peaceful observes/solves.
// The boss encounter is enc_void_devourer (Void Devourer, plan §3.7).
import { z } from "zod";
import { anyIdSchema, idSchema, labelSchema, placeholderField } from "./common.ts";

export const encounterSchema = z.strictObject({
  id: idSchema("encounter"),
  name: labelSchema,
  mapId: anyIdSchema,
  /** Which route this encounter definition belongs to. */
  ruleset: z.enum(["adventure", "peaceful"]),
  /** Number of phases (boss: 3 in v0.1 placeholder data). */
  phases: z.number().int().min(1),
  /** Optional reward item id for clearing the encounter. */
  rewardItemId: anyIdSchema.optional(),
  /** True when the encounter can be completed without combat. */
  peacefulRoute: z.boolean(),
  placeholder: placeholderField,
});

export type EncounterDef = z.infer<typeof encounterSchema>;
