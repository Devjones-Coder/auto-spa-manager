// vite.config.ts
import { defineConfig } from "file:///C:/Users/Raphaela/Documents/projects/demo-minas/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Raphaela/Documents/projects/demo-minas/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/Raphaela/Documents/projects/demo-minas/node_modules/lovable-tagger/dist/index.js";

// config.js
var config = {
  // Portas
  server: {
    port: 3001
  },
  frontend: {
    port: 3e3
  },
  // Banco de dados MariaDB
  database: {
    host: "localhost",
    user: "root",
    password: "",
    name: "stageminas",
    port: 3306
  },
  // Vonage (WhatsApp)
  vonage: {
    key: "c18fbb59",
    secret: "nZjw^6Ee",
    number: "5511910862268"
  },
  // Rate Limiting
  rateLimit: {
    intervalMs: 1,
    // Intervalo entre requisições em milissegundos
    burstSize: 20
    // Tamanho do burst inicial (quantidade de requisições permitidas antes de aplicar o limite)
  }
};

// vite.config.ts
var __vite_injected_original_dirname = "C:\\Users\\Raphaela\\Documents\\projects\\demo-minas";
var BACKEND_PORT = config.server.port;
console.log("\n\u{1F4CB} Vite - Configura\xE7\xE3o de Proxy:");
console.log("   Porta do backend (proxy):", BACKEND_PORT);
console.log("   Target do proxy: http://localhost:" + BACKEND_PORT + "\n");
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: config.frontend.port,
    allowedHosts: [
      "node.devjones.cloud",
      "localhost",
      ".devjones.cloud"
    ],
    proxy: {
      "/api": {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true,
        secure: false
      },
      "/health": {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiY29uZmlnLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcUmFwaGFlbGFcXFxcRG9jdW1lbnRzXFxcXHByb2plY3RzXFxcXGRlbW8tbWluYXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFJhcGhhZWxhXFxcXERvY3VtZW50c1xcXFxwcm9qZWN0c1xcXFxkZW1vLW1pbmFzXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9SYXBoYWVsYS9Eb2N1bWVudHMvcHJvamVjdHMvZGVtby1taW5hcy92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSBcIi4vY29uZmlnLmpzXCI7XG5cbi8vIE9idGVyIHBvcnRhIGRvIGJhY2tlbmQgZG8gY29uZmlnLmpzXG5jb25zdCBCQUNLRU5EX1BPUlQgPSBjb25maWcuc2VydmVyLnBvcnQ7XG5cbmNvbnNvbGUubG9nKCdcXG5cdUQ4M0RcdURDQ0IgVml0ZSAtIENvbmZpZ3VyYVx1MDBFN1x1MDBFM28gZGUgUHJveHk6Jyk7XG5jb25zb2xlLmxvZygnICAgUG9ydGEgZG8gYmFja2VuZCAocHJveHkpOicsIEJBQ0tFTkRfUE9SVCk7XG5jb25zb2xlLmxvZygnICAgVGFyZ2V0IGRvIHByb3h5OiBodHRwOi8vbG9jYWxob3N0OicgKyBCQUNLRU5EX1BPUlQgKyAnXFxuJyk7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjo6XCIsXG4gICAgcG9ydDogY29uZmlnLmZyb250ZW5kLnBvcnQsXG4gICAgYWxsb3dlZEhvc3RzOiBbXG4gICAgICAnbm9kZS5kZXZqb25lcy5jbG91ZCcsXG4gICAgICAnbG9jYWxob3N0JyxcbiAgICAgICcuZGV2am9uZXMuY2xvdWQnXG4gICAgXSxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogYGh0dHA6Ly9sb2NhbGhvc3Q6JHtCQUNLRU5EX1BPUlR9YCxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgICcvaGVhbHRoJzoge1xuICAgICAgICB0YXJnZXQ6IGBodHRwOi8vbG9jYWxob3N0OiR7QkFDS0VORF9QT1JUfWAsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBtb2RlID09PSBcImRldmVsb3BtZW50XCIgJiYgY29tcG9uZW50VGFnZ2VyKCldLmZpbHRlcihCb29sZWFuKSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxufSkpO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxSYXBoYWVsYVxcXFxEb2N1bWVudHNcXFxccHJvamVjdHNcXFxcZGVtby1taW5hc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcUmFwaGFlbGFcXFxcRG9jdW1lbnRzXFxcXHByb2plY3RzXFxcXGRlbW8tbWluYXNcXFxcY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9SYXBoYWVsYS9Eb2N1bWVudHMvcHJvamVjdHMvZGVtby1taW5hcy9jb25maWcuanNcIjsvKipcclxuICogQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgY2VudHJhbGl6YWRhcyBkYSBhcGxpY2FcdTAwRTdcdTAwRTNvXHJcbiAqIFN1YnN0aXR1aSBvIHVzbyBkZSAuZW52XHJcbiAqL1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcclxuICAvLyBQb3J0YXNcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDMwMDEsXHJcbiAgfSxcclxuICBmcm9udGVuZDoge1xyXG4gICAgcG9ydDogMzAwMCxcclxuICB9LFxyXG4gIFxyXG4gIC8vIEJhbmNvIGRlIGRhZG9zIE1hcmlhREJcclxuICBkYXRhYmFzZToge1xyXG4gICAgaG9zdDogJ2xvY2FsaG9zdCcsXHJcbiAgICB1c2VyOiAncm9vdCcsXHJcbiAgICBwYXNzd29yZDogJycsXHJcbiAgICBuYW1lOiAnc3RhZ2VtaW5hcycsXHJcbiAgICBwb3J0OiAzMzA2LFxyXG4gIH0sXHJcbiAgXHJcbiAgLy8gVm9uYWdlIChXaGF0c0FwcClcclxuICB2b25hZ2U6IHtcclxuICAgIGtleTogJ2MxOGZiYjU5JyxcclxuICAgIHNlY3JldDogJ25aandeNkVlJyxcclxuICAgIG51bWJlcjogJzU1MTE5MTA4NjIyNjgnLFxyXG4gIH0sXHJcbiAgXHJcbiAgLy8gUmF0ZSBMaW1pdGluZ1xyXG4gIHJhdGVMaW1pdDoge1xyXG4gICAgaW50ZXJ2YWxNczogMSwgLy8gSW50ZXJ2YWxvIGVudHJlIHJlcXVpc2lcdTAwRTdcdTAwRjVlcyBlbSBtaWxpc3NlZ3VuZG9zXHJcbiAgICBidXJzdFNpemU6IDIwLCAgIC8vIFRhbWFuaG8gZG8gYnVyc3QgaW5pY2lhbCAocXVhbnRpZGFkZSBkZSByZXF1aXNpXHUwMEU3XHUwMEY1ZXMgcGVybWl0aWRhcyBhbnRlcyBkZSBhcGxpY2FyIG8gbGltaXRlKVxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25maWc7XHJcblxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJVLFNBQVMsb0JBQW9CO0FBQ3hXLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7OztBQ0V6QixJQUFNLFNBQVM7QUFBQTtBQUFBLEVBRXBCLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxVQUFVO0FBQUEsSUFDUixNQUFNO0FBQUEsRUFDUjtBQUFBO0FBQUEsRUFHQSxVQUFVO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBO0FBQUEsRUFHQSxRQUFRO0FBQUEsSUFDTixLQUFLO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsRUFDVjtBQUFBO0FBQUEsRUFHQSxXQUFXO0FBQUEsSUFDVCxZQUFZO0FBQUE7QUFBQSxJQUNaLFdBQVc7QUFBQTtBQUFBLEVBQ2I7QUFDRjs7O0FEbkNBLElBQU0sbUNBQW1DO0FBT3pDLElBQU0sZUFBZSxPQUFPLE9BQU87QUFFbkMsUUFBUSxJQUFJLGlEQUFvQztBQUNoRCxRQUFRLElBQUksZ0NBQWdDLFlBQVk7QUFDeEQsUUFBUSxJQUFJLDBDQUEwQyxlQUFlLElBQUk7QUFHekUsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNLE9BQU8sU0FBUztBQUFBLElBQ3RCLGNBQWM7QUFBQSxNQUNaO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRLG9CQUFvQixZQUFZO0FBQUEsUUFDeEMsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxNQUNBLFdBQVc7QUFBQSxRQUNULFFBQVEsb0JBQW9CLFlBQVk7QUFBQSxRQUN4QyxjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsaUJBQWlCLGdCQUFnQixDQUFDLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDOUUsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
