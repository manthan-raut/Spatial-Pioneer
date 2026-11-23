import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // "/" locally and on a custom domain; "/Spatial-Pioneer/" on GitHub Pages (set by the deploy workflow)
  base: process.env.BASE_PATH || "/",
  server: {
    port: 5173,
    proxy: { "/api": "http://localhost:5050" },
  },
  // three.js (hero) is code-split automatically via dynamic import() in Hero.jsx —
  // don't add manualChunks for it, it pulls shared deps (scheduler) into the entry chunk.
  build: { chunkSizeWarningLimit: 1200 },
});
