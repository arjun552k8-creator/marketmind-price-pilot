import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2, Trophy, Radio } from "lucide-react";
import { getMandiPrices } from "@/lib/prices.functions";
import { CROPS, STATES, bestIndex, inr, netReturn, transportCost } from "@/lib/markets";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Live mandi prices & net returns — MarketMind" },
      { name: "description", content: "Pick a crop and state to see today's mandi prices, add transport, and find the best-paying market." },
      { property: "og:title", content: "Live mandi prices — MarketMind" },
      { property: "og:description", content: "Today's crop prices across markets with net return after transport." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Demo,
});

const field = "w-full rounded-lg border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Demo() {
  const [crop, setCrop] = useState("Tomato");
  const [state, setState] = useState("Tamil Nadu");
  const [qty, setQty] = useState(10);
  const [rate, setRate] = useState(15);
  const [dist, setDist] = useState<Record<string, number>>({});
  const fetchPrices = useServerFn(getMandiPrices);
  const q = useQuery({ queryKey: ["mandi", crop, state], queryFn: () => fetchPrices({ data: { commodity: crop, state } }), staleTime: 10 * 60_000 });

  const rows = useMemo(() => {
    const recs = q.data?.records ?? [];
    // one row per market (highest modal if several varieties)
    const byMarket = new Map<string, (typeof recs)[number]>();
    for (const r of recs) {
      const k = `${r.market}|${r.district}`;
      const cur = byMarket.get(k);
      if (!cur || r.modalPrice > cur.modalPrice) byMarket.set(k, r);
    }
    return [...byMarket.entries()].map(([key, r], i) => {
      const d = dist[key] ?? (i + 1) * 15;
      const t = transportCost(d, rate);
      return { key, r, d, t, net: netReturn(r.modalPrice, qty, t) };
    }).sort((a, b) => b.net - a.net);
  }, [q.data, dist, rate, qty]);

  const bi = bestIndex(rows.map((x) => x.net));
  const best = rows[bi];
  const nearest = [...rows].sort((a, b) => a.d - b.d)[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="eyebrow">Live prices</p>
      <h1 className="mt-2 text-4xl font-semibold md:text-5xl">Compare markets. Estimate returns.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Today's mandi prices from Agmarknet. Set your quantity, transport rate and distance to each market — net return updates instantly.</p>

      <div className="mt-8 grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-medium">Crop<select className={field + " mt-1"} value={crop} onChange={(e) => { setCrop(e.target.value); setDist({}); }}>{CROPS.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="text-sm font-medium">State<select className={field + " mt-1"} value={state} onChange={(e) => { setState(e.target.value); setDist({}); }}>{STATES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="text-sm font-medium">Quantity (quintals)<input type="number" min={0} className={field + " mt-1"} value={qty} onChange={(e) => setQty(Number(e.target.value) || 0)} /></label>
        <label className="text-sm font-medium">Transport (₹ per km)<input type="number" min={0} className={field + " mt-1"} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} /></label>
      </div>

      {q.isLoading ? (
        <div className="flex items-center gap-2 py-20 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Fetching today's prices…</div>
      ) : (
        <>
          <div className="mt-4 flex items-center gap-2 text-sm">
            {q.data?.source === "live" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-primary-foreground"><Radio className="h-3.5 w-3.5" /> Live · {rows.length} markets · {q.data.records[0]?.arrivalDate}</span>
            ) : (
              <span className="rounded-full bg-accent px-3 py-1 text-accent-foreground">{q.data?.note ?? "Sample data"}</span>
            )}
          </div>

          {best && (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-primary p-6 text-primary-foreground md:col-span-2">
                <p className="flex items-center gap-2 text-sm opacity-80"><Trophy className="h-4 w-4 text-accent" /> Suggested market</p>
                <h2 className="mt-2 text-3xl font-semibold">{best.r.market}</h2>
                <p className="opacity-80">{best.r.district} · {best.d} km · {inr(best.r.modalPrice)}/quintal · {inr(best.t)} transport</p>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <p className="text-sm text-muted-foreground">Estimated net return</p>
                <p className="mt-2 font-display text-4xl font-semibold text-primary">{inr(best.net)}</p>
                {nearest && nearest.key !== best.key && <p className="mt-1 text-sm text-muted-foreground">{inr(best.net - nearest.net)} more than nearest market</p>}
              </div>
            </div>
          )}

          <div className="mt-8 overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left"><tr>{["Market", "Min–Max (₹/qtl)", "Modal (₹/qtl)", "Distance (km)", "Transport", "Net return"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
              <tbody>
                {rows.map((x, i) => (
                  <tr key={x.key} className={`border-t ${i === bi ? "bg-accent/15" : ""}`}>
                    <td className="px-4 py-3"><div className="font-medium">{x.r.market}</div><div className="text-xs text-muted-foreground">{x.r.district} · {x.r.variety}</div></td>
                    <td className="px-4 py-3 text-muted-foreground">{inr(x.r.minPrice)}–{inr(x.r.maxPrice)}</td>
                    <td className="px-4 py-3">{inr(x.r.modalPrice)}</td>
                    <td className="px-4 py-3"><input type="number" min={0} aria-label={`Distance to ${x.r.market}`} className={field + " w-24"} value={x.d} onChange={(e) => setDist((p) => ({ ...p, [x.key]: Number(e.target.value) || 0 }))} /></td>
                    <td className="px-4 py-3">{inr(x.t)}</td>
                    <td className="px-4 py-3 font-semibold">{inr(x.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rows.length > 0 && (
            <div className="mt-8 rounded-xl border bg-card p-6">
              <h3 className="text-xl font-semibold">Net return by market</h3>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rows.slice(0, 12).map((x) => ({ name: x.r.market, net: Math.round(x.net) }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => inr(v)} />
                    <Bar dataKey="net" radius={[6, 6, 0, 0]}>
                      {rows.slice(0, 12).map((x, i) => <Cell key={x.key} fill={i === bi ? "var(--accent)" : "var(--primary)"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
      <p className="mt-8 text-xs text-muted-foreground">Distances are your estimates — edit them for your village. Suggestions are decision support, not a guarantee of price or profit.</p>
    </div>
  );
}
