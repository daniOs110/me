import { profile } from "../data/profile";
import { useI18n } from "../i18n/context";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-4 px-5 py-10 text-sm text-muted">
        <div>
          <p className="font-serif text-xl text-ink">{profile.name}</p>
          <p className="mt-1">{t("footer.line")}</p>
        </div>
        <p className="font-mono text-xs tracking-[0.16em]">1%</p>
      </div>
    </footer>
  );
}
