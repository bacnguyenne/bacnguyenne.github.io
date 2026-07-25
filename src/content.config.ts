import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
		}),
});

// Vietnamese translation of the SDV101 guide (sdv.guide, CC BY 4.0).
const sdv101 = defineCollection({
	loader: glob({ base: './src/content/sdv101', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		order: z.number(),
		part: z.string(),
		depth: z.number().default(0),
		origTitle: z.string(),
		origUrl: z.string(),
	}),
});

export const collections = { blog, sdv101 };
