import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
// @ts-ignore
import path from "path"
// @ts-ignore
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
