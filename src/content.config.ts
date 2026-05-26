import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const baseContentSchema = z.object({
  title: z.string().optional(),
  date: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  summary: z.string().optional(),
  kind: z.string().optional(),
  tags: z.array(z.string()).default([]),
  created: z.coerce.date().optional(),
  sourcePath: z.string().optional(),
  sourceProject: z.string().optional(),
  draft: z.boolean().default(false),
});

const record = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/record' }),
  schema: baseContentSchema,
});

const wiki = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/wiki' }),
  schema: baseContentSchema.extend({
    order: z.number().optional(),
  }),
});

const toy = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/toy' }),
  schema: baseContentSchema.extend({
    url: z.url().optional(),
    repo: z.url().optional(),
    status: z.enum(['active', 'paused', 'archived']).optional(),
  }),
});

export const collections = { record, wiki, toy };
