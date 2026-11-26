# Placeholders

Every placeholder asset and content file in Celestial Haven MVP v0.1. All of
them are marked `"placeholder": true` in their source file. No owner art
catalog was available, so nothing here is real game art — all visuals are
generated in code (shapes/colors) or are placeholder labels. Real assets
replace these after the M0-02 asset audit (owner files needed).

## Code-generated placeholder art

| Placeholder | Location | What it is |
|---|---|---|
| Boot/title screen (dark background `#15141b`, gold rule `#FFD166`, title text) | `src/main.ts` (BootScene) | Rectangles + text only, no image files |
| Hero portraits | `src/content/heroes.json` (`portrait` fields, e.g. `placeholder-portrait-storm-monk`) | Labels only; no portrait image files exist |
| Item icons | `src/content/items.json` (`icon` fields, e.g. `placeholder-icon-sword`) | Labels only; no icon image files exist |
| 32px tiles / top-down maps | Not built yet (M0-03/M1) | No tile files exist yet |

## Placeholder content data (all `"placeholder": true`)

| File | Entries | Placeholder notes |
|---|---|---|
| `src/content/manifest.json` | 1 | Says so explicitly; counts mirror the files |
| `src/content/elements.json` | 3 | Only 3 active elements (fire/ice/light); colours are placeholders |
| `src/content/heroes.json` | 10 | Names/templates follow plan §3.2; element affinities are a provisional mapping onto the 3 active elements |
| `src/content/items.json` | 10 | Stats, prices and stack sizes are placeholder balance numbers |
| `src/content/recipes.json` | 2 | Placeholder stations/inputs/outputs |
| `src/content/quests.json` | 4 | IDs follow plan §3.7 (q_arrive, q_gather, q_craft, q_shrine); rewards are placeholders |
| `src/content/creatures.json` | 3 | Placeholder species/behaviour; pettable flags provisional |
| `src/content/npcs.json` | 5 | Names/roles follow plan §3.5; dialogue IDs are labels, no dialogue text yet |
| `src/content/resources.json` | 3 | Placeholder node positions; daily respawn |
| `src/content/crops.json` | 2 | Growth days / yields are placeholders |
| `src/content/maps.json` | 4 | Sizes follow plan §3.4; exits are placeholder tile positions |
| `src/content/encounters.json` | 2 | Void Devourer (adventure, 3 phases) + Shrine Marks (peaceful); rewards are placeholders |

## Not placeholders

- `docs/master-plan.md` — the real Master Development Plan v2.0 (source of truth).
- `docs/adr/ADR-001-stack.md`, `docs/progress.md` — real project records.
- No audio exists (none generated, none shipped).
