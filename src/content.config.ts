import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const baseContentSchema = z.object({
  title: z.string().optional(),
  date: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  summary: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: baseContentSchema,
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: baseContentSchema.extend({
    order: z.number().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: baseContentSchema.extend({
    url: z.url().optional(),
    repo: z.url().optional(),
    status: z.enum(['active', 'paused', 'archived']).optional(),
  }),
});

export const collections = { posts, docs, projects };
