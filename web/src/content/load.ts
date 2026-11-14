import type { ComponentType } from "react";
import type { Lang } from "../i18n/context";
import { parseNote, parseProject, type Note, type Pillar, type Project } from "./schemas";

type MdxModule = {
  default: ComponentType;
  frontmatter?: unknown;
};

const noteModules = import.meta.glob("./{es,en}/notes/*.mdx", {
  eager: true,
}) as Record<string, MdxModule>;

const projectModules = import.meta.glob("./{es,en}/projects/*.mdx", {
  eager: true,
}) as Record<string, MdxModule>;

function isPublished(draft: boolean) {
  return import.meta.env.DEV || !draft;
}

function allNotes(): Note[] {
  return Object.entries(noteModules).map(([file, module]) => ({
    ...parseNote(module.frontmatter, file),
    Component: module.default,
    fallback: false,
  }));
}

function allProjects(): Project[] {
  return Object.entries(projectModules).map(([file, module]) => ({
    ...parseProject(module.frontmatter, file),
    Component: module.default,
  }));
}

export function getNotes(lang: Lang, pillar?: Pillar): Note[] {
  const published = allNotes().filter((note) => isPublished(note.draft));
  const bySlug = new Map<string, Note[]>();
  for (const note of published) {
    const group = bySlug.get(note.slug) ?? [];
    group.push(note);
    bySlug.set(note.slug, group);
  }

  const chosen: Note[] = [];
  for (const group of bySlug.values()) {
    const exact = group.find((note) => note.lang === lang);
    const note = exact ?? group[0];
    if (!note) continue;
    if (pillar && note.pillar !== pillar) continue;
    chosen.push({ ...note, fallback: note.lang !== lang });
  }

  return chosen.sort((a, b) => b.date.localeCompare(a.date));
}

export function getNote(lang: Lang, slug: string): Note | null {
  return getNotes(lang).find((note) => note.slug === slug) ?? null;
}

export function getProjects(lang: Lang): Project[] {
  const published = allProjects().filter((project) => isPublished(project.draft));
  const bySlug = new Map<string, Project[]>();
  for (const project of published) {
    const group = bySlug.get(project.slug) ?? [];
    group.push(project);
    bySlug.set(project.slug, group);
  }

  const chosen: Project[] = [];
  for (const group of bySlug.values()) {
    const project = group.find((item) => item.lang === lang) ?? group[0];
    if (project) chosen.push(project);
  }

  return chosen.sort((a, b) => a.order - b.order || b.date.localeCompare(a.date));
}
