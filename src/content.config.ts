import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.object({ q: z.string(), a: z.string() });

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      metaTitle: z.string(),
      description: z.string().max(170),
      h1: z.string(),
      summary: z.string(),
      order: z.number(),
      image: image(),
      imageAlt: z.string(),
      keywords: z.array(z.string()),
      parts: z.array(z.string()),
      route: z.array(z.string()),
      capabilities: z.array(reference('capabilities')),
      faqs: z.array(faq).default([]),
    }),
});

const capabilities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/capabilities' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      shortTitle: z.string(),
      metaTitle: z.string(),
      description: z.string().max(170),
      h1: z.string(),
      summary: z.string(),
      machine: z.string(),
      order: z.number(),
      image: image(),
      imageAlt: z.string(),
      keywords: z.array(z.string()),
      applications: z.array(z.string()),
      benefits: z.array(z.string()),
      faqs: z.array(faq).default([]),
    }),
});

export const collections = { products, capabilities };
