import { Link, useLocation } from "react-router-dom";
import { useI18n, type Lang } from "../i18n/context";
import { swapLang } from "../lib/paths";

const languages: Lang[] = ["es", "en"];

export function LanguageSwitch() {
  const { lang } = useI18n();
  const { pathname } = useLocation();

  return (
    <div className="flex items-center gap-2 font-mono text-xs tracking-[0.14em]">
      {languages.map((code) => {
        const active = code === lang;
        return (
          <Link
            key={code}
            to={swapLang(pathname, code)}
            hrefLang={code}
            aria-current={active ? "true" : undefined}
            className={active ? "text-accent" : "text-muted hover:text-ink"}
          >
            {code.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
