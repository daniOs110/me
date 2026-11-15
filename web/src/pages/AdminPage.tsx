import { useEffect, useState, type FormEvent } from "react";
import { PageTitle } from "../components/PageTitle";
import { useI18n } from "../i18n/context";
import { fetchNow, type NowSnapshot } from "../lib/now";

const TOKEN_KEY = "daniel-admin-token";

type Phase = "login" | "loading" | "editor" | "load-error";
type Notice = "idle" | "saving" | "saved" | "error" | "invalid" | "denied" | "unconfigured";

export function AdminPage() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("login");
  const [notice, setNotice] = useState<Notice>("idle");
  const [draft, setDraft] = useState<NowSnapshot | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) return;
    let cancelled = false;
    setPhase("loading");
    fetch("/api/admin/session", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error("session");
        const data = await fetchNow();
        if (!cancelled) {
          setDraft(data);
          setPhase("editor");
        }
      })
      .catch(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        if (!cancelled) setPhase("login");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    setNotice("idle");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (response.status === 503) {
      setNotice("unconfigured");
      return;
    }
    if (!response.ok) {
      setNotice("denied");
      return;
    }
    const body = (await response.json()) as { token: string };
    sessionStorage.setItem(TOKEN_KEY, body.token);
    try {
      setDraft(await fetchNow());
      setPhase("editor");
      setNotice("idle");
    } catch {
      setPhase("load-error");
    }
  }

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      setPhase("login");
      return;
    }
    setNotice("saving");
    const response = await fetch("/api/admin/now", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(draft),
    });
    if (response.status === 401) {
      sessionStorage.removeItem(TOKEN_KEY);
      setPhase("login");
      setNotice("denied");
      return;
    }
    if (response.status === 422) {
      setNotice("invalid");
      return;
    }
    if (!response.ok) {
      setNotice("error");
      return;
    }
    setDraft((await response.json()) as NowSnapshot);
    setNotice("saved");
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setDraft(null);
    setNotice("idle");
    setPhase("login");
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <PageTitle title={`${t("admin.title")} · Daniel`} />
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{t("admin.kicker")}</p>
      <h1 className="mt-3 font-serif text-5xl tracking-tight">{t("admin.title")}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{t("admin.intro")}</p>

      {phase === "login" ? (
        <form onSubmit={onLogin} className="mt-8 grid max-w-sm gap-4">
          <label className="grid gap-2 text-sm">
            <span className="text-muted">{t("admin.password")}</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="border border-line bg-transparent px-3 py-2 text-ink outline-none focus:border-accent"
            />
          </label>
          <button type="submit" className="justify-self-start bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink">
            {t("admin.enter")}
          </button>
          <NoticeLine notice={notice} />
        </form>
      ) : null}

      {phase === "loading" ? <p className="mt-8 text-muted">{t("now.loading")}</p> : null}
      {phase === "load-error" ? <p className="mt-8 text-muted">{t("admin.loadError")}</p> : null}

      {phase === "editor" && draft ? (
        <form onSubmit={onSave} className="mt-10 space-y-8">
          {draft.pillars.map((pillar, index) => (
            <fieldset key={pillar.id} className="border border-line p-5">
              <legend className="px-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                {t(`pillars.${pillar.id}`)}
              </legend>
              <div className="grid gap-4">
                <Field
                  label={t("admin.titleEs")}
                  value={pillar.focus.es}
                  onChange={(value) => updateFocus(index, "es", value)}
                />
                <Field
                  label={t("admin.titleEn")}
                  value={pillar.focus.en}
                  onChange={(value) => updateFocus(index, "en", value)}
                />
                <Field
                  label={t("admin.hours")}
                  value={String(pillar.hours)}
                  inputMode="decimal"
                  onChange={(value) => updateHours(index, value)}
                />
                {pillar.metrics.map((metric, metricIndex) => (
                  <Field
                    key={metric.id}
                    label={metricLabel(t, metric.id)}
                    value={String(metric.value)}
                    inputMode="decimal"
                    onChange={(value) => updateMetric(index, metricIndex, value)}
                  />
                ))}
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={pillar.completed}
                    onChange={(event) => updatePillar(index, { completed: event.target.checked })}
                  />
                  {t("admin.completed")}
                </label>
                <Field
                  label={t("admin.video")}
                  value={pillar.video}
                  onChange={(value) => updatePillar(index, { video: value })}
                />
              </div>
            </fieldset>
          ))}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={notice === "saving"}
              className="bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink disabled:opacity-60"
            >
              {notice === "saving" ? t("admin.saving") : t("admin.save")}
            </button>
            <button type="button" onClick={logout} className="text-sm text-muted hover:text-ink">
              {t("admin.logout")}
            </button>
          </div>
          <NoticeLine notice={notice} />
        </form>
      ) : null}
    </div>
  );

  function updatePillar(index: number, patch: Partial<NowSnapshot["pillars"][number]>) {
    setDraft((current) => {
      if (!current) return current;
      const pillars = current.pillars.map((pillar, pillarIndex) =>
        pillarIndex === index ? { ...pillar, ...patch } : pillar,
      );
      return { ...current, pillars };
    });
  }

  function updateFocus(index: number, lang: "es" | "en", value: string) {
    setDraft((current) => {
      if (!current) return current;
      const pillars = current.pillars.map((pillar, pillarIndex) =>
        pillarIndex === index ? { ...pillar, focus: { ...pillar.focus, [lang]: value } } : pillar,
      );
      return { ...current, pillars };
    });
  }

  function updateHours(index: number, value: string) {
    const hours = Number(value);
    if (Number.isNaN(hours)) return;
    updatePillar(index, { hours });
  }

  function updateMetric(index: number, metricIndex: number, value: string) {
    const next = Number(value);
    if (Number.isNaN(next)) return;
    setDraft((current) => {
      if (!current) return current;
      const pillars = current.pillars.map((pillar, pillarIndex) => {
        if (pillarIndex !== index) return pillar;
        const metrics = pillar.metrics.map((metric, itemIndex) =>
          itemIndex === metricIndex ? { ...metric, value: next } : metric,
        );
        return { ...pillar, metrics };
      });
      return { ...current, pillars };
    });
  }
}

function metricLabel(t: (key: string) => string, id: string) {
  const key = `metrics.${id}`;
  const label = t(key);
  return label === key ? id : label;
}

function Field({
  label,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: "decimal" | "text";
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-muted">{label}</span>
      <input
        value={value}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        className="border border-line bg-transparent px-3 py-2 text-ink outline-none focus:border-accent"
      />
    </label>
  );
}

function NoticeLine({ notice }: { notice: Notice }) {
  const { t } = useI18n();
  if (notice === "idle" || notice === "saving") return null;
  const key =
    notice === "saved"
      ? "admin.saved"
      : notice === "invalid"
        ? "admin.invalid"
        : notice === "denied"
          ? "admin.denied"
          : notice === "unconfigured"
            ? "admin.unconfigured"
            : "admin.error";
  return <p className="text-sm text-muted">{t(key)}</p>;
}
