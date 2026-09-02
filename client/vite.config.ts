import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// Builds the UI into ../public, which the Express app serves as static files.
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../public",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    // During UI-only dev, proxy API calls to the Express server.
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
})
