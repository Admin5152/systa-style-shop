import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // This will be set to '/systa-style-shop/' for production builds
    // and '/' for development
    base: mode === 'production' ? '/systa-style-shop/' : '/',
    
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
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true, // Helps with debugging
    },
    
    preview: {
      port: 8080,
      strictPort: true,
    },
    
    // Ensure environment variables are properly loaded
    define: {
      'process.env': {}
    },
    
    optimizeDeps: {
      include: ['@radix-ui/react-dialog'],
    },
  };
});
