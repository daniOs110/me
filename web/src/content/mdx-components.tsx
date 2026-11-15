import { useEffect, useId, useRef, useState } from "react";

export function Mermaid({ chart }: { chart: string }) {
  const host = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, "");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);

    (async () => {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "strict",
        fontFamily: "IBM Plex Sans, sans-serif",
      });
      const { svg } = await mermaid.render(`diagram-${reactId}`, chart);
      if (!cancelled && host.current) host.current.innerHTML = svg;
    })().catch(() => {
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (failed) {
    return <pre className="note-fallback">{chart}</pre>;
  }

  return <div ref={host} className="mermaid-wrap" aria-label="Diagram" />;
}

export const mdxComponents = {
  Mermaid,
};
