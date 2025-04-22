import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Dynamically import lovable-tagger only in development mode
const loadDevPlugins = async (mode: string) => {
  if (mode === "development") {
    try {
      const { componentTagger } = await import("lovable-tagger");
      return [componentTagger()];
    } catch (e) {
      console.warn("lovable-tagger not available:", e);
      return [];
    }
  }
  return [];
};

export default defineConfig(async ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const devPlugins = await loadDevPlugins(mode);

  return {
    base: "/",
    plugins: [react(), ...(mode === "development" ? devPlugins : [])],
    server: {
      port: 4000,
      host: "0.0.0.0",
      strictPort: false,
      open: true,
      cors: true,
      hmr: {
        host: "localhost",
        port: 4000,
        protocol: "ws",
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@styles": path.resolve(__dirname, "./src/styles"),
      },
    },
  };
});
