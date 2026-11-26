// src/content/schema/quest.ts — quest definitions (plan §3.7, §7).
// Quest IDs follow the plan (q_arrive..q_epilogue). The validator checks the
// quest graph for cycles and for missing prereq/next references.
import { z } from "zod";
import { anyIdSchema, idSchema, labelSchema, placeholderField } from "./common.ts";

export const questObjectiveSchema = z.strictObject({
  description: z.string().min(1).max(200),
  /** How many of the objective are needed; 1 when omitted. */
  count: z.number().int().min(1).optional(),
});

export const questRewardSchema = z.strictObject({
  coins: z.number().int().min(0).optional(),
  items: z
    .array(
      z.strictObject({
        itemId: anyIdSchema,
        quantity: z.number().int().min(1),
      }),
    )
    .optional(),
});

export const questSchema = z.strictObject({
  id: idSchema("quest"),
  name: labelSchema,
  /** Quest ids that must be completed first (may be empty). */
  prereqs: z.array(anyIdSchema),
  objectives: z.array(questObjectiveSchema).min(1),
  /** Granted once; the reward ledger (M3) prevents double rewards. */
  reward: questRewardSchema,
  /** Quest ids unlocked after this one (may be empty). */
  next: z.array(anyIdSchema),
  /** Peaceful alternative text for quests with a combat step; optional. */
  peacefulAlternative: z.string().min(1).max(300).optional(),
  placeholder: placeholderField,
});

export type QuestDef = z.infer<typeof questSchema>;
