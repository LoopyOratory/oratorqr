import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  ssr: {
    noExternal: ["zod", "better-auth", "better-call", "@better-fetch"],
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: "src",
      router: { routesDirectory: "app" },
    }),
    viteReact(),
    nitro({
      preset: "bun",
      rollupConfig: {
        externals: [/@qr-platform/],
      },
    }),
  ],
});