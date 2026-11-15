import type { Lang } from "../i18n/context";

export function langPath(lang: Lang, path = ""): string {
  if (!path || path === "/") return `/${lang}`;
  return `/${lang}${path.startsWith("/") ? path : `/${path}`}`;
}

export function swapLang(pathname: string, next: Lang): string {
  const parts = pathname.split("/");
  if (parts.length < 2) return `/${next}`;
  parts[1] = next;
  return parts.join("/") || `/${next}`;
}
