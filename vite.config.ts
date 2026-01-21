import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { config } from "./config.js";

// Obter porta do backend do config.js
const BACKEND_PORT = config.server.port;

console.log('\n📋 Vite - Configuração de Proxy:');
console.log('   Porta do backend (proxy):', BACKEND_PORT);
console.log('   Target do proxy: http://localhost:' + BACKEND_PORT + '\n');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: config.frontend.port,
    allowedHosts: [
      'node.devjones.cloud',
      'localhost',
      '.devjones.cloud'
    ],
    proxy: {
      '/api': {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
