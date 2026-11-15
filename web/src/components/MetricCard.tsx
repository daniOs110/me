import { useI18n, type Lang } from "../i18n/context";
import { progressPercent } from "../lib/format";
import type { NowMetric } from "../lib/now";

export function MetricCard({
  id,
  focus,
  metrics,
  hours,
  completed,
  video,
}: {
  id: string;
  focus: string;
  metrics: NowMetric[];
  hours: number;
  completed: boolean;
  video: string;
}) {
  const { lang, t } = useI18n();
  const label = t(`pillars.${id}`);

  return (
    <article className="flex h-full flex-col border border-line bg-surface/70 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {label === `pillars.${id}` ? id : label}
        </p>
        {completed ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">{t("now.completed")}</p>
        ) : null}
      </div>
      <h3 className="mt-5 font-serif text-3xl leading-tight tracking-tight">{focus}</h3>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{t("now.focus")}</p>
      {video ? (
        <a href={video} className="mt-3 inline-block text-sm text-accent">
          {t("notes.video")}
        </a>
      ) : null}
      <dl className="mt-8 space-y-5">
        <div>
          <dt className="text-sm text-muted">{t("now.hours")}</dt>
          <dd className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-4xl tabular-nums tracking-tight">
              {new Intl.NumberFormat(lang).format(hours)}
            </span>
            <span className="font-mono text-sm text-muted">h</span>
          </dd>
        </div>
        {metrics.map((metric) => (
          <Metric key={metric.id} metric={metric} />
        ))}
      </dl>
    </article>
  );
}

function Metric({ metric }: { metric: NowMetric }) {
  const { lang, t } = useI18n();
  const label = t(`metrics.${metric.id}`);
  const percent = progressPercent(metric.value, metric.target);
  const number = new Intl.NumberFormat(lang).format(metric.value);

  return (
    <div>
      <dt className="text-sm text-muted">{label === `metrics.${metric.id}` ? metric.id : label}</dt>
      <dd className="mt-1 flex items-baseline gap-2">
        <span className="font-mono text-4xl tabular-nums tracking-tight">{number}</span>
        {metric.unit ? <span className="font-mono text-sm text-muted">{metric.unit}</span> : null}
        {metric.target != null ? (
          <span className="font-mono text-sm text-muted">
            / {new Intl.NumberFormat(lang).format(metric.target)}
          </span>
        ) : null}
      </dd>
      {percent != null ? (
        <div className="mt-3 h-px bg-line" role="presentation">
          <div className="h-px bg-accent" style={{ width: `${percent}%` }} />
        </div>
      ) : null}
    </div>
  );
}

export function focusFor(focus: { es: string; en: string }, lang: Lang) {
  return focus[lang];
}
