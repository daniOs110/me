import type { ComponentType } from "react";
import { z } from "zod";

export const pillars = ["mente", "cuerpo", "arte"] as const;
export type Pillar = (typeof pillars)[number];

const dateField = z.preprocess((value) => {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value;
}, z.string().min(10));

const noteFrontmatter = z.object({
  title: z.string(),
  date: dateField,
  summary: z.string(),
  lang: z.enum(["es", "en"]),
  slug: z.string(),
  pillar: z.enum(pillars),
  tags: z.array(z.string()).default([]),
  video: z.string().default(""),
  draft: z.boolean().default(false),
});

const projectFrontmatter = z.object({
  title: z.string(),
  date: dateField,
  summary: z.string(),
  lang: z.enum(["es", "en"]),
  slug: z.string(),
  problem: z.string(),
  architecture: z.string(),
  result: z.string(),
  stack: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  sample: z.boolean().default(false),
  order: z.number().default(0),
  links: z
    .object({
      github: z.string().optional(),
      live: z.string().optional(),
    })
    .default({}),
  draft: z.boolean().default(false),
});

export type Note = z.infer<typeof noteFrontmatter> & {
  Component: ComponentType;
  fallback: boolean;
};

export type Project = z.infer<typeof projectFrontmatter> & {
  Component: ComponentType;
};

export function parseNote(frontmatter: unknown, file: string) {
  const parsed = noteFrontmatter.safeParse(frontmatter);
  if (!parsed.success) {
    throw new Error(`Nota inválida (${file}): ${parsed.error.message}`);
  }
  return parsed.data;
}

export function parseProject(frontmatter: unknown, file: string) {
  const parsed = projectFrontmatter.safeParse(frontmatter);
  if (!parsed.success) {
    throw new Error(`Proyecto inválido (${file}): ${parsed.error.message}`);
  }
  return parsed.data;
}

export function isPillar(value: string | null): value is Pillar {
  return pillars.includes(value as Pillar);
}
