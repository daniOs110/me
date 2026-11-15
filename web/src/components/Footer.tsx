import { Link } from "react-router-dom";
import { profile } from "../data/profile";
import { useI18n } from "../i18n/context";
import { langPath } from "../lib/paths";

export function Footer() {
  const { lang, t } = useI18n();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-4 px-5 py-10 text-sm text-muted">
        <div>
          <p className="font-serif text-xl text-ink">{profile.name}</p>
          <p className="mt-1">{t("footer.line")}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to={langPath(lang, "/admin")} className="font-mono text-[11px] uppercase tracking-[0.16em] hover:text-ink">
            {t("admin.footer")}
          </Link>
          <p className="font-mono text-xs tracking-[0.16em]">1%</p>
        </div>
      </div>
    </footer>
  );
}
