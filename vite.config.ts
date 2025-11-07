import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/", // ✅ note the ending slash
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    open: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  preview: {
    port: 8080,
    strictPort: true,
  },
  optimizeDeps: {
    include: ["@radix-ui/react-dialog"],
  },
}));
