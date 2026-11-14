import type { Project } from "../content/schemas";
import { useI18n } from "../i18n/context";

export function ProjectCard({ project, detailed = false }: { project: Project; detailed?: boolean }) {
  const { t } = useI18n();

  return (
    <article className="border border-line p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-3">
        {project.sample ? (
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
            {t("work.sample")}
          </span>
        ) : null}
        <ul className="flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <li key={item} className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <h3 className="mt-4 font-serif text-3xl tracking-tight">{project.title}</h3>
      <p className="mt-3 max-w-2xl text-muted">{project.summary}</p>
      {detailed ? (
        <dl className="mt-6 grid gap-5 md:grid-cols-3">
          <Fact label={t("work.problem")} value={project.problem} />
          <Fact label={t("work.architecture")} value={project.architecture} />
          <Fact label={t("work.result")} value={project.result} />
        </dl>
      ) : null}
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">{label}</dt>
      <dd className="mt-2 text-sm leading-relaxed">{value}</dd>
    </div>
  );
}
