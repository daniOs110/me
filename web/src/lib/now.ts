import { useEffect, useState } from "react";
import { z } from "zod";

const metricSchema = z.object({
  id: z.string(),
  value: z.number(),
  unit: z.string().default(""),
  target: z.number().nullable().optional(),
});

const nowSchema = z.object({
  updated: z.string(),
  pillars: z.array(
    z.object({
      id: z.string(),
      focus: z.object({
        es: z.string(),
        en: z.string(),
      }),
      hours: z.number().default(0),
      completed: z.boolean().default(false),
      video: z.string().default(""),
      metrics: z.array(metricSchema),
    }),
  ),
});

export type NowSnapshot = z.infer<typeof nowSchema>;
export type NowMetric = z.infer<typeof metricSchema>;

export async function fetchNow(): Promise<NowSnapshot> {
  const response = await fetch("/api/now");
  if (!response.ok) throw new Error("now");
  return nowSchema.parse(await response.json());
}

type NowState =
  | { status: "loading" }
  | { status: "ready"; data: NowSnapshot }
  | { status: "error" };

export function useNow(): NowState {
  const [state, setState] = useState<NowState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchNow()
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
