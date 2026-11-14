import { Link, useLocation } from "react-router-dom";
import { profile } from "../data/profile";
import { useI18n } from "../i18n/context";
import { langPath } from "../lib/paths";
import { LanguageSwitch } from "./LanguageSwitch";

const links = [
  { key: "nav.now", path: "/now" },
  { key: "nav.notes", path: "/notas" },
  { key: "nav.work", path: "/trabajo" },
  { key: "nav.contact", path: "/contacto" },
] as const;

export function Header() {
  const { lang, t } = useI18n();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4">
        <Link to={langPath(lang)} className="font-serif text-2xl leading-none tracking-tight">
          {profile.name}
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {links.map((item) => {
            const href = langPath(lang, item.path);
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={item.path}
                to={href}
                aria-current={active ? "page" : undefined}
                className={active ? "text-ink" : "text-muted hover:text-ink"}
              >
                {t(item.key)}
              </Link>
            );
          })}
          <LanguageSwitch />
        </nav>
      </div>
    </header>
  );
}
