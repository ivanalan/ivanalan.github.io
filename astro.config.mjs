// @ts-check

import path from "node:path";
import { fileURLToPath } from "node:url";

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

const root = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: "https://alanmatias.com",
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(root, "./src"),
      },
    },
  },
  integrations: [
    react(),
    mdx(),
    sitemap(),
    icon({
      include: {
        ion: ["arrow-back", "arrow-back-outline"],
      },
    }),
  ],
});
