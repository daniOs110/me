import { Link } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import { useI18n } from "../i18n/context";
import { langPath } from "../lib/paths";

export function NotFoundPage() {
  const { lang, t } = useI18n();

  return (
    <div className="mx-auto max-w-5xl px-5 py-24">
      <PageTitle title={`${t("notFound.title")} · Daniel`} />
      <h1 className="font-serif text-5xl tracking-tight">{t("notFound.title")}</h1>
      <Link to={langPath(lang)} className="mt-6 inline-block text-accent">
        {t("notFound.back")}
      </Link>
    </div>
  );
}
