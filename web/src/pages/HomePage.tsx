import { Link } from "react-router-dom";
import { NoteCard } from "../components/NoteCard";
import { NowBoard } from "../components/NowBoard";
import { PageTitle } from "../components/PageTitle";
import { ProjectCard } from "../components/ProjectCard";
import { ServiceList } from "../components/ServiceList";
import { getNotes, getProjects } from "../content/load";
import { useI18n } from "../i18n/context";
import { langPath } from "../lib/paths";

export function HomePage() {
  const { lang, t } = useI18n();
  const notes = getNotes(lang).slice(0, 3);
  const projects = getProjects(lang).filter((project) => project.featured).slice(0, 2);

  return (
    <div className="mx-auto max-w-5xl px-5">
      <PageTitle title={t("meta.title")} />
      <section className="py-16 sm:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{t("hero.eyebrow")}</p>
        <h1 className="mt-5 max-w-3xl font-serif text-[2.7rem] leading-[1.02] tracking-tight sm:text-6xl">
          <span className="italic text-accent">{t("hero.titleLead")}</span>{" "}
          <span className="text-ink">{t("hero.titleRest")}</span>
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={langPath(lang, "/contacto")}
            className="bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink hover:bg-[#efb87a]"
          >
            {t("hero.ctaContact")}
          </Link>
          <Link
            to={langPath(lang, "/notas")}
            className="border border-line px-4 py-2.5 text-sm hover:border-ink"
          >
            {t("hero.ctaNotes")}
          </Link>
        </div>
      </section>

      <div className="border-t border-line py-16">
        <NowBoard />
        <Link
          to={langPath(lang, "/now")}
          className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink"
        >
          {t("nav.now")} →
        </Link>
      </div>

      <section className="border-t border-line py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl tracking-tight">{t("sections.notes")}</h2>
          <Link to={langPath(lang, "/notas")} className="text-sm text-muted hover:text-ink">
            {t("sections.allNotes")}
          </Link>
        </div>
        <div className="mt-4">
          {notes.map((note) => (
            <NoteCard key={note.slug} note={note} />
          ))}
        </div>
      </section>

      <section className="border-t border-line py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl tracking-tight">{t("sections.work")}</h2>
          <Link to={langPath(lang, "/trabajo")} className="text-sm text-muted hover:text-ink">
            {t("sections.allWork")}
          </Link>
        </div>
        <div className="mt-6 grid gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <div className="mt-16">
          <ServiceList />
        </div>
      </section>
    </div>
  );
}
