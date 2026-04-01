import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    allowedHosts: ["miguelina-foliolate-daniell.ngrok-free.dev"],
    proxy: {
      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
      },
      "/docs": {
        target: "http://localhost:3000",
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
  },
});
