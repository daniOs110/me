import { PageTitle } from "../components/PageTitle";
import { ProjectCard } from "../components/ProjectCard";
import { ServiceList } from "../components/ServiceList";
import { getProjects } from "../content/load";
import { useI18n } from "../i18n/context";

export function WorkPage() {
  const { lang, t } = useI18n();
  const projects = getProjects(lang);

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <PageTitle title={`${t("work.title")} · Daniel`} />
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{t("work.kicker")}</p>
      <h1 className="mt-3 max-w-3xl font-serif text-5xl tracking-tight">{t("work.title")}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{t("work.intro")}</p>
      <div className="mt-10 space-y-6">
        {projects.map((project) => (
          <div key={project.slug}>
            <ProjectCard project={project} detailed />
            <div className="note-body px-1">
              <project.Component />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16">
        <ServiceList />
      </div>
    </div>
  );
}
