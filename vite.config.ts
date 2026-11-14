import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  root: "demo",
  plugins: [react()],
  build: { outDir: "../demo-dist", emptyOutDir: true },
  test: {
    root: ".",
    environment: "jsdom",
    include: ["packages/**/*.test.{ts,tsx}", "demo/**/*.test.ts"],
    setupFiles: ["./scripts/test-setup.ts"],
  },
});
