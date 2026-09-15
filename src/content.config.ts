import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const work = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/work",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      company: z.string().optional(),
      role: z.string().optional(),
      team: z.string().optional(),
      year: z.number().optional(),
      status: z.enum(["placeholder", "published"]).default("placeholder"),
      cover: image().optional(),
      coverShader: z.enum(["r5", "qualtrics"]).optional(),
      coverVideo: z.string().optional(),
      coverVideoPoster: z.string().optional(),
      coverVideoClassName: z.string().optional(),
      order: z.number(),
      externalUrl: z.string().optional(),
    }),
});

const sideProjects = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/side-projects",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      projectType: z.string().optional(),
      company: z.string().optional(),
      role: z.string().optional(),
      team: z.string().optional(),
      year: z.number().optional(),
      metrics: z.string().optional(),
      status: z.enum(["placeholder", "published"]).default("placeholder"),
      cover: image().optional(),
      coverShader: z.enum(["r5", "qualtrics"]).optional(),
      coverVideo: z.string().optional(),
      coverVideoPoster: z.string().optional(),
      coverVideoClassName: z.string().optional(),
      order: z.number(),
      externalUrl: z.string().optional(),
    }),
});

export const collections = { work, sideProjects };
