/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        // Keep three / r3f in their own chunk so the app code can be cached
        // independently and the galaxy entry stays small.
        manualChunks: {
          three: ["three"],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
