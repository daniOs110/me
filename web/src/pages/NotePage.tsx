import { Link, useParams } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import { getNote } from "../content/load";
import { useI18n } from "../i18n/context";
import { formatDate } from "../lib/format";
import { langPath } from "../lib/paths";
import { NotFoundPage } from "./NotFoundPage";

export function NotePage() {
  const { slug = "" } = useParams();
  const { lang, t } = useI18n();
  const note = getNote(lang, slug);

  if (!note) return <NotFoundPage />;

  const Body = note.Component;

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <PageTitle title={`${note.title} · Daniel`} />
      <Link
        to={langPath(lang, "/notas")}
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink"
      >
        ← {t("notes.back")}
      </Link>
      {note.fallback ? (
        <p className="mt-6 border border-line px-4 py-3 text-sm text-muted">
          {note.lang === "es" ? t("notes.onlyInEs") : t("notes.onlyInEn")}
        </p>
      ) : null}
      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        {formatDate(note.date, lang)} · {t(`pillars.${note.pillar}`)}
      </p>
      <h1 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight">{note.title}</h1>
      <p className="mt-4 text-lg text-muted">{note.summary}</p>
      {note.tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <li key={tag} className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
      {note.video ? (
        <a href={note.video} className="mt-4 inline-block text-sm text-accent">
          {t("notes.video")}
        </a>
      ) : null}
      <div className="note-body mt-10 border-t border-line pt-2">
        <Body />
      </div>
    </article>
  );
}
