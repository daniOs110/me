import { Navigate, Outlet, useParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { I18nProvider, isLang } from "../i18n/context";

export function LangLayout() {
  const { lang } = useParams();
  if (!isLang(lang)) return <Navigate to="/es" replace />;

  return (
    <I18nProvider lang={lang}>
      <div className="flex min-h-screen flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-ink"
        >
          {lang === "es" ? "Saltar al contenido" : "Skip to content"}
        </a>
        <Header />
        <main id="content" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
