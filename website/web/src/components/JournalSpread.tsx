import React from "react";
import { motion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { LegendPayload } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  ReferenceArea,
  Legend,
  ReferenceLine,
} from "recharts";

import { PLOTS_BY_EVENT, type EventId } from "web/plots_website_timeline/plotRegistry";



type EventSlice = {
  raw: any[];
  z: any[];
  rawKeys: string[];
  zKeys: string[];
};

function isObject(x: any): x is Record<string, any> {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

function pickSeriesKeys(rows: any[], dateKey: string) {
  if (!rows?.length) return [];
  return Object.keys(rows[0]).filter((k) => k !== dateKey && k !== "event" && k !== "ts");
}

function eventSynthesis({
  eventId,
  highlight,
  corr,
  plots,
}: {
  eventId: EventId;
  highlight: { start: string; end: string };
  corr: { months: number; pearson: number; spearman: number; kendall: number };
  plots: any;
}) {
  // --- Top word (Fig 1) ---
  const top = maxBy(plots.topwords ?? [], (d: any) => Number(d.count));
  const topWord = top?.word ? `"${top.word}"` : "—";

  // --- Best lag (Figs 6–8) ---
  const bestLag = Number(
    plots.lag_report?.find((r: any) => r.metric === "best_lag_months")?.value
  );
  const bestCorr = Number(
    plots.lag_report?.find((r: any) => r.metric === "best_lag_corr")?.value
  );
  const pear0 = Number(
    plots.lag_report?.find((r: any) => r.metric === "pearson_0lag")?.value
  );

  const hasBest = Number.isFinite(bestLag) && Number.isFinite(bestCorr);
  const lagPhrase =
    !hasBest
      ? "Timing effects are modest in the lag sweep."
      : bestLag < 0
      ? `Best alignment appears when captions are shifted earlier (lag ${bestLag} months, r=${bestCorr.toFixed(
          2
        )}).`
      : bestLag > 0
      ? `Best alignment appears when captions are shifted later (lag +${bestLag} months, r=${bestCorr.toFixed(
          2
        )}).`
      : `Strongest alignment is synchronous (lag 0, r=${bestCorr.toFixed(2)}).`;

  const compare0 =
    Number.isFinite(pear0) && hasBest
      ? ` (At lag 0, r=${pear0.toFixed(2)}.)`
      : "";

  // --- Dominant semantic groups (Fig 10) ---
  const mg = plots.monthly_groups;
  const ts = mg?.timeseries ?? [];
  let groupA = "—";
  let groupB = "—";

  if (ts.length) {
    const keys = Object.keys(ts[0]).filter((k) => k.startsWith("group_"));
    const totals = keys
      .map((key) => ({
        key,
        total: ts.reduce((acc: number, row: any) => acc + (Number(row[key]) || 0), 0),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 2);

    const keyToTitle = (key: string) => {
      const idx = /^group_(\d+)$/.exec(key)?.[1];
      const id = idx ? Number(idx) : -1;
      const words: string[] =
        mg?.groups?.find((g: any) => Number(g.id) === id)?.words ?? [];
      const cleaned = words
        .map((w) => String(w).replaceAll("_", " "))
        .filter((w) => w.length >= 4);
      if (!cleaned.length) return `Group ${id + 1}`;
      const a = cleaned[0] ?? "Group";
      const b = cleaned[1] ?? "";
      return b ? `${a} / ${b}` : a;
    };

    groupA = totals[0] ? keyToTitle(totals[0].key) : "—";
    groupB = totals[1] ? keyToTitle(totals[1].key) : "—";
  }

  // --- Correlation statement (Figs 4–5) ---
  const r = corr.pearson;
  const abs = Math.abs(r);
  const strength =
    abs >= 0.7 ? "strong" : abs >= 0.4 ? "moderate" : abs >= 0.2 ? "weak" : "very weak";
  const sign =
    r > 0 ? "positive" : r < 0 ? "negative" : "near-zero";

  // --- Event-specific one-liner meaning (keep it conservative) ---
  const meaningByEvent: Record<EventId, string> = {
    covid:
      "Taken together, the statistics suggest that caption humor closely follows the public attention cycle during the pandemic. The moderate-to-strong positive correlation indicates that months with heightened search interest are also months when COVID-related humor becomes more prominent. The lag analysis helps refine this picture: when the strongest alignment occurs near zero lag, humor and attention peak together; when it shifts positive, humor appears more reactive, following major news waves. Finally, the dominant semantic groups show *how* this attention is translated into humor, revealing whether captions frame the pandemic through health concerns, daily-life disruptions, or institutional responses. Overall, the data suggests humor acts as a cultural mirror of collective attention rather than an independent signal.",
  
    war:
      "For war-related content, the weak correlations indicate that caption humor and public search interest do not consistently move together over time. This suggests that while search attention is often driven by sharp, news-triggered spikes, humor does not respond in a uniform or sustained way. The absence of a strong or stable best lag further implies that timing shifts do not systematically improve alignment. In this context, the semantic groups become especially important: they reveal that war-related humor may persist in specific narrative frames (political commentary, cynicism, everyday life) even when overall attention fluctuates. The story here is less about synchronization and more about fragmentation.",
  
    trump:
      "The statistics point to a weak-to-moderate coupling between political attention and caption humor during this period. This suggests that humor does respond to heightened political salience, but not in a perfectly synchronized way. The lag structure helps distinguish whether humor mainly reacts to major political events or occasionally anticipates them through meme cycles. Semantic groups further indicate whether captions emphasize institutions, personalities, or social consequences, showing that humor selectively amplifies certain aspects of political attention rather than reflecting it wholesale.",
  
    climate:
      "In the case of climate-related content, the near-zero correlations suggest that caption humor evolves largely independently from short-term search interest. Public attention spikes around specific environmental events or policy moments, but these do not translate directly into sustained humorous engagement. The lag analysis confirms that shifting the timing does not substantially strengthen the relationship. Here, the semantic groups are the key storytelling element: they show how climate humor is framed (environmental anxiety, everyday impacts, or abstraction), even when overall attention and humor are not tightly aligned. This points to climate humor functioning more as a background cultural theme than a reaction to immediate attention peaks.",
  };

  return (
    <div className="bg-white p-5 rounded-lg border-3 border-[#1A1A1A]" style={{ boxShadow: "4px 4px 0 #1A1A1A" }}>
      <div className="inline-block mb-3 px-3 py-1 bg-[#1A1A1A] border-2 border-[#1A1A1A]">
        <h3 className="comic-title text-xs text-[#FDFDF8]">Conclusion</h3>
      </div>

      <p className="comic-text text-[11px] leading-snug opacity-90">
        <b>Findings:</b> In the main event window (<span className="comic-title">{highlight.start} → {highlight.end}</span>),
        caption language is anchored by frequent terms like <span className="comic-title">{topWord}</span>, while dominant semantic themes
        cluster around <span className="comic-title">{groupA}</span> (and <span className="comic-title">{groupB}</span>).
      </p>

      <p className="comic-text text-[11px] leading-snug opacity-90 mt-2">
        <b>Conclusion:</b> Across the overlapping window ({corr.months} months), Trends vs caption mentions show a{" "}
        <b>{strength}</b> <b>{sign}</b> association (Pearson r={r.toFixed(2)}).
      </p>

      <p className="comic-text text-[11px] leading-snug opacity-90 mt-2">
        <b>Timing:</b> {lagPhrase}{compare0}
      </p>

      <p className="comic-text text-[11px] leading-snug opacity-90 mt-2">
        <b>What it means:</b> {meaningByEvent[eventId]}
      </p>
    </div>
  );
}


function SemanticLegend(props: any) {
  const payload = props?.payload ?? [];
  if (!payload.length) return null;

  return (
    <div
      className="bg-white rounded-lg border-2 border-[#1A1A1A] p-2"
      style={{ boxShadow: "2px 2px 0 #1A1A1A" }}
    >
      <div className="flex flex-col gap-1">
        {payload.map((item: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-6 h-[3px] rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="comic-text text-[10px] opacity-90">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


function normalizeZKey(key: string) {
  // supports "foo_z", "foo_zscore", or already "foo"
  if (key.endsWith("_z")) return key;
  if (key.endsWith("_zscore")) return key;
  return key;
}

function buildEventSlice(googleTrendsEvent: any): EventSlice | null {
  if (!googleTrendsEvent) return null;

  // ✅ Schema A (recommended): { raw: [...], z: [...] }
  if (
    isObject(googleTrendsEvent) &&
    Array.isArray(googleTrendsEvent.raw) &&
    Array.isArray(googleTrendsEvent.z)
  ) {
    const raw = googleTrendsEvent.raw.map((d: any) => ({
      ...d,
      ts: toTs(String(d.date)),
    }));
    const z = googleTrendsEvent.z.map((d: any) => ({
      ...d,
      ts: toTs(String(d.date)),
    }));

    const rawKeys = pickSeriesKeys(raw, "date");
    const zKeys = pickSeriesKeys(z, "date");

    return { raw, z, rawKeys, zKeys };
  }

  // ✅ Schema C (YOUR CURRENT EXPORT):
  // { raw_and_zscore_timeseries: [{date, type: "raw"|"zscore", ...}, ...] }
  if (
    isObject(googleTrendsEvent) &&
    Array.isArray(googleTrendsEvent.raw_and_zscore_timeseries)
  ) {
    const rows = googleTrendsEvent.raw_and_zscore_timeseries;

    const raw = rows
      .filter((d: any) => d?.type === "raw")
      .map((d: any) => ({ ...d, ts: toTs(String(d.date)) }));

    const z = rows
      .filter((d: any) => d?.type === "zscore")
      .map((d: any) => ({ ...d, ts: toTs(String(d.date)) }));

    const rawKeys = pickSeriesKeys(raw, "date").filter((k) => k !== "type");
    const zKeys = pickSeriesKeys(z, "date").filter((k) => k !== "type");

    // If one side is empty, still return the other (so at least raw shows)
    const usableRaw = raw.length ? raw : z;
    const usableZ = z.length ? z : raw;

    return {
      raw: usableRaw,
      z: usableZ,
      rawKeys: rawKeys.length ? rawKeys : zKeys,
      zKeys,
    };
  }

  // ✅ Schema B: array rows like [{date, series1, ...}, ...]
  if (Array.isArray(googleTrendsEvent)) {
    const rows = googleTrendsEvent.map((d: any) => ({
      ...d,
      ts: toTs(String(d.date)),
    }));
    const keys = pickSeriesKeys(rows, "date");

    const rawKeys = keys.filter((k) => !k.endsWith("_z") && !k.endsWith("_zscore"));
    const zKeys = keys.filter((k) => k.endsWith("_z") || k.endsWith("_zscore"));

    return { raw: rows, z: rows, rawKeys, zKeys };
  }

  return null;
}


function LegendSwatches({
  items,
}: {
  items: { label: string; color: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full border-2 border-[#1A1A1A]"
            style={{ backgroundColor: it.color }}
          />
          <span className="comic-text text-[10px]">{it.label}</span>
        </div>
      ))}
    </div>
  );
}


function MonthlyGroupsLegend({
  payload,
  monthlyGroups,
}: {
  payload?: ReadonlyArray<LegendPayload>;
  monthlyGroups: any;
}) {
  if (!payload?.length) return null;

  return (
    <div
      className="bg-white rounded-lg border-2 border-[#1A1A1A] p-2"
      style={{
        boxShadow: "2px 2px 0 #1A1A1A",
        width: 260,
        maxWidth: 260,
      }}
    >
      <div className="flex flex-col gap-2">
        {payload.map((item, i) => {
          const key = String(item.dataKey ?? "");
          const title = groupLegendTitle(monthlyGroups, key);
          const chips = groupLegendChips(monthlyGroups, key);

          return (
            <div key={i} className="flex items-start gap-2">
              <span
                className="inline-block w-7 h-[3px] rounded mt-[6px]"
                style={{ backgroundColor: item.color }}
              />
              <div className="min-w-0">
                <div className="comic-title text-[10px] leading-tight">
                  {title}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {chips.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-[1px] rounded-full border border-[#1A1A1A] text-[9px] comic-text opacity-80"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



function groupIdxFromKey(k: string) {
  const m = /^group_(\d+)$/.exec(k);
  return m ? Number(m[1]) : -1;
}

function groupLegendLabel(monthlyGroups: any, groupKey: string) {
  const idx = groupIdxFromKey(groupKey);
  const words: string[] =
    monthlyGroups?.groups?.find((g: any) => Number(g.id) === idx)?.words ?? [];

  if (!words.length) return groupKey;

  const head = words.slice(0, 4).join(", ");
  return head + (words.length > 4 ? "…" : "");
}

function inferThemeFromWords(words: string[]) {
  const w = words.map((x) => x.toLowerCase());

  const RULES: Array<{ title: string; keys: string[] }> = [
    { title: "Politics & institutions", keys: ["trump", "president", "vote", "election", "gop", "democrat", "republican", "white", "house", "congress", "senate", "government", "policy", "court", "judge"] },
    { title: "Climate & environment", keys: ["climate", "warming", "heat", "carbon", "co2", "emission", "pollution", "planet", "earth", "environment", "green", "wildfire", "storm", "flood", "hurricane"] },
    { title: "Health & disease", keys: ["covid", "virus", "pandemic", "vaccine", "mask", "quarantine", "hospital", "doctor", "testing", "symptom"] },
    { title: "War & conflict", keys: ["war", "invasion", "army", "soldier", "missile", "bomb", "nuclear", "ukraine", "russia", "israel", "gaza"] },
    { title: "Economy & work", keys: ["job", "work", "office", "boss", "salary", "rent", "inflation", "money", "market", "tax", "bills"] },
    { title: "Tech & internet", keys: ["ai", "robot", "twitter", "google", "facebook", "email", "online", "app", "phone", "iphone", "zoom"] },
    { title: "Home & relationships", keys: ["family", "wife", "husband", "kids", "child", "dating", "marriage", "love", "divorce", "home"] },
  ];

  // score each theme by overlap
  let best = { title: "Misc / everyday life", score: 0 };
  for (const r of RULES) {
    const score = r.keys.reduce((acc, k) => acc + (w.includes(k) ? 1 : 0), 0);
    if (score > best.score) best = { title: r.title, score };
  }

  // fallback if nothing matched: use the top word as a “theme”
  if (best.score === 0) return `Theme: ${words[0] ?? "Group"}`;

  return best.title;
}

function groupLegendTitle(monthlyGroups: any, groupKey: string) {
  const idx = groupIdxFromKey(groupKey);
  const words: string[] =
    monthlyGroups?.groups?.find((g: any) => Number(g.id) === idx)?.words ?? [];

  const theme = inferThemeFromWords(words);
  return theme;
}

function groupLegendChips(monthlyGroups: any, groupKey: string) {
  const idx = groupIdxFromKey(groupKey);
  const words: string[] =
    monthlyGroups?.groups?.find((g: any) => Number(g.id) === idx)?.words ?? [];
  return words.slice(0, 3); // keep short
}


// Optional: nicer short “theme” name (if you want)
function groupShortTitle(monthlyGroups: any, groupKey: string) {
  const idx = groupIdxFromKey(groupKey);
  const words: string[] =
    monthlyGroups?.groups?.find((g: any) => Number(g.id) === idx)?.words ?? [];
  return words.length ? words[0] : groupKey;
}

function lagValueStyle(metric: string, value: number | undefined) {
  if (!Number.isFinite(value)) return {};

  // Correlation metrics → diverging color
  if (
    metric === "pearson_0lag" ||
    metric === "spearman_0lag" ||
    metric === "kendall_0lag" ||
    metric === "best_lag_corr"
  ) {
    const v = Math.max(-1, Math.min(1, value as number));
    const alpha = 0.12 + 0.25 * Math.abs(v);

    return {
      background:
        v >= 0
          ? `rgba(230,57,70,${alpha})` // red
          : `rgba(69,123,157,${alpha})`, // blue
    };
  }

  // Best lag → neutral accent
  if (metric === "best_lag_months") {
    return {
      background: "rgba(141,91,76,0.15)", // warm brown accent
    };
  }

  return {};
}

const heatmapExplanation = (
  <>
    <p>
      This heatmap shows the <b>Pearson correlation</b> between <b>Google Trends (z)</b> and
      <b> caption mentions (z)</b> for different <b>time shifts (lags)</b>.
      Each row corresponds to one lag value.
    </p>

    <p>
      <b>How to read the colors:</b> the color encodes the correlation value <b>r</b>.
      <b> Red</b> means a positive correlation (they rise/fall together), <b>blue</b> means a negative correlation
      (one rises while the other falls), and <b>white</b> means near zero (little relationship).
      The colorbar on the right shows the scale.
    </p>

    <p>
      <b>How to read the lag axis:</b> <b>lag = 0</b> compares searches and captions in the same month.
      Negative lag tests whether captions align better when shifted earlier (humor may lead).
      Positive lag tests whether captions align better when shifted later (humor may lag).
      (Exact lead/lag interpretation depends on your lag convention, but the key idea is the best alignment occurs at the lag with the strongest color.)
    </p>

    <p>
      The <b>strongest alignment</b> is the row with the most intense color (largest <b>|r|</b>).
      If that row is near lag 0, the relationship is mostly synchronous.
      If it’s far from 0, there is evidence of a lead/lag structure.
    </p>
  </>
);

const lagReportExplanation = (
  <>
    <p>
      This panel summarizes the lag analysis in five key numbers, so you can compare events quickly
      without scanning the full stem plot (figure 6) or heatmap (figure 7).
    </p>

    <p>
      <b>pearson_0lag / spearman_0lag / kendall_0lag</b> measure association when Google Trends and captions are
      compared in the <b>same month</b>. Values near 0 mean little relationship; positive means they move together;
      negative means they move in opposite directions.
    </p>

    <p>
      <b>best_lag_months</b> is the lag where alignment is strongest in your lag sweep, and <b>best_lag_corr</b> is
      the correlation at that lag. If the best lag is far from 0, it suggests the relationship is stronger only after
      a time shift (lead/lag).
    </p>

    <p>
      Use this report together with figures 6–7: they show the full pattern across all lags, while figure 8 gives the
      headline values.
    </p>
  </>
);


function ExpandableExplanation({
  short,
  children,
}: {
  short: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mt-3">
      {/* Short explanation (always visible) */}
      <p className="comic-text text-[12px] opacity-90 leading-snug">
        {short}
      </p>

      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="comic-title text-[11px] mt-1 underline opacity-70 hover:opacity-100"
      >
        {open ? "Hide explanation" : "Read more"}
      </button>

      {/* Long explanation */}
      {open && (
        <div className="comic-text text-[12px] mt-2 opacity-90 leading-relaxed space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

function topKGroupsByTotal(ts: any[], k = 2) {
  if (!ts?.length) return [];
  const keys = Object.keys(ts[0]).filter((x) => x.startsWith("group_"));

  const totals = keys.map((key) => ({
    key,
    total: ts.reduce((acc, row) => acc + (Number(row[key]) || 0), 0),
  }));

  totals.sort((a, b) => b.total - a.total);
  return totals.slice(0, k).map((d) => d.key);
}

function groupTitle(monthlyGroups: any, groupKey: string) {
  const idx = groupIdxFromKey(groupKey);
  const label =
    monthlyGroups?.groups?.find((g: any) => Number(g.id) === idx)?.label;

  // If you have a "label" field in the JSON, use it. Otherwise fallback:
  return label || `Group ${idx + 1}`;
}


function lagInterpretationSentence({
  bestLag,
  bestCorr,
  zeroLag,
}: {
  bestLag: number | null;
  bestCorr: number | null;
  zeroLag: number | null;
}) {
  // Guard: if missing key values, return a fallback sentence
  if (
    !Number.isFinite(bestLag) ||
    !Number.isFinite(bestCorr)
  ) {
    return (
      <>
        In this event, correlations remain modest across time shifts,
        suggesting that humor and public attention are only weakly coupled.
      </>
    );
  }

  // At this point TS now knows:
  // bestLag and bestCorr are numbers
  const lag = bestLag as number;
  const corr = bestCorr as number;

  const direction =
    lag < 0
      ? "caption humor tends to anticipate peaks in public attention"
      : lag > 0
      ? "caption humor tends to follow peaks in public attention"
      : "caption humor and public attention peak at the same time";

  return (
    <>
      In this figure, the tallest stem appears at{" "}
      <b>lag {lag}</b> months (<b>r = {corr.toFixed(2)}</b>), meaning{" "}
      {direction}.
      {Number.isFinite(zeroLag) && (
        <>
          {" "}
          At zero lag, the correlation is lower (
          <b>r = {(zeroLag as number).toFixed(2)}</b>), showing that the
          strongest alignment only emerges once timing is shifted.
        </>
      )}
    </>
  );
}




function clamp(x: number, a: number, b: number) {
  return Math.max(a, Math.min(b, x));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToCss(r: number, g: number, b: number) {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// Diverging scale: blue -> white -> red, centered at 0
function divergingColor(value: number, maxAbs: number) {
  const v = clamp(value / (maxAbs || 1), -1, 1); // -1..1
  const blue = "#457B9D";
  const white = "#FDFDF8";
  const red = "#E63946";

  const c1 = v < 0 ? hexToRgb(blue) : hexToRgb(white);
  const c2 = v < 0 ? hexToRgb(white) : hexToRgb(red);

  const t = v < 0 ? (v + 1) : v; // [-1,0] -> [0,1] via v+1; [0,1] -> [0,1] via v
  const tt = v < 0 ? t : t;      // keep clear

  return rgbToCss(
    lerp(c1.r, c2.r, tt),
    lerp(c1.g, c2.g, tt),
    lerp(c1.b, c2.b, tt)
  );
}

function HeatmapColorbar({ maxAbs }: { maxAbs: number }) {
  // Simple vertical gradient + 3 ticks (-maxAbs, 0, +maxAbs)
  const top = maxAbs.toFixed(2);
  const mid = "0.00";
  const bot = (-maxAbs).toFixed(2);

  return (
    <div className="flex items-stretch gap-2">
      <div
        className="w-6 rounded border-2 border-[#1A1A1A]"
        style={{
          background:
            "linear-gradient(to top, rgb(69,123,157), #FDFDF8, rgb(230,57,70))",
        }}
      />
      <div className="flex flex-col justify-between py-1">
        <span className="comic-text text-[9px] opacity-80">{top}</span>
        <span className="comic-text text-[9px] opacity-80">{mid}</span>
        <span className="comic-text text-[9px] opacity-80">{bot}</span>
      </div>
    </div>
  );
}

function heatmapSentenceFromLagData(data: any[]) {
  if (!data?.length) return "No lag-correlation data available for this event.";

  const best = data.reduce(
    (acc, d) => {
      const r = Number(d.pearson_corr);
      const lag = Number(d.lag);
      const score = Math.abs(r);
      return score > acc.score ? { score, r, lag } : acc;
    },
    { score: -Infinity, r: 0, lag: 0 }
  );

  const lag = best.lag;
  const r = best.r;

  const direction =
    lag === 0
      ? "at the same month"
      : lag > 0
      ? `when shifting by +${lag} month(s)`
      : `when shifting by ${lag} month(s)`;

  // IMPORTANT: sign convention depends on how you computed lag correlation.
  // Keep it non-committal but still useful.
  const leadLagHint =
    lag === 0
      ? "This suggests the strongest alignment is synchronous."
      : "This suggests the strongest alignment happens with a time shift (lead/lag).";

  return `Peak |r| occurs ${direction} (Pearson r = ${r.toFixed(
    3
  )}). ${leadLagHint}`;
}

function StemDotShape(props: any) {
  const { x, y, width, height, fill, payload } = props;

  const vRaw =
    payload?.pearson_corr ??
    payload?.value ??
    props?.value;

  const v = Number(vRaw);

  // Center of the bar "slot"
  const cx = x + width / 2;

  // In Recharts Bar, (x,y,width,height) already encodes baseline direction.
  // For positive bars: y is top, baseline is y+height.
  // For negative bars: y is baseline, tip is y+height.
  const yBase = v >= 0 ? y + height : y;
  const yTip = v >= 0 ? y : y + height;

  return (
    <g>
      {/* stem */}
      <line
        x1={cx}
        x2={cx}
        y1={yBase}
        y2={yTip}
        stroke={fill}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* dot */}
      <circle
        cx={cx}
        cy={yTip}
        r={7}
        fill={fill}
        stroke="#1A1A1A"
        strokeWidth={2}
      />
    </g>
  );
}


interface TimelineEvent {
  id: EventId;
  date: string;
  year: number;
  position: number;
  cluster: string;
  keywords: string[];
  cartoonTheme: string;
  color: string;
  worldEvents: string[];
}

interface JournalSpreadProps {
  event: TimelineEvent;
  onClose: () => void;
}

function formatMonthLabel(isoOrMonth: string) {
  return isoOrMonth.slice(0, 7);
}

function HeatRow({ label, value }: { label: string; value: number }) {
  const clamped = Math.max(-1, Math.min(1, value));

  const alpha = 0.15 + 0.65 * Math.abs(clamped);
  const bg =
    value >= 0 ? `rgba(230,57,70,${alpha})` : `rgba(69,123,157,${alpha})`;

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 text-[10px] comic-text opacity-80">{label}</div>
      <div
        className="flex-1 h-4 rounded border-2 border-[#1A1A1A]"
        style={{ background: bg }}
      />
      <div className="w-16 text-right text-[10px] comic-text">
        {value.toFixed(2)}
      </div>
    </div>
  );
}

function maxBy<T>(arr: T[], get: (x: T) => number) {
  let best: T | null = null;
  let bestV = -Infinity;
  for (const x of arr) {
    const v = get(x);
    if (Number.isFinite(v) && v > bestV) {
      bestV = v;
      best = x;
    }
  }
  return best;
}

function toTs(dateStr: string) {
  // dateStr can be "YYYY-MM-DD" or ISO. This makes it consistent.
  return new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`).getTime();
}

const lagExplanation = (
  <>
    <p>
      This plot measures how closely <b>Google search interest</b> and
      <b> caption mentions</b> move together when one of them is shifted
      forward or backward in time.
    </p>

    <p>
      The horizontal axis shows the <b>lag in months</b>. A lag of <b>0</b>
      means searches and captions are compared in the same month.
      Negative lags mean captions are shifted earlier in time, testing
      whether humor anticipates public interest. Positive lags mean captions
      are shifted later, testing whether humor reacts after attention peaks.
    </p>

    <p>
      The vertical axis shows the <b>Pearson correlation coefficient</b>,
      which measures how strongly the two series align. Values close to 1
      indicate strong alignment, values near 0 indicate little relationship.
    </p>

    <p>
      Each vertical stem corresponds to one lag value, and the dot at the end
      shows the correlation strength. The dashed vertical line marks zero lag,
      and the horizontal line marks zero correlation.
    </p>

    <p>
      The tallest stem identifies the time shift where the alignment between
      public attention and humor is strongest. This tells us whether humor
      tends to anticipate public attention, follow it with delay, or move in
      synchrony.
    </p>
  </>
);

export function JournalSpread({ event, onClose }: JournalSpreadProps) {
  const plots = PLOTS_BY_EVENT[event.id];

  const CORR: Record<
    EventId,
    { months: number; pearson: number; spearman: number; kendall: number }
  > = {
    covid: { months: 91, pearson: 0.583, spearman: 0.683, kendall: 0.542 },
    war: { months: 91, pearson: -0.123, spearman: -0.068, kendall: -0.045 },
    trump: { months: 91, pearson: 0.291, spearman: 0.371, kendall: 0.265 },
    climate: { months: 91, pearson: -0.068, spearman: 0.005, kendall: 0.008 },
  };

  const corr = CORR[event.id];

  function corrSentence(r: number) {
    const abs = Math.abs(r);
    const dir = r > 0 ? "positive" : r < 0 ? "negative" : "near-zero";
    const strength =
      abs >= 0.7 ? "strong" : abs >= 0.4 ? "moderate" : abs >= 0.2 ? "weak" : "very weak";
    if (dir === "near-zero") return "Overall, there is essentially no linear association.";
    return `Overall, there is a ${strength} ${dir} association: when Google searches increase, caption mentions tend to ${
      r > 0 ? "increase" : "decrease"
    } as well.`;
  }


  // ✅ highlight windows (your exact periods)
  const HIGHLIGHT: Record<EventId, { start: string; end: string }> = {
    covid: { start: "2020-03-01", end: "2021-12-31" },
    war: { start: "2022-02-01", end: "2023-09-30" },
    trump: { start: "2016-06-01", end: "2016-11-30" },
    climate: { start: "2019-09-01", end: "2019-12-31" },
  };

  const highlight = HIGHLIGHT[event.id];
  const highlightStartTs = highlight ? toTs(highlight.start) : null;
  const highlightEndTs = highlight ? toTs(highlight.end) : null;

  // ----- Monthly groups keys -----
  const groupKeys =
    plots.monthly_groups?.timeseries?.length
      ? Object.keys(plots.monthly_groups.timeseries[0]).filter((k) =>
          k.startsWith("group_")
        )
      : [];

  // ----- Google Trends US column name -----
  const googleUsKey =
    plots.google_trends_us?.length
      ? Object.keys(plots.google_trends_us[0]).find((k) => k !== "date") ?? "value"
      : "value";

  // ✅ Make z-series use a real time axis (ts), so ReferenceArea aligns perfectly
  const googleTrendsZ = (plots.google_trends_z ?? []).map((d: any) => ({
    ...d,
    ts: toTs(String(d.date)),
  }));



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-sm flex items-center justify-center p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-[#FDFDF8] rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#E63946] text-[#FDFDF8] rounded-full flex items-center justify-center hover:bg-[#d32f3d] transition-colors border-[3px] border-[#1A1A1A]"
          style={{ boxShadow: "3px 3px 0 #1A1A1A" }}
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-5 h-full max-h-[90vh] overflow-y-auto">
          {/* LEFT PAGE */}
          <div className="md:col-span-2 p-12 border-r border-[#1A1A1A]/10 bg-[#FDFDF8]">
            {/* Date Header */}
            <div className="mb-8">
              <p className="text-sm text-[#1A1A1A]/60 mb-2">{event.year}</p>
              <h2 className="mb-2">{event.date}</h2>
              <div
                className="inline-block px-4 py-2 rounded-full text-[#FDFDF8] text-sm border-2 border-[#1A1A1A]"
                style={{
                  backgroundColor: event.color,
                  boxShadow: "3px 3px 0 #1A1A1A",
                }}
              >
                {event.cluster}
              </div>
            </div>

            {/* Cartoon placeholder */}
            <div
              className="mb-8 bg-white rounded-lg p-8 border-4 border-[#1A1A1A] aspect-square flex items-center justify-center"
              style={{ boxShadow: "4px 4px 0 #1A1A1A" }}
            >
              <div className="text-center">
                <p className="handwritten text-xl text-[#8B4513] italic">
                  {event.cartoonTheme}
                </p>

              </div>
            </div>

            {/* Historical Context */}
            <div
              className="bg-white p-6 rounded-lg border-3 border-[#1A1A1A]"
              style={{ boxShadow: "4px 4px 0 #1A1A1A" }}
            >
              <div className="inline-block mb-3 px-3 py-1 bg-[#E63946] border-2 border-[#1A1A1A]">
                <h3 className="comic-title text-xs text-[#FDFDF8]">
                  Historical Context
                </h3>
              </div>
              <ul className="space-y-3">
                {event.worldEvents.map((evt, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0 border-2 border-[#1A1A1A]"
                      style={{ backgroundColor: event.color }}
                    />
                    <span className="comic-text text-xs">{evt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT PAGE */}
          <div className="md:col-span-3 p-12 bg-white">
            <div className="space-y-6">
              <div>
                <div className="inline-block mb-3 px-4 py-1 bg-[#457B9D] border-2 border-[#1A1A1A]">
                  <h3 className="comic-title text-xs text-[#FDFDF8]">
                    Data Story
                  </h3>
                </div>


                <div className="grid md:grid-cols-2 gap-5">
                  {/* 1) Topwords */}
                  <div className="bg-[#FDFDF8] p-4 rounded-lg border-2 border-[#1A1A1A]">
                    <h4 className="comic-title text-xs mb-2">1) Top words</h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={plots.topwords}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A20" />
                        <XAxis
                          dataKey="word"
                          tick={{ fill: "#1A1A1A", fontSize: 10 }}
                          label={{
                            value: "Words",
                            position: "insideBottom",
                            offset: -5,
                            style: { fontSize: 10 },
                          }}
                        />
                        <YAxis
                          tick={{ fill: "#1A1A1A", fontSize: 10 }}
                          label={{
                            value: "Caption frequency",
                            angle: -90,
                            position: "insideLeft",
                            style: { fontSize: 10 },
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FDFDF8",
                            border: "2px solid #1A1A1A",
                            borderRadius: "8px",
                            fontSize: "11px",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill={event.color}
                          radius={[6, 6, 0, 0]}
                          stroke="#1A1A1A"
                          strokeWidth={2}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    {(() => {
                      const top = maxBy(plots.topwords ?? [], (d: any) => Number(d.count));
                      return (
                        <>
                          <p className="comic-text text-[10px] mt-2 opacity-80 leading-snug">
                            The most frequent words summarize the dominant caption language. The top word here is{" "}
                            <span className="comic-title">"{top?.word ?? "—"}"</span>.
                          </p>
                          <p className="comic-text text-[9px] mt-2 opacity-60 leading-snug">
                            <b>Data source:</b> Word frequencies extracted from cartoon captions related to this event, analyzing the most commonly used terms in image descriptions, locations, uncanny descriptions, and caption questions.
                          </p>
                        </>
                      );
                    })()}
                  </div>

                  {/* 2) Google Trends US */}
                  <div className="bg-[#FDFDF8] p-4 rounded-lg border-2 border-[#1A1A1A]">
                    <h4 className="comic-title text-xs mb-2">
                      2) Google Trends (US 2016–2023)
                    </h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={plots.google_trends_us}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A20" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatMonthLabel}
                          tick={{ fontSize: 10 }}
                          label={{
                            value: "Month",
                            position: "insideBottom",
                            offset: -5,
                            style: { fontSize: 10 },
                          }}
                        />
                        <YAxis
                          tick={{ fontSize: 10 }}
                          label={{
                            value: "Search interest (0–100)",
                            angle: -90,
                            position: "insideLeft",
                            style: { fontSize: 10 },
                          }}
                        />
                        <Tooltip labelFormatter={(d) => formatMonthLabel(String(d))} />
                        <Line
                          type="monotone"
                          dataKey={googleUsKey}
                          stroke={event.color}
                          strokeWidth={3}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <p className="comic-text text-[10px] mt-2 opacity-80 leading-snug">
                      Time series of Google search interest in the United States from 2016 to 2023, showing fluctuations in public attention over time.
                    </p>
                    <p className="comic-text text-[9px] mt-2 opacity-60 leading-snug">
                      <b>Data source:</b> Monthly Google search interest data for US queries related to this event (scale 0–100), covering the period from 2016 to 2023.
                    </p>
                  </div>

                  {/* 3) Google Trends (z-score) ✅ highlighted main period */}
                  <div className="bg-[#FDFDF8] p-4 rounded-lg border-2 border-[#1A1A1A]">
                    <h4 className="comic-title text-xs mb-2">3) Google Trends (z-score)</h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={googleTrendsZ}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A20" />

                        {/* ✅ time axis so highlight aligns */}
                        <XAxis
                          dataKey="ts"
                          type="number"
                          scale="time"
                          domain={["dataMin", "dataMax"]}
                          tick={{ fontSize: 10 }}
                          tickFormatter={(ts) => formatMonthLabel(new Date(Number(ts)).toISOString())}
                          label={{
                            value: "Month",
                            position: "insideBottom",
                            offset: -5,
                            style: { fontSize: 10 },
                          }}
                        />

                        <YAxis
                          tick={{ fontSize: 10 }}
                          label={{
                            value: "z-score",
                            angle: -90,
                            position: "insideLeft",
                            style: { fontSize: 10 },
                          }}
                        />

                        <Tooltip
                          labelFormatter={(ts) =>
                            formatMonthLabel(new Date(Number(ts)).toISOString())
                          }
                        />

                        {/* ✅ shaded highlight window */}
                        {highlightStartTs != null && highlightEndTs != null && (
                          <ReferenceArea
                            x1={highlightStartTs}
                            x2={highlightEndTs}
                            strokeOpacity={0}
                            fill="rgba(230,57,70,0.18)"
                          />
                        )}

                        <Line
                          type="monotone"
                          dataKey="zscore"
                          stroke={event.color}
                          strokeWidth={3}
                          dot={false}
                          name={event.id}
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    <p className="comic-text text-[10px] mt-2 opacity-80 leading-snug">
                      Z-scores show unusual attention relative to the topic baseline. The shaded region is the main period of the event:{" "}
                      <span className="comic-title">
                        {highlight.start} → {highlight.end}
                      </span>
                      .
                    </p>
                    <p className="comic-text text-[9px] mt-2 opacity-60 leading-snug">
                      <b>Data source:</b> Normalized Google search interest data, standardized to show statistical deviations from the long-term baseline, making it easier to identify unusual spikes in public attention.
                    </p>
                  </div>

                  {/* 4) Trends vs captions (raw union) */}
                  <div className="bg-[#FDFDF8] p-4 rounded-lg border-2 border-[#1A1A1A]">
                    <h4 className="comic-title text-xs mb-2">4) Google Trends vs captions (raw)</h4>

                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={plots.trendsVsCaptions_union ?? []} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A20" />

                        <XAxis
                          dataKey="date"
                          tickFormatter={formatMonthLabel}
                          tick={{ fontSize: 10, fill: "#1A1A1A" }}
                          label={{ value: "Month", position: "insideBottom", offset: -6, style: { fontSize: 10 } }}
                        />

                        <YAxis
                          tick={{ fontSize: 10, fill: "#1A1A1A" }}
                          label={{
                            value: "Counts / index",
                            angle: -90,
                            position: "insideLeft",
                            style: { fontSize: 10 },
                          }}
                        />

                        <Tooltip
                          labelFormatter={(d) => formatMonthLabel(String(d))}
                          contentStyle={{
                            backgroundColor: "#FDFDF8",
                            border: "2px solid #1A1A1A",
                            borderRadius: "8px",
                            fontSize: "11px",
                          }}
                        />

                        {/* ✅ Colored legend */}
                        <Legend verticalAlign="bottom" height={26} />

                        <Line
                          type="monotone"
                          dataKey="google_trends"
                          stroke="#E63946"
                          strokeWidth={3}
                          dot={false}
                          name="Google Trends"
                        />
                        <Line
                          type="monotone"
                          dataKey="captions"
                          stroke="#457B9D"
                          strokeWidth={3}
                          dot={false}
                          name="Caption mentions"
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    <p className="comic-text text-[10px] mt-2 opacity-80 leading-snug">
                      Correlation over the overlapping window (<span className="comic-title">{corr.months}</span> months):
                      <span className="comic-title"> Pearson {corr.pearson.toFixed(3)}</span>,
                      <span className="comic-title"> Spearman {corr.spearman.toFixed(3)}</span>,
                      <span className="comic-title"> Kendall τ {corr.kendall.toFixed(3)}</span>.{" "}
                      {corrSentence(corr.pearson)}
                    </p>
                    <p className="comic-text text-[9px] mt-2 opacity-60 leading-snug">
                      <b>Data sources:</b> Monthly Google search interest for event-related queries, paired with the frequency of event mentions in New Yorker cartoon captions, aligned by month for direct comparison.
                    </p>

                  </div>



                  {/* 5) Trends vs captions (z-score) */}
                  <div className="bg-[#FDFDF8] p-4 rounded-lg border-2 border-[#1A1A1A]">
                    <h4 className="comic-title text-xs mb-2">5) Google Trends vs captions (z-score)</h4>

                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={plots.trendsVsCaptions_z ?? []} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A20" />

                        <XAxis
                          dataKey="date"
                          tickFormatter={formatMonthLabel}
                          tick={{ fontSize: 10, fill: "#1A1A1A" }}
                          label={{ value: "Month", position: "insideBottom", offset: -6, style: { fontSize: 10 } }}
                        />

                        <YAxis
                          tick={{ fontSize: 10, fill: "#1A1A1A" }}
                          label={{
                            value: "z-score",
                            angle: -90,
                            position: "insideLeft",
                            style: { fontSize: 10 },
                          }}
                        />

                        <Tooltip
                          labelFormatter={(d) => formatMonthLabel(String(d))}
                          contentStyle={{
                            backgroundColor: "#FDFDF8",
                            border: "2px solid #1A1A1A",
                            borderRadius: "8px",
                            fontSize: "11px",
                          }}
                        />

                        {/* ✅ Colored legend */}
                        <Legend verticalAlign="bottom" height={26} />

                        <Line
                          type="monotone"
                          dataKey="google_trends_z"
                          stroke="#E63946"
                          strokeWidth={3}
                          dot={false}
                          name="Google Trends (z)"
                        />
                        <Line
                          type="monotone"
                          dataKey="captions_z"
                          stroke="#457B9D"
                          strokeWidth={3}
                          dot={false}
                          name="Caption mentions (z)"
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    <p className="comic-text text-[10px] mt-2 opacity-80 leading-snug">
                      Correlation over the overlapping window (<span className="comic-title">{corr.months}</span> months):
                      <span className="comic-title"> Pearson {corr.pearson.toFixed(3)}</span>,
                      <span className="comic-title"> Spearman {corr.spearman.toFixed(3)}</span>,
                      <span className="comic-title"> Kendall τ {corr.kendall.toFixed(3)}</span>.{" "}
                      {(() => {
                        const r = corr.pearson;
                        const abs = Math.abs(r);

                        const strength =
                          abs >= 0.7 ? "strong" : abs >= 0.4 ? "moderate" : abs >= 0.2 ? "weak" : "very weak";

                        if (abs < 0.1) {
                          return (
                            <>In z-scores, the two series show little month-to-month alignment (near-zero association).</>
                          );
                        }

                        if (r > 0) {
                          return (
                            <>
                              In this standardized view, there is a {strength} <b>positive</b> association: months with unusually high search
                              interest tend to coincide with unusually high caption focus (and unusually low with unusually low).
                            </>
                          );
                        }

                        return (
                          <>
                            In this standardized view, there is a {strength} <b>negative</b> association: months with unusually high search
                            interest tend to coincide with unusually low caption focus (and vice versa).
                          </>
                        );
                      })()}
                    </p>
                    <p className="comic-text text-[9px] mt-2 opacity-60 leading-snug">
                      <b>Data sources:</b> Standardized (z-scored) Google search interest and caption mention frequencies, both normalized to show statistical deviations from their respective baselines for comparable analysis.
                    </p>


                  </div>

                  {/* 6) Lag correlation (stem) */}
                  <div className="bg-[#FDFDF8] p-4 rounded-lg border-2 border-[#1A1A1A]">
                    <h4 className="comic-title text-xs mb-2">6) Lag correlation (stem)</h4>

                    {(() => {
                      const bestLag = Number(
                        plots.lag_report?.find((r: any) => r.metric === "best_lag_months")?.value
                      );
                      const bestCorr = Number(
                        plots.lag_report?.find((r: any) => r.metric === "best_lag_corr")?.value
                      );
                      const zeroLag = Number(
                        plots.lag_report?.find((r: any) => r.metric === "pearson_0lag")?.value
                      );

                      const hasBest = Number.isFinite(bestLag) && Number.isFinite(bestCorr);
                      const hasZero = Number.isFinite(zeroLag);

                      const direction =
                        Number.isFinite(bestLag) && bestLag < 0
                          ? "captions lead search interest"
                          : Number.isFinite(bestLag) && bestLag > 0
                          ? "captions lag behind search interest"
                          : "both series move together (no shift)";

                      return (
                        <>
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={plots.lag_stem ?? []} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A20" />

                              {/* axes */}
                              <XAxis
                                dataKey="lag"
                                tick={{ fontSize: 10, fill: "#1A1A1A" }}
                                label={{ value: "Lag (months)", position: "insideBottom", offset: -6, style: { fontSize: 10 } }}
                              />
                              <YAxis
                                domain={[-1, 1]}
                                tick={{ fontSize: 10, fill: "#1A1A1A" }}
                                label={{
                                  value: "Pearson correlation (r)",
                                  angle: -90,
                                  position: "insideLeft",
                                  style: { fontSize: 10 },
                                }}
                              />

                              {/* zero lines like your screenshot */}
                              <ReferenceLine y={0} stroke="#1A1A1A" strokeWidth={2} />
                              <ReferenceLine x={0} stroke="#1A1A1A" strokeDasharray="6 6" strokeWidth={2} />

                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#FDFDF8",
                                  border: "2px solid #1A1A1A",
                                  borderRadius: "8px",
                                  fontSize: "11px",
                                }}
                                formatter={(val: any) => [Number(val).toFixed(3), "r"]}
                              />

                              {/* stems + dots */}
                              <Bar
                                dataKey="pearson_corr"
                                fill={event.color}
                                shape={<StemDotShape />}
                                // keep bars "thin slots" so stems look nice
                                barSize={18}
                              />
                            </BarChart>
                          </ResponsiveContainer>

                          <ExpandableExplanation
                            short={
                              <>
                                <b>What this shows:</b> how humor timing aligns with public attention
                                by shifting caption mentions earlier or later in time.
                              </>
                            }
                          >
                            {/* 🔴 Event-specific link to the figure */}
                            <p>
                              {lagInterpretationSentence({
                                bestLag,
                                bestCorr,
                                zeroLag,
                              })}
                            </p>

                            {/* 🔵 General explanation */}
                            {lagExplanation}
                            
                            <p className="comic-text text-[9px] mt-3 opacity-60 leading-snug">
                              <b>Data source:</b> Lag correlation analysis computed by time-shifting standardized caption mentions against standardized Google search trends across lags from -12 to +12 months, measuring temporal alignment patterns.
                            </p>
                          </ExpandableExplanation>


                        </>
                      );
                    })()}
                  </div>


                  {/* 7) Lag corr heatmap (robust grid + inline sizes) */}
                  <div className="bg-[#FDFDF8] p-4 rounded-lg border-2 border-[#1A1A1A]">
                    <h4 className="comic-title text-xs mb-2">7) Lag correlation (heatmap)</h4>

                    {(() => {
                      const raw = (plots.lag_heatmap ?? []).map((d: any) => ({
                        lag: Number(d.lag),
                        r: Number(d.pearson_corr),
                      }));

                      if (!raw.length) {
                        return (
                          <p className="comic-text text-[10px] opacity-80">
                            No lag-correlation data available for this event.
                          </p>
                        );
                      }

                      // Sort so it displays like your example: +12 at top → -12 at bottom
                      const data = [...raw].sort((a, b) => b.lag - a.lag);

                      // Symmetric range so blue/white/red is comparable
                      const maxAbs = Math.max(...data.map((d) => Math.abs(d.r)), 1e-6);

                      // Pick the best |r| lag for the explanation sentence
                      const best = data.reduce<{ abs: number; lag: number; r: number }>(
                        (acc, d) => {
                          const a = Math.abs(d.r);
                          return a > acc.abs ? { abs: a, lag: d.lag, r: d.r } : acc;
                        },
                        { abs: -Infinity, lag: 0, r: 0 }
                      );


                      const dir =
                        best.lag === 0 ? "at the same month"
                        : best.lag > 0 ? `at +${best.lag} months`
                        : `at ${best.lag} months`;

                      // --- layout constants (inline, so it WILL render) ---
                      const cellH = 14;     // px
                      const cellW = 220;    // px (heat column width)
                      const labelW = 26;    // px (lag number column)
                      const barW = 16;      // px (colorbar)
                      const barH = cellH * data.length; // matches heatmap height

                      return (
                        <>
                          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                            {/* Left: labels + heat column */}
                            <div style={{ display: "flex", gap: 8 }}>
                              {/* Lag labels */}
                              <div style={{ width: labelW }}>
                                <div style={{ height: 16 }} />
                                {data.map((d) => (
                                  <div
                                    key={d.lag}
                                    style={{
                                      height: cellH,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                      fontSize: 10,
                                      opacity: 0.85,
                                      fontFamily: "inherit",
                                    }}
                                    className="comic-text"
                                  >
                                    {d.lag}
                                  </div>
                                ))}
                                <div style={{ marginTop: 6, fontSize: 9, opacity: 0.7 }} className="comic-text">
                                  Lag
                                </div>
                              </div>

                              {/* Heat column */}
                              <div>
                                <div style={{ height: 16, fontSize: 9, opacity: 0.7 }} className="comic-text">
                                  Pearson r (z-scored)
                                </div>

                                <div
                                  style={{
                                    width: cellW,
                                    display: "grid",
                                    gridTemplateRows: `repeat(${data.length}, ${cellH}px)`,
                                    border: "2px solid #1A1A1A",
                                  }}
                                >
                                  {data.map((d) => (
                                    <div
                                      key={d.lag}
                                      title={`lag=${d.lag}, r=${d.r.toFixed(3)}`}
                                      style={{
                                        background: divergingColor(d.r, maxAbs),
                                        borderTop: "1px solid rgba(26,26,26,0.25)",
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Right: colorbar */}
                            <div style={{ paddingTop: 16 }}>
                              <div
                                style={{
                                  width: barW,
                                  height: barH,
                                  border: "2px solid #1A1A1A",
                                  borderRadius: 6,
                                  background:
                                    "linear-gradient(to top, rgb(230,57,70), #FDFDF8, rgb(69,123,157))",
                                }}
                              />
                              <div style={{ marginTop: 6, fontSize: 9, opacity: 0.8 }} className="comic-text">
                                {maxAbs.toFixed(2)}&nbsp;&nbsp;0.00&nbsp;&nbsp;{-maxAbs.toFixed(2)}
                              </div>
                            </div>
                          </div>

                          <ExpandableExplanation
                            short={
                              <>
                                <b>What this shows:</b> correlation strength (color) between Google Trends (z) and caption mentions (z)
                                across different lags. Strongest alignment is{" "}
                                <span className="comic-title">{dir}</span> (r ={" "}
                                <span className="comic-title">{best.r.toFixed(3)}</span>).
                              </>
                            }
                          >
                            {heatmapExplanation}
                            
                            <p className="comic-text text-[9px] mt-3 opacity-60 leading-snug">
                              <b>Data source:</b> Pearson correlation coefficients computed between standardized Google Trends and caption mentions at each monthly lag offset, visualized to reveal timing relationships.
                            </p>
                          </ExpandableExplanation>

                        </>
                      );
                    })()}
                  </div>



                  {/* 8) Lag summary report */}
                  <div className="bg-[#FDFDF8] p-4 rounded-lg border-2 border-[#1A1A1A]">
                    <h4 className="comic-title text-xs mb-2">8) Lag summary report</h4>

                    {(() => {
                      const rows = (plots.lag_report ?? []).map((r: any) => ({
                        metric: String(r.metric),
                        value: Number(r.value),
                      }));

                      if (!rows.length) {
                        return (
                          <p className="comic-text text-[12px] opacity-90">
                            No lag summary data available for this event.
                          </p>
                        );
                      }

                      const get = (name: string) => rows.find((x) => x.metric === name)?.value;

                      const pear0 = get("pearson_0lag");
                      const spe0 = get("spearman_0lag");
                      const ken0 = get("kendall_0lag");
                      const bestLag = get("best_lag_months");
                      const bestCorr = get("best_lag_corr");

                      const hasBest = Number.isFinite(bestLag) && Number.isFinite(bestCorr);

                      // Keep the exact 5 lines you show in the screenshot (fixed order)
                      const ordered = [
                        { key: "pearson_0lag", label: "Pearson (lag 0)", val: pear0, fmt: (x: number) => x.toFixed(3) },
                        { key: "spearman_0lag", label: "Spearman (lag 0)", val: spe0, fmt: (x: number) => x.toFixed(3) },
                        { key: "kendall_0lag", label: "Kendall τ (lag 0)", val: ken0, fmt: (x: number) => x.toFixed(3) },
                        { key: "best_lag_months", label: "Best lag (months)", val: bestLag, fmt: (x: number) => x.toFixed(0) },
                        { key: "best_lag_corr", label: "Best correlation", val: bestCorr, fmt: (x: number) => x.toFixed(3) },
                      ];

                      // Event-specific interpretation sentence (same style as 6 & 7)
                      const bestSentence = !hasBest
                        ? "Best-lag information is not available for this event."
                        : (() => {
                            const lag = bestLag as number;
                            const r = bestCorr as number;

                            const timing =
                              lag === 0
                                ? "the strongest alignment is synchronous (same month)"
                                : lag > 0
                                ? `the strongest alignment appears at a +${lag} month shift (time-shifted relationship)`
                                : `the strongest alignment appears at a ${lag} month shift (time-shifted relationship)`;

                            const compare0 =
                              Number.isFinite(pear0)
                                ? ` At lag 0, Pearson is ${Number(pear0).toFixed(3)}, so the alignment is ${
                                    Math.abs(r) > Math.abs(Number(pear0)) ? "stronger" : "not stronger"
                                  } when shifting in time.`
                                : "";

                            return `Best alignment occurs at lag ${lag.toFixed(0)} month(s) (best r = ${r.toFixed(
                              3
                            )}), meaning ${timing}.${compare0}`;
                          })();

                      return (
                        <>
                          {/* Clean “table” cards */}
                          <div className="mt-1 space-y-2">
                            {ordered.map((item) => {
                              const ok = Number.isFinite(item.val);

                              return (
                                <div
                                  key={item.key}
                                  className="flex items-center justify-between border-2 border-[#1A1A1A] rounded-lg px-3 py-2 transition-colors"
                                  style={{
                                    boxShadow: "2px 2px 0 #1A1A1A",
                                    ...lagValueStyle(item.key, item.val),
                                  }}
                                >
                                  <div className="min-w-0">
                                    <div className="comic-title text-[11px]">{item.label}</div>
                                    <div className="comic-text text-[10px] opacity-70 font-mono">
                                      {item.key}
                                    </div>
                                  </div>

                                  <div className="comic-title text-[14px] tabular-nums">
                                    {ok ? item.fmt(item.val as number) : "—"}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <ExpandableExplanation
                            short={
                              <>
                                <b>What this shows:</b> a compact summary of the lag analysis.{" "}
                                {hasBest ? (
                                  <>
                                    Strongest alignment is at{" "}
                                    <span className="comic-title">lag {Number(bestLag).toFixed(0)}</span>{" "}
                                    (best r = <span className="comic-title">{Number(bestCorr).toFixed(3)}</span>).
                                  </>
                                ) : (
                                  <>Best-lag values are missing for this event.</>
                                )}
                              </>
                            }
                          >
                            <p>
                              <b>Interpretation:</b> {bestSentence}
                            </p>

                            {lagReportExplanation}
                            
                            <p className="comic-text text-[9px] mt-3 opacity-60 leading-snug">
                              <b>Data source:</b> Summary statistics from lag correlation analysis, including Pearson, Spearman, and Kendall correlation coefficients at zero lag (synchronous) and at the optimal time offset.
                            </p>
                          </ExpandableExplanation>
                        </>
                      );
                    })()}
                  </div>


                  {/* 9) Event slice (from google_trends_event_*.json) */}
                  <div className="bg-[#FDFDF8] p-4 rounded-lg border-2 border-[#1A1A1A]">
                    <h4 className="comic-title text-xs mb-2">
                      9) Event slice (Google Trends within the event window)
                    </h4>

                    {(() => {
                      const slice = buildEventSlice(plots.google_trends_event);

                      if (!slice || !slice.raw?.length || !slice.rawKeys?.length) {
                        return (
                          <p className="comic-text text-[10px] opacity-80 leading-snug">
                            No event-slice series found in{" "}
                            <span className="font-mono">plots.google_trends_event</span>.
                          </p>
                        );
                      }

                      const palette = ["#457B9D", "#E76F51", "#2A9D8F", "#8D5B4C", "#E63946", "#6D597A"];
                      const prettyName = (k: string) => k.replaceAll("_", " ");

                      const commonLegend = (
                        <Legend
                          verticalAlign="bottom"
                          align="left"
                          height={26}
                          iconType="plainline"
                          wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
                        />
                      );

                      return (
                        <>
                          {/* RAW */}
                          <div className="mb-4">


                            <ResponsiveContainer width="100%" height={170}>
                              <LineChart
                                data={slice.raw}
                                margin={{ top: 10, right: 10, left: 10, bottom: 18 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A20" />

                                <XAxis
                                  dataKey="ts"
                                  type="number"
                                  scale="time"
                                  domain={["dataMin", "dataMax"]}
                                  tick={{ fontSize: 10 }}
                                  tickFormatter={(ts) =>
                                    formatMonthLabel(new Date(Number(ts)).toISOString())
                                  }
                                  axisLine={false}
                                  tickLine={false}
                                  label={{
                                    value: "Month",
                                    position: "insideBottom",
                                    offset: -8,
                                    style: { fontSize: 10 },
                                  }}
                                />

                                <YAxis
                                  tick={{ fontSize: 10 }}
                                  axisLine={false}
                                  tickLine={false}
                                  label={{
                                    value: "Search interest (0–100)",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: { fontSize: 10 },
                                  }}
                                />

                                <Tooltip
                                  labelFormatter={(ts) =>
                                    formatMonthLabel(new Date(Number(ts)).toISOString())
                                  }
                                  contentStyle={{
                                    backgroundColor: "#FDFDF8",
                                    border: "2px solid #1A1A1A",
                                    borderRadius: "8px",
                                    fontSize: "11px",
                                  }}
                                />

                                {commonLegend}

                                {highlightStartTs != null && highlightEndTs != null && (
                                  <ReferenceArea
                                    x1={highlightStartTs}
                                    x2={highlightEndTs}
                                    strokeOpacity={0}
                                    fill="rgba(230,57,70,0.18)"
                                  />
                                )}

                                {slice.rawKeys.map((k, i) => (
                                  <Line
                                    key={k}
                                    type="monotone"
                                    dataKey={k}
                                    stroke={palette[i % palette.length]}
                                    strokeWidth={2.5}
                                    dot={false}
                                    name={prettyName(k)}
                                  />
                                ))}
                              </LineChart>
                            </ResponsiveContainer>

                            <p className="comic-text text-[10px] mt-2 opacity-80 leading-snug">
                            Raw search interest within the event window.
                            The shaded region marks the event period; peaks inside it indicate increases in public attention during the event compared to surrounding months.
                            </p>
                            <p className="comic-text text-[9px] mt-2 opacity-60 leading-snug">
                              <b>Data source:</b> Multiple query-specific Google search interest series collected during and around the event period, providing detailed temporal perspectives on different aspects of public attention.
                            </p>
                          </div>

                          {/* NORMALIZED */}
                          <div>


                            <ResponsiveContainer width="100%" height={170}>
                              <LineChart
                                data={slice.z}
                                margin={{ top: 10, right: 10, left: 10, bottom: 18 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A20" />

                                <XAxis
                                  dataKey="ts"
                                  type="number"
                                  scale="time"
                                  domain={["dataMin", "dataMax"]}
                                  tick={{ fontSize: 10 }}
                                  tickFormatter={(ts) =>
                                    formatMonthLabel(new Date(Number(ts)).toISOString())
                                  }
                                  axisLine={false}
                                  tickLine={false}
                                  label={{
                                    value: "Month",
                                    position: "insideBottom",
                                    offset: -8,
                                    style: { fontSize: 10 },
                                  }}
                                />

                                <YAxis
                                  tick={{ fontSize: 10 }}
                                  axisLine={false}
                                  tickLine={false}
                                  label={{
                                    value: "z-score",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: { fontSize: 10 },
                                  }}
                                />

                                <Tooltip
                                  labelFormatter={(ts) =>
                                    formatMonthLabel(new Date(Number(ts)).toISOString())
                                  }
                                  contentStyle={{
                                    backgroundColor: "#FDFDF8",
                                    border: "2px solid #1A1A1A",
                                    borderRadius: "8px",
                                    fontSize: "11px",
                                  }}
                                />

                                {commonLegend}

                                {highlightStartTs != null && highlightEndTs != null && (
                                  <ReferenceArea
                                    x1={highlightStartTs}
                                    x2={highlightEndTs}
                                    strokeOpacity={0}
                                    fill="rgba(230,57,70,0.18)"
                                  />
                                )}

                                {(slice.zKeys?.length ? slice.zKeys : slice.rawKeys).map((k, i) => (
                                  <Line
                                    key={k}
                                    type="monotone"
                                    dataKey={k}
                                    stroke={palette[i % palette.length]}
                                    strokeWidth={2.5}
                                    dot={false}
                                    name={prettyName(k)}
                                  />
                                ))}
                              </LineChart>
                            </ResponsiveContainer>

                            <p className="comic-text text-[10px] mt-2 opacity-80 leading-snug">
                              Normalized (z-score) search interest within the event window.
                              Values show deviations from each series’ own baseline (z {" > "} 0 = higher-than-usual, z {" < "} 0 = lower-than-usual), making different queries/themes comparable and highlighting unusually strong spikes during the shaded event period.
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>




                  {/* 10) Monthly semantic groups (clean: 2 titles, no scroll, no word-list legend) */}
                  <div className="bg-[#FDFDF8] p-4 rounded-lg border-2 border-[#1A1A1A]">
                    <h4 className="comic-title text-xs mb-2">10) Monthly semantic groups</h4>

                    {(() => {
                      const mg = plots.monthly_groups;
                      const ts = mg?.timeseries ?? [];

                      if (!ts.length) {
                        return (
                          <p className="comic-text text-[10px] opacity-80">
                            No monthly group data available for this event.
                          </p>
                        );
                      }

                      // -------- helpers (local to plot 10) --------
                      const groupIdxFromKey = (k: string) => {
                        const m = /^group_(\d+)$/.exec(k);
                        return m ? Number(m[1]) : -1;
                      };

                      // pick group keys from the timeseries
                      const allKeys = Object.keys(ts[0]).filter((k) => k.startsWith("group_"));

                      // total volume per group across the window
                      const totals = allKeys
                        .map((key) => ({
                          key,
                          idx: groupIdxFromKey(key),
                          total: ts.reduce((acc: number, row: any) => acc + (Number(row[key]) || 0), 0),
                        }))
                        .sort((a, b) => b.total - a.total);

                      // take TOP 2 groups only (dominant themes)
                      const top2 = totals.slice(0, 2);

                      // robust title resolver:
                      // 1) use groups[idx].label if it exists
                      // 2) else fallback to "Group N"
                      const groupTitle = (key: string) => {
                        const idx = groupIdxFromKey(key);

                        const words: string[] =
                          mg?.groups?.find((g: any) => Number(g.id) === idx)?.words ?? [];

                        // pick a short, human-ish title:
                        // use 1–2 words max, and avoid super short tokens
                        const cleaned = words
                          .map((w) => String(w).replaceAll("_", " "))
                          .filter((w) => w.length >= 4);

                        if (!cleaned.length) return `Group ${idx + 1}`;

                        // Example output: "Health / Disease" style (2 words)
                        const a = cleaned[0] ?? "Group";
                        const b = cleaned[1] ?? "";
                        return b ? `${a} / ${b}` : a;
                      };


                      // two fixed colors, consistent across events
                      const palette = ["#457B9D", "#E63946"];

                      return (
                        <>
                          {/* ✅ Minimal legend: ONLY 2 titles, no scroll, no subtitles */}
                          <div className="flex flex-wrap gap-4 mb-2">
                            {top2.map((g, i) => (
                              <div key={g.key} className="flex items-center gap-2">
                                <span
                                  className="inline-block w-7 h-[3px] rounded"
                                  style={{ backgroundColor: palette[i] }}
                                />
                                <span className="comic-title text-[11px]">{groupTitle(g.key)}</span>
                              </div>
                            ))}
                          </div>

                          <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={ts} margin={{ top: 6, right: 10, left: 10, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A20" />

                              <XAxis
                                dataKey="month"
                                tick={{ fontSize: 10 }}
                                label={{
                                  value: "Month",
                                  position: "insideBottom",
                                  offset: -5,
                                  style: { fontSize: 10 },
                                }}
                              />

                              <YAxis
                                tick={{ fontSize: 10 }}
                                label={{
                                  value: "Caption volume",
                                  angle: -90,
                                  position: "insideLeft",
                                  style: { fontSize: 10 },
                                }}
                              />

                              <Tooltip
                                labelFormatter={(m) => String(m)}
                                contentStyle={{
                                  backgroundColor: "#FDFDF8",
                                  border: "2px solid #1A1A1A",
                                  borderRadius: "8px",
                                  fontSize: "11px",
                                }}
                                formatter={(v: any, name: any) => [v, name]}
                              />

                              {/* ✅ Draw ONLY the top 2 groups */}
                              {top2.map((g, i) => (
                                <Area
                                  key={g.key}
                                  type="monotone"
                                  dataKey={g.key}
                                  stackId="1"
                                  name={groupTitle(g.key)}
                                  stroke="none"          // ✅ prevents the thick black outline artifact
                                  fill={palette[i]}
                                  fillOpacity={0.28}
                                  isAnimationActive={false}
                                />
                              ))}
                            </AreaChart>
                          </ResponsiveContainer>

                          <p className="comic-text text-[10px] mt-2 opacity-80 leading-snug">
                            Monthly evolution of dominant semantic caption groups within the event window.
                            Stacked areas show how the relative volume of different semantic themes changes over time, highlighting which topics dominate caption content during and around the event.
                          </p>
                          <p className="comic-text text-[9px] mt-1 opacity-60">
                            Window: {mg?.window_start} → {mg?.window_end}
                          </p>
                          <p className="comic-text text-[9px] mt-2 opacity-60 leading-snug">
                            <b>Data sources:</b> Word frequencies from cartoon image descriptions, location captions, uncanny descriptions, and caption questions, combined with aggregated Google search trends across all event-related tokens. Semantic groups identified through clustering analysis of co-occurring caption words aligned with search attention patterns.
                          </p>
                        </>
                      );
                    })()}
                  </div>


                </div> 

              </div> 

              {/* --- End-of-page synthesis (per main event) --- */}
              {event.id === "covid" || event.id === "war" || event.id === "trump" || event.id === "climate" ? (
                <div className="mt-8">
                  {eventSynthesis({
                    eventId: event.id,
                    highlight,
                    corr,
                    plots,
                  })}
                </div>
              ) : null}

              {/* Keywords */}
              <div className="flex flex-wrap gap-2">
                {event.keywords.map((keyword, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="px-3 py-1 bg-white border-2 border-[#1A1A1A] rounded-full comic-text text-[10px] hover:border-[#E63946] transition-colors"
                    style={{ boxShadow: "2px 2px 0 #1A1A1A" }}
                  >
                    #{keyword}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
      </motion.div>
    </motion.div>
  );
}
