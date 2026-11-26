// src/content/schema/map.ts — map definitions (plan §3.4, §7).
// 4 maps in v0.1. Sizes are tile counts (32px tiles, top-down).
import { z } from "zod";
import { anyIdSchema, idSchema, labelSchema, placeholderField } from "./common.ts";

export const mapSchema = z.strictObject({
  id: idSchema("map"),
  name: labelSchema,
  widthTiles: z.number().int().min(1),
  heightTiles: z.number().int().min(1),
  /** Exits to other maps: { toMapId, x, y } tile positions. */
  exits: z.array(
    z.strictObject({
      toMapId: anyIdSchema,
      x: z.number().int().min(0),
      y: z.number().int().min(0),
    }),
  ),
  placeholder: placeholderField,
});

export type MapDef = z.infer<typeof mapSchema>;
