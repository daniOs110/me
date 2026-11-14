import { NowBoard } from "../components/NowBoard";
import { PageTitle } from "../components/PageTitle";
import { useI18n } from "../i18n/context";

export function NowPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <PageTitle title={`${t("now.title")} · Daniel`} />
      <NowBoard showIntro />
    </div>
  );
}
