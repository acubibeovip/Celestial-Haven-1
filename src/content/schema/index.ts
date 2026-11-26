// src/content/schema/index.ts — schema registry (M0-05).
// Single entry point for the content validator and content tests.
// Zod schemas live here only, never in src/domain (plan §6).
export * from "./common.ts";
export * from "./element.ts";
export * from "./hero.ts";
export * from "./item.ts";
export * from "./recipe.ts";
export * from "./quest.ts";
export * from "./creature.ts";
export * from "./npc.ts";
export * from "./resource.ts";
export * from "./crop.ts";
export * from "./map.ts";
export * from "./encounter.ts";
export * from "./manifest.ts";

import { z } from "zod";
import { creatureSchema } from "./creature.ts";
import { cropSchema } from "./crop.ts";
import { elementSchema } from "./element.ts";
import { encounterSchema } from "./encounter.ts";
import { heroSchema } from "./hero.ts";
import { itemSchema } from "./item.ts";
import { mapSchema } from "./map.ts";
import { npcSchema } from "./npc.ts";
import { questSchema } from "./quest.ts";
import { recipeSchema } from "./recipe.ts";
import { resourceNodeSchema } from "./resource.ts";
import { manifestSchema } from "./manifest.ts";

/** Kind key -> array schema for that kind's JSON file. */
export const CONTENT_FILE_SCHEMAS = {
  elements: z.array(elementSchema),
  heroes: z.array(heroSchema),
  items: z.array(itemSchema),
  recipes: z.array(recipeSchema),
  quests: z.array(questSchema),
  creatures: z.array(creatureSchema),
  npcs: z.array(npcSchema),
  resources: z.array(resourceNodeSchema),
  crops: z.array(cropSchema),
  maps: z.array(mapSchema),
  encounters: z.array(encounterSchema),
} as const;

export type ContentKind = keyof typeof CONTENT_FILE_SCHEMAS;

export const MANIFEST_SCHEMA = manifestSchema;
