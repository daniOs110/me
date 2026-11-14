import { useI18n } from "../i18n/context";

export function ServiceList() {
  const { dict, t } = useI18n();

  return (
    <section>
      <h2 className="font-serif text-3xl tracking-tight">{t("sections.services")}</h2>
      <p className="mt-3 max-w-2xl text-muted">{t("work.servicesIntro")}</p>
      <ol className="mt-8 divide-y divide-line border-y border-line">
        {dict.services.items.map((service, index) => (
          <li key={service.title} className="grid gap-2 py-5 md:grid-cols-[6rem_1fr]">
            <span className="font-mono text-xs text-muted">0{index + 1}</span>
            <div>
              <h3 className="text-lg">{service.title}</h3>
              <p className="mt-1 max-w-xl text-muted">{service.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
