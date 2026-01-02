import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.date(),
    author: z.string().default('Adam Davies'),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    emoji: z.string().optional(),
    image: z.string().optional(),
    link: z.string().optional(),
    github: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    order: z.number().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};
