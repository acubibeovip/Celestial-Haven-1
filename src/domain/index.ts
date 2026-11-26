// src/domain — pure domain rules (plan §6).
//
// This directory must not import phaser, zod, DOM, storage, network, or
// anything outside @domain/@shared. Enforced by eslint.config.mjs
// (no-restricted-imports + no-restricted-globals) and proven by
// tests/unit/domain-purity.test.ts.
//
// M0 scaffold: no domain modules yet. M1+ adds one module per plan §8
// (heroes, progression, inventory, equipment, crafting, gathering, world,
// farming, npc, quests, creatures, encounters, mode) — pure rules + unit
// tests first, adapters and scenes after.
export {};
