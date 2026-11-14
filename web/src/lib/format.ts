import type { Lang } from "../i18n/context";

export function formatDate(iso: string, lang: Lang): string {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function progressPercent(value: number, target?: number | null): number | null {
  if (target == null || target <= 0) return null;
  return Math.max(0, Math.min(100, (value / target) * 100));
}
