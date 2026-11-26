// src/content/schema/resource.ts — resource node definitions (plan §3.4, §7).
import { z } from "zod";
import { anyIdSchema, idSchema, labelSchema, placeholderField } from "./common.ts";

export const resourceNodeSchema = z.strictObject({
  id: idSchema("resource"),
  name: labelSchema,
  mapId: anyIdSchema,
  /** Tile position on the map (32px tiles, top-down). */
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  /** Item id gathered from this node. */
  itemId: anyIdSchema,
  /** Respawn rule; v0.1 only supports daily respawn (plan §3.4). */
  respawnRule: z.enum(["daily"]),
  placeholder: placeholderField,
});

export type ResourceNodeDef = z.infer<typeof resourceNodeSchema>;
