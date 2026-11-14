import { Link } from "react-router-dom";
import type { Note } from "../content/schemas";
import { useI18n } from "../i18n/context";
import { formatDate } from "../lib/format";
import { langPath } from "../lib/paths";

export function NoteCard({ note }: { note: Note }) {
  const { lang, t } = useI18n();

  return (
    <article className="border-b border-line py-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        <span>{formatDate(note.date, lang)}</span>
        <span aria-hidden="true">·</span>
        <span>{t(`pillars.${note.pillar}`)}</span>
        {note.fallback ? (
          <>
            <span aria-hidden="true">·</span>
            <span className="text-accent">{note.lang === "es" ? t("notes.onlyInEs") : t("notes.onlyInEn")}</span>
          </>
        ) : null}
      </div>
      <h3 className="mt-2 font-serif text-3xl tracking-tight">
        <Link to={langPath(lang, `/notas/${note.slug}`)} className="hover:text-accent">
          {note.title}
        </Link>
      </h3>
      <p className="mt-2 max-w-2xl text-muted">{note.summary}</p>
    </article>
  );
}
