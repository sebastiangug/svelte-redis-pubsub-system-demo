import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5000,
    host: "0.0.0.0",
    https: {
      key: "ssl/key.pem",
      cert: "ssl/cert.pem",
    },
  },
});
