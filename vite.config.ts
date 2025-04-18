import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Dynamically import lovable-tagger only in development mode
const loadDevPlugins = async (mode: string) => {
  if (mode === 'development') {
    try {
      const { componentTagger } = await import('lovable-tagger');
      return [componentTagger()];
    } catch (e) {
      console.warn('lovable-tagger not available:', e);
      return [];
    }
  }
  return [];
};

export default defineConfig(async ({ mode }) => {
  const devPlugins = await loadDevPlugins(mode);

  return {
    base: '/',
    server: {
      host: "::",
      port: 8080,
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        external: mode === 'production' ? ['lovable-tagger'] : [],
      },
    },
    plugins: [
      react(),
      ...(mode === 'development' ? devPlugins : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@styles": path.resolve(__dirname, "./src/styles")
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  };
});
