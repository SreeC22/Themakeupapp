import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const port = Number(process.env.PORT ?? 5173);
const base = process.env.BASE_PATH ?? "/";
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}
if (!base.startsWith("/") || !base.endsWith("/")) {
  throw new Error("BASE_PATH must start and end with /.");
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
    dedupe: ["react", "react-dom"],
  },
  build: { outDir: "dist/public", emptyOutDir: true },
  server: { port, host: "0.0.0.0", strictPort: true },
  preview: { port, host: "0.0.0.0", strictPort: true },
});
