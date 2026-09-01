import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/projects",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      role: z.string().optional(),
      year: z.number().optional(),
      status: z.enum(["placeholder", "published"]).default("placeholder"),
      outcome: z.string().optional(),
      cover: image().optional(),
      coverShader: z.enum(["r5", "qualtrics"]).optional(),
      order: z.number(),
      externalUrl: z.string().optional(),
    }),
});

const playground = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/playground",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      role: z.string().optional(),
      year: z.number().optional(),
      status: z.enum(["placeholder", "published"]).default("placeholder"),
      outcome: z.string().optional(),
      cover: image().optional(),
      coverShader: z.enum(["r5", "qualtrics"]).optional(),
      order: z.number(),
      externalUrl: z.string().optional(),
    }),
});

export const collections = { projects, playground };
