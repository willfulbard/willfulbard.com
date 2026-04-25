import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    style: z.string(),
    ensemble: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    members: z.array(
      z.object({
        name: z.string(),
        instruments: z.array(z.string()),
        note: z.string().optional(),
      })
    ),
    hero: z.string().nullable().optional(),
    links: z
      .object({
        bandcamp: z.string().url().optional(),
        spotify: z.string().url().optional(),
        youtube: z.string().url().optional(),
        website: z.string().url().optional(),
      })
      .nullable()
      .optional(),
  }),
});

export const collections = { projects };
