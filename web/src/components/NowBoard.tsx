import { useI18n } from "../i18n/context";
import { formatDate } from "../lib/format";
import { useNow } from "../lib/now";
import { focusFor, MetricCard } from "./MetricCard";

export function NowBoard({ showIntro = false }: { showIntro?: boolean }) {
  const { lang, t } = useI18n();
  const state = useNow();

  return (
    <section>
      {showIntro ? (
        <header className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            {t("now.kicker")}
          </p>
          <h1 className="mt-3 font-serif text-5xl tracking-tight">{t("now.title")}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{t("now.intro")}</p>
        </header>
      ) : (
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-3xl tracking-tight">{t("sections.now")}</h2>
        </div>
      )}

      {state.status === "loading" ? (
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.16em] text-muted">
          {t("now.loading")}
        </p>
      ) : null}

      {state.status === "error" ? (
        <p className="mt-8 max-w-xl border border-line px-4 py-3 text-muted">{t("now.unavailable")}</p>
      ) : null}

      {state.status === "ready" ? (
        <>
          <p className={`font-mono text-[11px] uppercase tracking-[0.16em] text-muted ${showIntro ? "mt-8" : "mt-3"}`}>
            {t("now.updated")} {formatDate(state.data.updated, lang)}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {state.data.pillars.map((pillar) => (
              <MetricCard
                key={pillar.id}
                id={pillar.id}
                focus={focusFor(pillar.focus, lang)}
                metrics={pillar.metrics}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
