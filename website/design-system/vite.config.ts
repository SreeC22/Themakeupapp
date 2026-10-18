import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { buildTokens } from "./scripts/build-tokens.mjs";

function designTokensPlugin(): Plugin {
  const tokensFile = path.resolve(import.meta.dirname, "tokens.json");
  return {
    name: "design-tokens",
    buildStart() {
      buildTokens();
      this.addWatchFile(tokensFile);
    },
    configureServer(server) {
      server.watcher.add(tokensFile);
      server.watcher.on("change", (file) => {
        if (path.resolve(file) === tokensFile) {
          buildTokens();
          server.ws.send({ type: "full-reload" });
        }
      });
    },
  };
}

const port = Number(process.env.PORT ?? 5174);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}
const base = process.env.BASE_PATH ?? "/";
if (!base.startsWith("/") || !base.endsWith("/")) {
  throw new Error("BASE_PATH must start and end with /.");
}

export default defineConfig({
  base,
  plugins: [designTokensPlugin(), react(), tailwindcss()],
  resolve: { dedupe: ["react", "react-dom"] },
  build: { outDir: "dist/public", emptyOutDir: true },
  server: { port, host: "0.0.0.0", strictPort: true },
  preview: { port, host: "0.0.0.0", strictPort: true },
});
