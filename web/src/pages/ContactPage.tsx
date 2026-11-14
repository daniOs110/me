import { useState, type FormEvent } from "react";
import { PageTitle } from "../components/PageTitle";
import { profile } from "../data/profile";
import { useI18n } from "../i18n/context";

type Status = "idle" | "sending" | "sent" | "error" | "invalid";

export function ContactPage() {
  const { lang, t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const links = profile.links.filter((link) => link.href);
  const hasDirect = Boolean(profile.email) || links.length > 0;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !email || !message || !email.includes("@")) {
      setStatus("invalid");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, lang }),
      });
      if (response.status === 422) {
        setStatus("invalid");
        return;
      }
      if (!response.ok) {
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-[minmax(0,1fr)_16rem]">
      <PageTitle title={`${t("contact.title")} · Daniel`} />
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{t("contact.kicker")}</p>
        <h1 className="mt-3 font-serif text-5xl tracking-tight">{t("contact.title")}</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{t("contact.intro")}</p>
        <form onSubmit={onSubmit} className="mt-8 grid max-w-xl gap-4" noValidate>
          <Field label={t("contact.name")} name="name" autoComplete="name" />
          <Field label={t("contact.email")} name="email" type="email" autoComplete="email" />
          <label className="grid gap-2 text-sm">
            <span className="text-muted">{t("contact.message")}</span>
            <textarea
              name="message"
              required
              rows={6}
              className="border border-line bg-transparent px-3 py-2 text-ink outline-none focus:border-accent"
            />
          </label>
          <button
            type="submit"
            disabled={status === "sending"}
            className="justify-self-start bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink disabled:opacity-60"
          >
            {status === "sending" ? t("contact.sending") : t("contact.send")}
          </button>
          {status === "sent" ? <p className="text-sm text-accent">{t("contact.sent")}</p> : null}
          {status === "invalid" ? <p className="text-sm text-muted">{t("contact.invalid")}</p> : null}
          {status === "error" ? <p className="text-sm text-muted">{t("contact.error")}</p> : null}
        </form>
      </div>
      {hasDirect ? (
        <aside>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{t("contact.links")}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {profile.email ? (
              <li>
                <a className="hover:text-accent" href={`mailto:${profile.email}`}>
                  {t("links.email")}
                </a>
              </li>
            ) : null}
            {links.map((link) => (
              <li key={link.id}>
                <a className="hover:text-accent" href={link.href}>
                  {t(`links.${link.id}`)}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-muted">{label}</span>
      <input
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        className="border border-line bg-transparent px-3 py-2 text-ink outline-none focus:border-accent"
      />
    </label>
  );
}
