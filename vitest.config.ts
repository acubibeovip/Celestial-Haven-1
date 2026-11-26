import { defineConfig } from "vitest/config";

const root = import.meta.dirname;

export default defineConfig({
  resolve: {
    alias: {
      "@domain": `${root}/src/domain`,
      "@shared": `${root}/src/shared`,
      "@content": `${root}/src/content`,
      "@app": `${root}/src/application`,
      "@game": `${root}/src/game`,
      "@ui": `${root}/src/ui`,
      "@infra": `${root}/src/infrastructure`,
    },
  },
  test: {
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
    environment: "node",
    testTimeout: 10000,
  },
});
