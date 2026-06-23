/// <reference types="vitest/config" />
import { copyFileSync } from "node:fs";
import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages has no SPA fallback: emit a 404.html copy of index.html so deep
// links (e.g. /system/projects/pocketllm) load the app and the router takes over.
function spa404(): PluginOption {
  return {
    name: "spa-404",
    closeBundle() {
      try {
        copyFileSync("dist/index.html", "dist/404.html");
      } catch {
        /* dist/index.html only exists after a real build */
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Project Pages serve under /<repo>/. Keep dev at root for convenience.
  base: command === "build" ? "/portfolio/" : "/",
  plugins: [react(), spa404()],
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
}));
