import { useSearchParams } from "react-router-dom";
import { NoteCard } from "../components/NoteCard";
import { PageTitle } from "../components/PageTitle";
import { getNotes } from "../content/load";
import { isPillar, pillars } from "../content/schemas";
import { useI18n } from "../i18n/context";

export function NotesPage() {
  const { lang, t } = useI18n();
  const [params, setParams] = useSearchParams();
  const requested = params.get("pilar");
  const pillar = isPillar(requested) ? requested : undefined;
  const notes = getNotes(lang, pillar);

  function select(next: string | null) {
    const updated = new URLSearchParams(params);
    if (next) updated.set("pilar", next);
    else updated.delete("pilar");
    setParams(updated);
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <PageTitle title={`${t("notes.title")} · Daniel`} />
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{t("notes.kicker")}</p>
      <h1 className="mt-3 font-serif text-5xl tracking-tight">{t("notes.title")}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{t("notes.intro")}</p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Filter active={!pillar} onClick={() => select(null)}>
          {t("notes.all")}
        </Filter>
        {pillars.map((item) => (
          <Filter key={item} active={pillar === item} onClick={() => select(item)}>
            {t(`pillars.${item}`)}
          </Filter>
        ))}
      </div>

      <div className="mt-6 border-t border-line">
        {notes.length === 0 ? <p className="py-8 text-muted">{t("notes.empty")}</p> : null}
        {notes.map((note) => (
          <NoteCard key={`${note.lang}-${note.slug}`} note={note} />
        ))}
      </div>
    </div>
  );
}

function Filter({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "bg-accent px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-ink"
          : "border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink"
      }
    >
      {children}
    </button>
  );
}
