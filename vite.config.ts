import { defineConfig } from "vite";

export default defineConfig({
  // Relative base: required for itch.io subpath / iframe hosting (plan §10, REL-03).
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "bundle",
    sourcemap: false,
    emptyOutDir: true,
  },
});
